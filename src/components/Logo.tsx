import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  colorful?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', colorful = true }) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl'
  };

  const textColorClass = colorful 
    ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-blue-600 to-magenta-600' 
    : 'text-purple-800';

  return (
    <div className={`font-bold ${sizeClasses[size]} flex items-center ltr`}>
      <span className={textColorClass}>SH</span>
      <span className={textColorClass}>AN</span>
      <span className="text-magenta-600 mx-1">
        <Heart 
          size={size === 'small' ? 20 : size === 'medium' ? 24 : 32} 
          fill="currentColor" 
          className="inline-block transform -translate-y-1" 
        />
      </span>
      <span className={textColorClass}>IZKI</span>
    </div>
  );
};

export default Logo;