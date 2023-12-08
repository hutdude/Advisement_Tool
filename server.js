require('dotenv').config();

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const Filter = require('bad-words');

//querying file
const dbQueries = require('./src/db/dbQueries');


//parsing files
const parseDepartments = require('./src/parsers/parseDepartments');
const parseCourses = require('./src/parsers/parseCourses');
const parseGenEdReqs = require('./src/parsers/parseGenEdReqs');
const parseProgramRequirements = require('./src/parsers/parseProgramRequirements');
const parseRequirementType = require('./src/parsers/parseRequirementType');
const parseSemesterRecommendations = require('./src/parsers/parseSemesterRecommendations');


// Initialize the bad-words filter
const filter = new Filter();

// Function to delay for a specified amount of time
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle the OpenAI API call with retry logic
async function callOpenAI(userInput, retries = 3, delayTime = 3000) {
    if (filter.isProfane(userInput)) {
        return "I'm sorry, I cannot process requests containing profanity.";
    }

    const prompt = `As an academic advisor for Mississippi State University, respond to the following query:\n\n${userInput}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are a helpful and knowledgeable academic advisor."
            }, {
                role: "user",
                content: userInput
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        if (retries > 0 && error.response && error.response.status === 429) {
            await delay(delayTime);
            return callOpenAI(userInput, retries - 1, delayTime * 2);
        } else {
            throw error;
        }
    }
}



app.post('/api/chat', async (req, res) => {
    try { 
        const userInput = req.body.prompt;
        let context = req.body.context || {};

        // Check for profanity
        if (filter.isProfane(userInput)) {
            return res.json({ response: "I'm sorry, I cannot process requests containing profanity." });
        }

        // Update context and determine the next action
        updateContextBasedOnInput(userInput, context);

        if (context.isComplete) {
            // Handle a complete query
            const response = await handleCompleteQuery(context);
            res.json({ data: response, context: {} }); // Clear context after handling
        } else if (context.needsMoreInfo) {
            // If more information is needed for a structured query
            const followUpQuestion = generateFollowUpQuestion(context);
            res.json({ followUp: followUpQuestion, context: context });
        } else {
            // Use OpenAI for general queries or if the input doesn't match structured queries
            const openAIResponse = await callOpenAI(userInput);
            res.json({ response: openAIResponse, context: context});
        }
    } catch (error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            res.status(500).send('Error processing your request');
        }
});

function updateContextBasedOnInput(userInput, context) {
    // Handle department query
    if (parseDepartments.canHandle(userInput)) {
        const departmentDetails = parseDepartments.process(userInput);
        if (departmentDetails) {
            context.departmentIdentifier = departmentDetails.departmentIdentifier;
            context.queryType = 'department';
            context.isComplete = true;
        }
    }
    // Handle requirement type query
    else if (parseRequirementType.canHandle(userInput)) {
        const requirementType = parseRequirementType.process(userInput);
        if (requirementType) {
            context.requirementTypeId = requirementType.requirementTypeId;
            context.queryType = 'requirementType';
            context.isComplete = true;
        }
    }
    // Handle course query
    else if (parseCourses.canHandle(userInput)) {
        const courseDetails = parseCourses.process(userInput);
        if (courseDetails) {
            context.courseId = courseDetails.courseId;
            context.queryType = 'course';
            context.isComplete = true;
        }
    }
    // Handle program requirements query
    else if (parseProgramRequirements.canHandle(userInput)) {
        const programRequirements = parseProgramRequirements.process(userInput);
        if (programRequirements) {
            context.departmentId = programRequirements.departmentId;
            context.requirementTypeId = programRequirements.requirementTypeId;
            context.queryType = 'programRequirements';
            context.isComplete = programRequirements.departmentId && programRequirements.requirementTypeId;
        }
    }
    // Handle general education requirements query
    else if (parseGenEdReqs.canHandle(userInput)) {
        const genEdRequirements = parseGenEdReqs.process(userInput);
        if (genEdRequirements) {
            context.requirementTypeId = genEdRequirements.requirementTypeId;
            context.queryType = 'genEdRequirements';
            context.isComplete = true;
        }
    }
    // Handle semester recommendations query
    else if (parseSemesterRecommendations.canHandle(userInput)) {
        const semesterRecommendations = parseSemesterRecommendations.process(userInput);
        if (semesterRecommendations) {
            context.departmentId = semesterRecommendations.departmentId;
            context.semester = semesterRecommendations.semester;
            context.queryType = 'semesterRecommendations';
            context.isComplete = semesterRecommendations.departmentId && semesterRecommendations.semester;
        }
    }
    // Additional query types can be added here
}

async function handleCompleteQuery(context) {
    let response;

    switch (context.queryType) {
        case 'department':
            response = await dbQueries.getDepartmentDetails(context.departmentIdentifier);
            break;
        case 'requirementType':
            response = await dbQueries.getRequirementTypes(context.requirementTypeId);
            break;
        case 'course':
            response = await dbQueries.getCourseDetails(context.courseId);
            break;
        case 'programRequirements':
            response = await dbQueries.getProgramRequirements(context.departmentId, context.requirementTypeId);
            break;
        case 'genEdRequirements':
            response = await dbQueries.getGeneralEducationRequirements(context.requirementTypeId);
            break;
        case 'semesterRecommendations':
            response = await dbQueries.getSemesterRecommendations(context.departmentId, context.semester);
            break;
        default:
            // Default case for unrecognized query types
            response = "I'm sorry, I didn't understand your request. Can you please provide more details?";
            break;
    }

    // Reset context after handling
    context.isComplete = false;
    context.queryType = null;
    // Reset other context details as needed

    return response;
}

function generateFollowUpQuestion(context) {
    let followUpQuestion = "";

    switch (context.queryType) {
        case 'department':
            if (!context.departmentIdentifier) {
                followUpQuestion = "Which department are you interested in? Please provide the department name or ID.";
            }
            break;
        case 'requirementType':
            if (!context.requirementTypeId) {
                followUpQuestion = "What type of requirement are you asking about?";
            }
            break;
        case 'course':
            if (!context.courseId) {
                followUpQuestion = "Can you specify the course? Please provide the course code or name.";
            }
            break;
        case 'programRequirements':
            if (!context.departmentId || !context.requirementTypeId) {
                followUpQuestion = "Can you provide more details about the program requirements? I need the department and requirement type.";
            }
            break;
        case 'genEdRequirements':
            if (!context.requirementTypeId) {
                followUpQuestion = "Which general education requirement are you interested in?";
            }
            break;
        case 'semesterRecommendations':
            if (!context.departmentId || !context.semester) {
                followUpQuestion = "For which department and semester do you need recommendations?";
            }
            break;
        default:
            followUpQuestion = "Can you provide more details or clarify your query?";
            break;
    }

    return followUpQuestion;
}

app.post('/api/getCourseDetails', async (req, res) => {
    try {
        const courseIdentifier = req.body.courseIdentifier; // Can be ID or code
        const courseDetails = await dbQueries.getCourseDetails(courseIdentifier);
        res.json({ data: courseDetails });
    } catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).send('Error processing your request');
    }
});

app.post('/api/getDepartmentDetails', async (req, res) => {
    try {
        const departmentIdentifier = req.body.departmentIdentifier; // Can be ID or name
        const departmentDetails = await dbQueries.getDepartmentDetails(departmentIdentifier);
        res.json({ data: departmentDetails });
    } catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.response) {
            console.error('Error response data:', error.response.data);
        }
        res.status(500).send('Error processing your request');
    }
});

app.post('/api/getProgramRequirements', async (req, res) => {
    try {
        const { departmentId, requirementTypeId } = req.body;
        const programRequirements = await dbQueries.getProgramRequirements(departmentId, requirementTypeId);
        res.json({ data: programRequirements });
    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).send('Error processing your request');
    }
});

app.post('/api/getGeneralEducationRequirements', async (req, res) => {
    try {
        const requirementTypeId = req.body.requirementTypeId; // Optional
        const genEdRequirements = await dbQueries.getGeneralEducationRequirements(requirementTypeId);
        res.json({ data: genEdRequirements });
    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).send('Error processing your request');
    }
});

app.post('/api/getRequirementType', async (req, res) => {
    try {
        const requirementType = req.body.requirementType;
        const requirementTypes = await dbQueries.getRequirementTypes(requirementType);
        res.json({ data: requirementTypes });
    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).send('Error processing your request');
    }
});

app.post('/api/getSemesterRecommendations', async (req, res) => {
    try {
        const { departmentId, semester } = req.body;
        const semesterRecommendations = await dbQueries.getSemesterRecommendations(departmentId, semester);
        res.json({ data: semesterRecommendations });
    } catch (error) {
        console.error('Error message:', error.message);
        res.status(500).send('Error processing your request');
    }
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
