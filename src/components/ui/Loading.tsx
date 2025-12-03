import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loading({ fullScreen = false, text = 'Loading...' }: LoadingProps) {
  const Container = fullScreen ? 'div' : 'div';
  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80' 
    : 'flex min-h-[400px] w-full items-center justify-center p-8';

  return (
    <Container className={containerClasses}>
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Logo/Spinner */}
        <div className="relative h-20 w-20">
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20 duration-1000"></div>
          
          {/* Rotating gradient ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent shadow-[0_0_15px_rgba(79,70,229,0.3)]"></div>
          
          {/* Inner rotating ring (reverse) */}
          <div className="absolute inset-3 animate-spin rounded-full border-[3px] border-indigo-400 border-b-transparent direction-reverse delay-150"></div>
          
          {/* Center dot */}
          <div className="absolute inset-[30%] animate-pulse rounded-full bg-indigo-600 shadow-inner"></div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {text}
          </h3>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-600 delay-0"></div>
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-600 delay-150"></div>
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-600 delay-300"></div>
          </div>
        </div>
      </div>
    </Container>
  );
}
