// Egyptian symbols data
export const egyptianSymbols = {
  hieroglyphics: {
    top: ['𓀀', '𓀁', '𓀂', '𓀃', '𓀄', '𓀅', '𓀆', '𓀇'],
    additional: ['𓀈', '𓀉', '𓀊', '𓀋', '𓀌', '𓀍'],
    egyptian: ['☥', '𓃭', '𓅓', '𓆣']
  },
  border: ['𓃭', '☥', '𓅓', '𓆣', '𓃭'],
  accents: {
    left: ['𓀈', '☥'],
    right: ['𓀉', '𓃭'],
    top: ['𓅓'],
    bottom: ['𓆣']
  }
};

// Utility function to get random symbol from an array
export const getRandomSymbol = (symbols) => {
  return symbols[Math.floor(Math.random() * symbols.length)];
};

// Utility function to get a specific number of random symbols
export const getRandomSymbols = (symbols, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(getRandomSymbol(symbols));
  }
  return result;
};

// Utility function to generate decorative elements
export const generateDecorativeElements = () => {
  return {
    topRow: getRandomSymbols(egyptianSymbols.hieroglyphics.top, 4),
    additional: getRandomSymbols(egyptianSymbols.hieroglyphics.additional, 6),
    egyptian: getRandomSymbols(egyptianSymbols.hieroglyphics.egyptian, 4)
  };
};

// Utility function to generate border elements
export const generateBorderElements = () => {
  return egyptianSymbols.border;
};

// Utility function to generate accent elements
export const generateAccentElements = () => {
  return {
    left: getRandomSymbols(egyptianSymbols.accents.left, 2),
    right: getRandomSymbols(egyptianSymbols.accents.right, 2),
    top: getRandomSymbols(egyptianSymbols.accents.top, 1),
    bottom: getRandomSymbols(egyptianSymbols.accents.bottom, 1)
  };
}; 