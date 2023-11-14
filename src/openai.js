import OpenAI from "openai";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: apiKey });

export async function sendMsgToOpenAI(message) {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error("Error in sendMsgToOpenAI:", error);
    return "Error processing your request.";
  }
}
