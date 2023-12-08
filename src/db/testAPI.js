const axios = require('axios');
require('dotenv').config(); // Ensure this is at the top to load environment variables

// async function testApi() {
//     try {
//         const response = await axios.post('http://localhost:5000/api/chat', {
//             prompt: "Hello, I need help with my courses."
//         });
//         console.log('Response:', response.data);
//     } catch (error) {
//         console.error('Error occurred:');
//         console.error('Error message:', error.message);
//         if (error.response) {
//             // The request was made and the server responded with a status code
//             // that falls out of the range of 2xx
//             console.error('Status:', error.response.status);
//             console.error('Data:', error.response.data);
//             console.error('Headers:', error.response.headers);
//         } else if (error.request) {
//             // The request was made but no response was received
//             console.error('Request:', error.request);
//         } else {
//             // Something happened in setting up the request that triggered an Error
//             console.error('Error:', error.message);
//         }
//         console.error('Config:', error.config);
//     }
// }

// testApi();


async function testOpenAI() {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "You are a helpful and knowledgeable academic advisor."
            }, {
                role: "user",
                content: "Hello, I need help with my courses."
            }]
        }, {
            headers: {
                'Authorization': `Bearer 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` // Replace YOUR_API_KEY with your actual key
            }
        });

        console.log('Response from OpenAI:', response.data);
    } catch (error) {
        console.error('Error occurred:', error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
        }
        console.error('Config:', error.config);
    }
}

testOpenAI();