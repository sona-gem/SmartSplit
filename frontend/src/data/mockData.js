export const mockTrip = {
  id: "trip-1",
  name: "Goa Trip 2025",
  members: [
    { id: "m1", name: "Gem" },
    { id: "m2", name: "Arjun" },
    { id: "m3", name: "Priya" },
  ],
};

export const mockExpenses = [
  {
    id: "e1",
    description: "Hotel",
    amount: 3600,
    paidBy: "m1",        // Gem paid
    splitAmong: ["m1", "m2", "m3"],  // split 3 ways
    date: "2025-12-01",
  },
  {
    id: "e2",
    description: "Beach shack dinner",
    amount: 1200,
    paidBy: "m2",        // Arjun paid
    splitAmong: ["m1", "m2", "m3"],
    date: "2025-12-02",
  },
  {
    id: "e3",
    description: "Scooter rental",
    amount: 800,
    paidBy: "m3",        // Priya paid
    splitAmong: ["m1", "m3"],  // only Gem and Priya
    date: "2025-12-03",
  },
];