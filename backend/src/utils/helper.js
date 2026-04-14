export const getSafeString = (value, fallback = '') => String(value ?? fallback);

export const getSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};