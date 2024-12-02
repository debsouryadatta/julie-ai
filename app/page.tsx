"use client";

import transcript from "@/actions/transcript";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Recorder from "@/components/Recorder";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import Messages from "@/components/Messages";
import { Settings2, SettingsIcon } from "lucide-react";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import { AI_GF_PROMPT } from "@/lib/prompt";
import ApiKeysDialog from "@/components/ApiKeysDialog";
import { toast } from "sonner";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [groqKey, setGroqKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    if (state.response && state.sender) {
      localStorage.setItem("messages", JSON.stringify([
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]));
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]);
      setLoading(false);
    }
  }, [state]);

  useEffect(()=> {
    let messages = JSON.parse(localStorage.getItem("messages") as string);
    if(messages){
      const last20Messages = messages.slice(-20);
      setMessages(last20Messages);
    }
    setGroqKey(localStorage.getItem("GROQ_API_KEY") || "");
    setElevenLabsKey(localStorage.getItem("ELEVENLABS_API_KEY") || "");
  }, []);

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // Submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };


  const handleSubmit = (e:| React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      if (fileRef.current && fileRef.current.files) {
        formData.append("audio", fileRef.current.files[0]);
      }
      formData.append("messages", JSON.stringify([...messages, {
        sender: "",
        response: AI_GF_PROMPT,
        id: "",
      }]));
      formData.append("groqKey", groqKey);
      formAction(formData);
    } catch (error) {
      console.log("Error submitting form to actions file:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  return (
    <main className="bg-black h-screen overflow-y-scroll">
      <header className="flex fixed top-0 justify-between items-center text-white w-full px-5 py-1 z-50 bg-black">
        <div className="flex items-center">
          <Image
            src="https://res.cloudinary.com/diyxwdtjd/image/upload/v1727810716/projects/julie_gez2o2.png
            "
            alt="Logo"
            width={50}
            height={45}
            className="h-12 mr-1"
          />
          <span className="text-2xl font-[900] font-serif">Julie ♡</span>
        </div>

          <BeatLoader color="#ffffff" loading={loading} />
          <div className="flex items-center">
            <ApiKeysDialog groqKey={groqKey} elevenLabsKey={elevenLabsKey} setGroqKey={setGroqKey} setElevenLabsKey={setElevenLabsKey} />
            <div className="p-2 m-2 rounded-full cursor-pointer bg-indigo-500 text-black transition-all ease-in-out duration-150 hover:bg-indigo-900 hover:text-white flex justify-center items-center"
              onClick={() => setDisplaySettings(!displaySettings)}
            >
              <SettingsIcon
                size={20}
              />
              <span className="font-bold ml-[2px] -mt-[2px]">voice</span>
            </div>
          </div>
      </header>


      <form onSubmit={handleSubmit} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-indigo-900 to-black">
          <Messages messages={messages} />
        </div>

        <input type="file" name="audio" ref={fileRef} hidden />
        <button type="submit" hidden ref={submitButtonRef} />

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio} recordingStatus={recordingStatus} setRecordingStatus={setRecordingStatus} groqKey={groqKey} elevenLabsKey={elevenLabsKey} />
          <div className="">
            <VoiceSynthesizer state={state} displaySettings={displaySettings} recordingStatus={recordingStatus} setRecordingStatus={setRecordingStatus} elevenLabsKey={elevenLabsKey} />
          </div>
        </div>
      </form>
    </main>
  );
}