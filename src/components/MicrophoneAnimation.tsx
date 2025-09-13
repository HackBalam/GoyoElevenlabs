import { useEffect, useState } from 'react';

interface MicrophoneAnimationProps {
  isListening: boolean;
  isConnected: boolean;
}

export const MicrophoneAnimation = ({ isListening, isConnected }: MicrophoneAnimationProps) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const baseClasses = "w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg";
  
  const microphoneIcon = (
    <svg 
      className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" 
      fill="white" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2C13.1 2 14 2.9 14 4V10C14 11.1 13.1 12 12 12S10 11.1 10 10V4C10 2.9 10.9 2 12 2M19 10V12C19 15.9 15.9 19 12 19S5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17S17 14.8 17 12V10H19M12 19C12.6 19 13 19.4 13 20H16V22H8V20H11C11 19.4 11.4 19 12 19Z"/>
    </svg>
  );

  if (!isConnected) {
    return (
      <div className={`${baseClasses} bg-gray-400 cursor-not-allowed`}>
        {microphoneIcon}
      </div>
    );
  }

  if (isListening) {
    return (
      <div className="relative">
        <div className={`${baseClasses} bg-gradient-to-br from-[#1CC5B8] to-[#7D4AE8] ${pulseAnimation ? 'scale-110' : 'scale-100'}`}>
          {microphoneIcon}
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1CC5B8] to-[#7D4AE8] opacity-30 animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-[#FF6B57] rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gradient-to-br from-[#1CC5B8] to-[#7D4AE8] hover:scale-105 cursor-pointer`}>
      {microphoneIcon}
    </div>
  );
};