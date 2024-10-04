"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { createClient } from "@deepgram/sdk"; // Import Deepgram SDK

type State = {
  sender: string;
  response: string | null | undefined;
};

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY); // Initialize Deepgram client

function VoiceSynthesizer({
  state,
  displaySettings,
}: {
  state: State;
  displaySettings: boolean;
}) {
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynth(window.speechSynthesis);
    }
  }, [window]);

  const getAudio = async (text: string) => {
    const url = "https://api.deepgram.com/v1/speak?model=aura-luna-en";
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
    const audio = new Audio(urlBlob);
    audio.play();
  };

  useEffect(() => {
    if (!state.response) return;

    // Call the getAudio function instead of using the SpeechSynthesis API
    getAudio(state.response);
  }, [state]);

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices[0]);
  }, [window]);

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === e.target.value);
    if (!voice) return;
    setVoice(voice);
  };

  const handlePitchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPitch(parseFloat(e.target.value));
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRate(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              value={voice?.name}
              onChange={handleVoiceChange}
              className="flex-1 bg-purple-500 text-white border border-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-purple-500 dark:focus:border-purple-500"
            >
              {window.speechSynthesis.getVoices().map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex pb-5">
            <div className="p-2">
              <p className="text-xs text-gray-500">Pitch:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={handlePitchChange}
                className="accent-purple-500"
              />
            </div>

            <div className="p-2">
              <p className="text-xs text-gray-500">Speed:</p>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={handleRateChange}
                className="accent-purple-500"
              />
            </div>

            <div className="p-2">
              <p className="text-xs text-gray-500">Volume:</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="accent-purple-500"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default VoiceSynthesizer;