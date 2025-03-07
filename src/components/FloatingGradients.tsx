
import React, { useEffect, useRef } from 'react';

export const FloatingGradients = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing animation frames on unmount
    return () => {
      if (containerRef.current) {
        // Clean up if needed
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-5%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-[100px] animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[30%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-pink-200/20 dark:bg-pink-900/20 blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default FloatingGradients;
