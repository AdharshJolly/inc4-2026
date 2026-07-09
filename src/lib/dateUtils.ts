export const isCompleted = (dateStr: string) => {
  const now = new Date();
  let dateObj = new Date(dateStr);
  if (!isNaN(dateObj.getTime())) {
    dateObj.setHours(23, 59, 59, 999);
    return dateObj < now;
  }
  const match = dateStr.match(/([a-zA-Z]+)\s+\d+(?:\s*-\s*(\d+))?,?\s*(\d{4})/);
  if (match) {
    const month = match[1];
    const day = match[2] || dateStr.match(/\d+/)?.[0];
    const year = match[3];
    if (day) {
      dateObj = new Date(`${month} ${day}, ${year}`);
      if (!isNaN(dateObj.getTime())) {
        dateObj.setHours(23, 59, 59, 999);
        return dateObj < now;
      }
    }
  }
  return false;
};
