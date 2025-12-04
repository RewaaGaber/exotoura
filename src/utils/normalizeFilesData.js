export const normalizeFilesInData = (input) => {
  if (input instanceof FormData) {
    const normalized = {};

    for (const [key, value] of input.entries()) {
      if (value instanceof File) {
        if (value.type.startsWith("image/")) {
          normalized[key] = URL.createObjectURL(value);
        } else {
          normalized[key] = value;
        }
      } else {
        normalized[key] = value;
      }
    }
    return normalized;
  } else {
    return input;
  }
};
