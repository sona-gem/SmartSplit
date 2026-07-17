//now we will make the store access data via api calls
//stores trip data, loading status , functs that communicate with backend
//import create function to create a store

import { create } from "zustand";

//handle auth and send token with every request
//custom hook
const useTripStore = create((set, get) => ({
  // auth state
  //checks local storage, cause if user refreshes we don't want them to log in again
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,

  //trip state
  trip: null,
  trips: [],
  expenses: [],
  loading: false,
  error: null,

  // auth actions
  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ token: data.token, user: data.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ token: data.token, user: data.user });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null, trip: null, trips: [], expenses: [] });
  },

  // helper to get auth header
  getAuthHeader: () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${get().token}`,
  }),

  //fetch trip + expenses from API
  fetchTrip: async (tripId) => {
    set({ loading: true });
    try {
      const [tripRes, expensesRes] = await Promise.all([
        fetch(`/api/trips/${tripId}`, { headers: get().getAuthHeader() }),
        fetch(`/api/expenses/trip/${tripId}`, {
          headers: get().getAuthHeader(),
        }),
      ]);
      const trip = await tripRes.json();
      const expenses = await expensesRes.json();
      set({ trip, expenses, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTrips: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/trips", {
        headers: get().getAuthHeader(),
      });
      const trips = await res.json();
      set({ trips, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createTrip: async (tripData) => {
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: get().getAuthHeader(),
        body: JSON.stringify(tripData),
      });
      const newTrip = await res.json();
      set((state) => ({ trips: [...state.trips, newTrip] }));
      return newTrip;
    } catch (err) {
      set({ error: err.message });
    }
  },
  // add expense via API
  addExpense: async (expenseData) => {
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: get().getAuthHeader(),
        body: JSON.stringify(expenseData),
      });
      const newExpense = await res.json();
      set((state) => ({ expenses: [...state.expenses, newExpense] }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  //delete expense via API
  deleteExpense: async (expenseId) => {
    try {
      await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: get().getAuthHeader(),
      });
      set((state) => ({
        expenses: state.expenses.filter((e) => e._id !== expenseId),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },
  settleUp: async (tripId, transaction) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/settle`, {
        method: "POST",
        headers: get().getAuthHeader(),
        body: JSON.stringify(transaction),
      });
      const updatedTrip = await res.json();
      set({ trip: updatedTrip });
    } catch (err) {
      set({ error: err.message });
    }
  },

  clearSettlements: async (tripId) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/settle`, {
        method: "DELETE",
        headers: get().getAuthHeader(),
      });
      const updatedTrip = await res.json();
      set({ trip: updatedTrip });
    } catch (err) {
      set({ error: err.message });
    }
  },
}));

export default useTripStore;
