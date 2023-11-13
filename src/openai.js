import OpenAI from 'openai';

// Ensure you're using the correct environment variable name (prefixed with REACT_APP_ if using Create React App)
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: apiKey,
});

export async function sendMsgToOpenAI(message) {
  try {
    // Replace the mock call with an actual API call
    const response = await openai.createCompletion({
      model: 'text-davinci-003', // Specify the model you want to use
      prompt: message, // The user input/message
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return response.data.choices[0].text; // Return the response text
  } catch (error) {
    console.error("Error in sendMsgToOpenAI:", error);
    return "Error processing your request."; // Return a default error message
  }
}
