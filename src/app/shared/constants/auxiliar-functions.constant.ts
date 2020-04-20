export const treatNumericValueToString = (value): string => {
  const type = typeof value;

  if (type === 'number') {
    return value.toString();
  }
  if (!value) {
    return '';
  }
  return value;
};
