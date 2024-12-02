'use client';

import { Button } from '@/components/ui/button';
import SplineScene from '@/components/SplineScene';
import { Github } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SplinePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-700 to-black text-white">
      {/* Hero Section with Spline */}
      <div className="relative h-[75vh] w-full">
        {/* Spline container */}
        <div className="w-full h-full relative">
          <SplineScene />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Meet Julie ♡</h1>
          <p className="text-xl text-gray-200">Your AI bestie who happens to know tech!</p>
          <Button className="mt-4 hover:bg-indigo-950" onClick={() => router.push('/julie')}>Get Started</Button>
        </div>
      </div>

      <Button className='absolute bottom-4 right-4'>
        <a className="font-bold" href="https://github.com/debsourya/julie-ai" target="_blank" rel="noopener noreferrer">
          <Github className="w-5 -mt-[2px]" />
        </a>
      </Button>
    </div>
  );
}