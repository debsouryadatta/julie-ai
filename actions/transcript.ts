"use server";

import OpenAI from "openai";


async function transcript(prevState: any, formData: FormData) {
  "use server";

  console.log("FORM DATA:", formData);
  let messagesList = JSON.parse(formData.get("messages") as string);


  // Arranging the messageList into the correct order for openai message history
  messagesList = messagesList.reverse()
  const messages: any = [];

  messagesList.forEach((message: any) => {
    messages.push(
      {"role": "user", "content": message.sender},
      {"role": "system", "content": message.response}
    );
  });
  console.log("MESSAGES:", messages);


  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }
  console.log(">>", file);



  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  // Get audio transcription from Groq Whisper
  const result = await openai.audio.transcriptions.create({
    file: file,
    model: "distil-whisper-large-v3-en",
  });
  console.log(`Transcription: ${result.text}`);


  //  Push the user's input to the messages array
  messages.push({ role: "user", content: result.text });
  messages.shift();
  console.log("MESSAGES:", messages);

  const completions = await openai.chat.completions.create({
    messages: messages,
    model: "llama-3.1-8b-instant",
    max_tokens: 200,
    temperature: 0.5,
  });

  console.log("chatbot: ", completions.choices[0].message?.content);

  const response = completions.choices[0].message?.content;

  const id = Math.random().toString(36);
  return {
    sender: result.text,
    response: response,
    id: id,
  };
}

export default transcript;
