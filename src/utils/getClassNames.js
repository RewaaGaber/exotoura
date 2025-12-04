export const getClassNames = (partClassNames = {}, part) => {
  return partClassNames[part] || "";
};
