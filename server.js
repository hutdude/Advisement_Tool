const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Filter = require('bad-words');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
        const responseText = await callOpenAI(req.body.prompt);
        res.json({ response: responseText });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error processing your request');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
