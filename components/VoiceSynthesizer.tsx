"use client";

import { Github } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type State = {
  sender: string;
  response: string | null | undefined;
};

type VoiceSettings = {
  stability: number;
  similarityBoost: number;
};

function VoiceSynthesizer({
  state,
  displaySettings,
  recordingStatus,
  setRecordingStatus,
  elevenLabsKey
}: {
  state: State;
  displaySettings: boolean;
  recordingStatus: string;
  setRecordingStatus: (status: string) => void;
  elevenLabsKey: string;
}) {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.75,
    similarityBoost: 0.85,
  });
  const [volume, setVolume] = useState(1);
  const [voiceId, setVoiceId] = useState<string>("cgSgspJ2msm6clMCkdW9"); // Default voice ID
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = async (text: string) => {
    try {
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey || '',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarityBoost,
            language_code: "hi",
          }
        }),
      });
  
      if (!response.ok) {
        console.error("Error fetching audio:", response.statusText);
        toast.error("Something went wrong with ElevenLabs");
        return;
      }
  
      const audioBlob = await response.blob();
      const urlBlob = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(urlBlob);
      audioRef.current.volume = volume;
      audioRef.current.play();
    } catch (error) {
      console.log("Error fetching audio from ElevenLabs:", error);
      toast.error("Something went wrong");
    }
  };


  // Play the audio when the response changes i.e when the text is generated
  useEffect(() => {
    if (!state.response) return;
    getAudio(state.response);
  }, [state]);


  // Pause the audio when the recording status changes
  useEffect(() => {
    console.log("Recording Status from Voice Synthesizer:", recordingStatus);

    if (recordingStatus === "recording" && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [recordingStatus]);

  const handleStabilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoiceSettings(prev => ({
      ...prev,
      stability: parseFloat(e.target.value)
    }));
  };

  const handleSimilarityBoostChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVoiceSettings(prev => ({
      ...prev,
      similarityBoost: parseFloat(e.target.value)
    }));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setVoiceId(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      {displaySettings && (
        <>
          <div className="w-fit">
            <p className="text-xs text-gray-500 p-2">Voice:</p>
            <select
              defaultValue={voiceId}
              value={voiceId}
              onChange={handleVoiceChange}
              className="flex-1 bg-purple-500 text-white border border-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-purple-500 dark:focus:border-purple-500"
            >
              <option value="vghiSqG5ezdhd8F3tKAD">Saira</option>
              <option value="mActWQg9kibLro6Z2ouY">Riya</option>
              <option value="cgSgspJ2msm6clMCkdW9">Jessica</option>
              <option value="EXAVITQu4vr4xnSDxMaL">Sarah</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row pb-5">
            <div className="p-2">
              <p className="text-xs text-gray-500">Stability:</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.stability}
                onChange={handleStabilityChange}
                className="accent-purple-500"
              />
            </div>

            <div className="p-2">
              <p className="text-xs text-gray-500">Similarity Boost:</p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.similarityBoost}
                onChange={handleSimilarityBoostChange}
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
      <div className="text-zinc-600 text-sm -mt-3 mb-1"><a className="flex" target="_blank" href="https://github.com/debsouryadatta">
        <span className="font-bold mr-2">Created by</span>
        <span className="font-bold"><Github className="w-5 -mt-[2px]" /></span>
        <span className="font-bold">@debsouryadatta</span>
      </a></div>
    </div>
  );
}

export default VoiceSynthesizer;