
import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center text-deep-blue hover:bg-old-gold/20 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-2 border-old-gold/30"
    >
      <div className="w-16 h-16 mb-4 text-sumerian-clay">{icon}</div>
      <h3 className="font-bold text-lg font-cairo">{title}</h3>
    </button>
  );
};

export default FeatureCard;
