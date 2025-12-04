import React from 'react';
import { generateDecorativeElements, generateBorderElements, generateAccentElements } from '../data/egyptianSymbols';

const EgyptianDecorations = () => {
  const decorativeElements = generateDecorativeElements();
  const borderElements = generateBorderElements();
  const accentElements = generateAccentElements();

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Background hieroglyphic pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(50)].map((_, i) => (
          <div
            key={`bg-${i}`}
            className="absolute text-xl text-amber-700"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: 0.3 + Math.random() * 0.3
            }}
          >
            {decorativeElements.egyptian[i % decorativeElements.egyptian.length]}
          </div>
        ))}
      </div>

      {/* Main decorative elements */}
      <div className="absolute inset-0">
        {/* Top row of hieroglyphics */}
        {decorativeElements.topRow.map((symbol, index) => (
          <div
            key={`top-${index}`}
            className={`absolute text-5xl text-amber-600/30 hover:text-amber-500/50 transition-all duration-1000 ease-in-out ${
              index % 2 === 0 ? 'rotate-12' : '-rotate-12'
            }`}
            style={{
              top: `${5 + index * 12}%`,
              left: `${10 + (index % 5) * 15}%`,
              filter: 'drop-shadow(0 0 2px rgba(180, 83, 9, 0.5))',
              animation: `float ${4 + index % 3}s ease-in-out infinite alternate`
            }}
          >
            {symbol}
          </div>
        ))}

        {/* Side hieroglyphics */}
        {decorativeElements.additional.map((symbol, index) => (
          <div
            key={`side-${index}`}
            className={`absolute text-4xl text-amber-700/40 hover:text-amber-600/60 transition-all duration-700 ${
              index % 2 === 0 ? 'rotate-45' : '-rotate-45'
            }`}
            style={{
              top: `${30 + index * 8}%`,
              left: `${5 + (index % 4) * 5}%`,
              right: `${5 + (index % 4) * 5}%`,
              animation: `pulse ${3 + index % 4}s ease-in-out infinite`,
              textShadow: '0 0 4px rgba(180, 83, 9, 0.3)'
            }}
          >
            {symbol}
          </div>
        ))}

        {/* Large central symbols */}
        {decorativeElements.egyptian.map((symbol, index) => (
          <div
            key={`center-${index}`}
            className="absolute text-6xl text-amber-600/20 hover:text-amber-500/40 transition-all duration-500"
            style={{
              top: `${15 + index * 25}%`,
              left: `${25 + index * 15}%`,
              transform: `scale(${1 + index * 0.05})`,
              filter: 'drop-shadow(0 0 3px rgba(146, 64, 14, 0.4))',
              animation: `glow ${5 + index % 5}s ease-in-out infinite alternate`
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Ornamental border */}
      <div className="absolute top-0 left-0 right-0 h-12 flex justify-between items-center px-6 ">
        {borderElements.map((symbol, index) => (
          <span 
            key={`border-${index}`} 
            className="text-3xl text-amber-600/40 hover:text-amber-500/60 transition-colors duration-300"
            style={{
              animation: `bounce ${2 + index % 3}s ease-in-out infinite`,
              textShadow: '0 0 3px rgba(180, 83, 9, 0.5)'
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-12 flex justify-between items-center px-6">
        {[...borderElements].reverse().map((symbol, index) => (
          <span 
            key={`border-bottom-${index}`} 
            className="text-3xl text-amber-600/40 hover:text-amber-500/60 transition-colors duration-300"
            style={{
              animation: `bounce ${3 + index % 4}s ease-in-out infinite`,
              textShadow: '0 0 3px rgba(180, 83, 9, 0.5)'
            }}
          >
            {symbol}
          </span>
        ))}
      </div>

      {/* Corner accents */}
      <div className="absolute inset-0">
        {/* Top-left corner */}
        <div className="absolute top-4 left-4 text-5xl text-amber-600/50" style={{ animation: 'spin 20s linear infinite' }}>
          {accentElements.left[0]}
        </div>
        
        {/* Top-right corner */}
        <div className="absolute top-4 right-4 text-5xl text-amber-600/50" style={{ animation: 'spin-reverse 25s linear infinite' }}>
          {accentElements.right[0]}
        </div>
        
        {/* Bottom-left corner */}
        <div className="absolute bottom-4 left-4 text-5xl text-amber-600/50" style={{ animation: 'spin 30s linear infinite' }}>
          {accentElements.left[1]}
        </div>
        
        {/* Bottom-right corner */}
        <div className="absolute bottom-4 right-4 text-5xl text-amber-600/50" style={{ animation: 'spin-reverse 35s linear infinite' }}>
          {accentElements.right[1]}
        </div>
      </div>

      {/* Add some CSS animations in the style tag */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(12deg); }
          100% { transform: translateY(-15px) rotate(12deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes glow {
          0% { opacity: 0.2; filter: drop-shadow(0 0 3px rgba(146, 64, 14, 0.4)); }
          100% { opacity: 0.4; filter: drop-shadow(0 0 8px rgba(146, 64, 14, 0.6)); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};

export default EgyptianDecorations;