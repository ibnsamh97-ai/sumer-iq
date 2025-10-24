
import React from 'react';

interface LoadingProps {
  message: string;
}

const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 rounded-lg">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sumerian-clay mb-4"></div>
      <p className="text-deep-blue text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Loading;
