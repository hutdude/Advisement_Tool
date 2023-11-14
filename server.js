const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();
app.use(cors()); // Use cors
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-davinci-003",
            prompt: req.body.prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
        res.json({ response: response.data.choices[0].text });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Error processing your request');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
