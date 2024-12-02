"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ApiKeysDialog({ groqKey, elevenLabsKey, setGroqKey, setElevenLabsKey }: {
  groqKey: string;
  elevenLabsKey: string;
  setGroqKey: (key: string) => void;
  setElevenLabsKey: (key: string) => void;}) {
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedElevenLabsKey = localStorage.getItem("elevenLabsKey") || "";
    const savedGroqKey = localStorage.getItem("groqKey") || "";
    setElevenLabsKey(savedElevenLabsKey);
    setGroqKey(savedGroqKey);
  }, []);

  const handleElevenLabsKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setElevenLabsKey(newKey);
  };

  const handleGroqKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setGroqKey(newKey);
  };

  const handleSave = () => {
    localStorage.setItem("ELEVENLABS_API_KEY", elevenLabsKey);
    localStorage.setItem("GROQ_API_KEY", groqKey);
    toast.success("API keys saved successfully!");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-2 m-2 rounded-full cursor-pointer bg-indigo-500 text-black transition-all ease-in-out duration-150 hover:bg-indigo-900 hover:text-white flex justify-center items-center">
          <Settings2 size={20} />
          <span className="font-bold ml-[2px] -mt-[2px]">Api Keys</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">API Settings</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your API keys for voice and text services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="elevenlabs" className="text-white">
              ElevenLabs API Key
            </Label>
            <div className="relative">
              <Input
                id="elevenlabs"
                type={showElevenLabsKey ? "text" : "password"}
                value={elevenLabsKey}
                onChange={handleElevenLabsKeyChange}
                className="bg-zinc-800 border-zinc-700 text-white pr-10"
                placeholder="Enter your ElevenLabs API key"
              />
              <button
                type="button"
                onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showElevenLabsKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="groq" className="text-white">
              Groq API Key
            </Label>
            <div className="relative">
              <Input
                id="groq"
                type={showGroqKey ? "text" : "password"}
                value={groqKey}
                onChange={handleGroqKeyChange}
                className="bg-zinc-800 border-zinc-700 text-white pr-10"
                placeholder="Enter your Groq API key"
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                {showGroqKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
