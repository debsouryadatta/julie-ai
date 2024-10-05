"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { createClient } from "@deepgram/sdk"; // Import Deepgram SDK

type State = {
  sender: string;
  response: string | null | undefined;
};

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY); // Initialize Deepgram client

function VoiceSynthesizer({
  state,
  displaySettings, recordingStatus, setRecordingStatus
}: {
  state: State;
  displaySettings: boolean;
  recordingStatus: string;
  setRecordingStatus: (status: string) => void;
}) {
  const [voiceId, setVoiceId] = useState<string>("aura-luna-en"); // Default voice ID
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const getAudio = async (text: string) => {
    const url = `https://api.deepgram.com/v1/speak?model=${voiceId}`;
    const data = JSON.stringify({ text });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: data,
    });

    // Check if the response is OK
    if (!response.ok) {
      console.error("Error fetching audio:", response.statusText);
      return;
    }

    const audioBlob = await response.blob();
    const urlBlob = URL.createObjectURL(audioBlob);
    audioRef.current = new Audio(urlBlob);
    audioRef.current.play();
  };

  useEffect(() => {
    if (!state.response) return;

    // Call the getAudio function instead of using the SpeechSynthesis API
    getAudio(state.response);
  }, [state]);

  useEffect(() => {
    console.log("Recording Status from Voice Synthesizer:", recordingStatus);
    
    if (recordingStatus === "recording" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [recordingStatus]);
  

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVoiceId(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit mb-10">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              defaultValue={voiceId}
              value={voiceId}
              onChange={handleVoiceChange}
              className="flex-1 bg-purple-500 text-white border border-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-purple-500 dark:focus:border-purple-500"
            >
              <option value="aura-asteria-en">Asteria</option>
              <option value="aura-luna-en">Luna</option>
              <option value="aura-stella-en">Stella</option>
              <option value="aura-athena-en">Athena</option>
              <option value="aura-hera-en">Hera</option>
              <option value="aura-perseus-en">Perseus</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}


export default VoiceSynthesizer;