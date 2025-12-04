export const getChangedFields = ({ dirtyFields, data }) => {
  return Object.keys(dirtyFields).reduce((acc, key) => {
    if (dirtyFields[key] && data[key]) {
      acc[key] = data[key];
    }
    return acc;
  }, {});
};
