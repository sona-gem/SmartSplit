export const CATEGORIES = [
  { value: "Food", emoji: "🍔" },
  { value: "Transport", emoji: "🚌" },
  { value: "Hotel", emoji: "🏨" },
  { value: "Activities", emoji: "🎉" },
  { value: "Shopping", emoji: "🛍️" },
  { value: "Other", emoji: "📦" },
];

export function getCategoryEmoji(value) {
  const cat = CATEGORIES.find((c) => c.value === value);
  return cat ? cat.emoji : "📦";
}