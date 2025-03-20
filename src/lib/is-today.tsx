const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Check if today's date equals "2025-03-20"
export const isTodayTargetDate = (target: string) => {
  const today = getTodayDate();
  return today === target;
};
