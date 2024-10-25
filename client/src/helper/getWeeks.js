// Function to get dates from last Sunday to next Saturday
export const getWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();

  // Calculate the difference to find the previous Monday
  const daysUntilMonday = (currentDay === 0 ? -6 : 1) - currentDay; // If Sunday (0), move back to Monday (-6), otherwise move to last Monday

  // Get last Monday's date
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() + daysUntilMonday);

  // Create array to store dates for the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(lastMonday);
    day.setDate(lastMonday.getDate() + i);
    weekDates.push({
      date: day.getDate(),
      day: day.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    });
  }

  return weekDates;
};
