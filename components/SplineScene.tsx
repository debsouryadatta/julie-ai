'use client';

import Spline from '@splinetool/react-spline';
import { Suspense } from 'react';

export default function SplineScene() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading 3D model...</div>}>
      <Spline
        className="w-full h-full"
        scene="https://prod.spline.design/fM5976-kj5XX5kdk/scene.splinecode"
      />
    </Suspense>
  );
}
