import { useState } from 'react';

const Logo = ({ theme, className = "w-8 h-8 md:w-10 md:h-10" }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback SVG icon
  const FallbackIcon = () => (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      style={{ color: 'var(--accent-color)' }}
    >
      <rect x="3" y="3" width="7" height="7" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <rect x="14" y="3" width="7" height="7" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <rect x="3" y="14" width="7" height="7" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <rect x="14" y="14" width="7" height="7" strokeWidth="2" fill="currentColor" opacity="0.2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  );

  if (imageError) {
    return <FallbackIcon />;
  }

  return (
    <img 
      src={theme === 'light' ? '/logo-light.png' : '/logo-dark.png'} 
      alt="Memory Blocks" 
      className={className}
      onError={handleImageError}
    />
  );
};

export default Logo; 