"use server";

import OpenAI from "openai";


async function transcript(prevState: any, formData: FormData) {
  "use server";

  // console.log("FORM DATA:", formData);
  console.log("Messages 1:", JSON.parse(formData.get("messages") as string));
  
  const groqKey = formData.get("groqKey") as string;
  let messagesList = JSON.parse(formData.get("messages") as string);


  // Arranging the messageList into the correct order for openai message history
  messagesList = messagesList.reverse()
  const messages: any = [];

  messagesList.forEach((message: any, index: number) => {
    if(index === 0) {
      messages.push(
        { "role": "system", "content": message.response }
      );
    } else {
      messages.push(
        { "role": "user", "content": message.sender },
        { "role": "assistant", "content": message.response }
      );
    }
  });
  console.log("Messages 2:", messages);
  // messages.shift();


  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }
  console.log(">>", file);



  const openai = new OpenAI({
    apiKey: groqKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  // Get audio transcription from Groq Whisper
  const result = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-large-v3-turbo",
  });
  console.log(`Transcription: ${result.text}`);


  //  Push the user's input to the messages array
  messages.push({ role: "user", content: result.text });
  console.log("Messages 3:", messages);

  const completions = await openai.chat.completions.create({
    messages: messages,
    model: "llama-3.1-70b-versatile",
    // max_tokens: 300,
    temperature: 0.75, // Better balance between consistency and creativity
    presence_penalty: 0.6, // Encourage more diverse responses
    frequency_penalty: 0.3, // Reduce repetition
    top_p: 0.9 // Add top_p to help with response quality
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