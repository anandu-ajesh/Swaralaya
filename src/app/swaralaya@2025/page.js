"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase-config";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";

function Swaralaya() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showLeaderboardForm, setShowLeaderboardForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [formData, setFormData] = useState({
    category: "III",
    completed: false,
    name: "",
    second: null,
    third: null,
    time: "",
    venue: "",
    winner: null,
  });
  const [leaderboardFormData, setLeaderboardFormData] = useState({
    house: "",
    item: "",
    category: "",
    points: "",
  });
  const [error, setError] = useState("");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [isSubmittingLeaderboard, setIsSubmittingLeaderboard] = useState(false);

  // List of houses for dropdown
  const houses = ["Nalanda", "Taxila", "Ujjain", "Vikramshila"];

  // Fetch events for dropdowns and event updates
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authToken") === "authenticated";
    if (!isAuthenticated) {
      router.push("/");
    } else {
      const fetchEvents = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "events"));
          const eventsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);
        } catch (error) {
          console.error("Error fetching events:", error);
          setError("Failed to fetch events. Please try again.");
        }
      };
      fetchEvents();
    }
  }, [router]);

  // Get unique categories for dropdown
  const uniqueCategories = [...new Set(events.map((event) => event.category))];

  const handleEventSelect = (eventId) => {
    const selectedEvent = events.find((event) => event.id === eventId);
    if (selectedEvent) {
      setSelectedEventId(eventId);
      setFormData({
        category: selectedEvent.category || "III",
        completed: selectedEvent.completed || false,
        name: selectedEvent.name || "",
        second: selectedEvent.second || null,
        third: selectedEvent.third || null,
        time: selectedEvent.time || "",
        venue: selectedEvent.venue || "",
        winner: selectedEvent.winner || null,
      });
      setShowUpdateForm(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLeaderboardInputChange = (e) => {
    const { name, value } = e.target;
    setLeaderboardFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.name || !formData.time || !formData.venue) {
      setError("All event fields are required");
      return;
    }
    setIsSubmittingAdd(true);
    try {
      await addDoc(collection(db, "events"), {
        category: formData.category,
        completed: formData.completed,
        name: formData.name,
        second: formData.second,
        third: formData.third,
        time: formData.time,
        venue: formData.venue,
        winner: formData.winner,
      });
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setShowAddForm(false);
      setFormData({
        category: "III",
        completed: false,
        name: "",
        second: null,
        third: null,
        time: "",
        venue: "",
        winner: null,
      });
      setError("");
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      setError("No event selected for update");
      return;
    }
    setIsSubmittingUpdate(true);
    try {
      const eventRef = doc(db, "events", selectedEventId);
      await updateDoc(eventRef, {
        winner: formData.winner,
        second: formData.second,
        third: formData.third,
        completed: formData.completed,
      });
      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setShowUpdateForm(false);
      setSelectedEventId(null);
      setError("");
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please try again.");
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleLeaderboardSubmit = async (e) => {
    e.preventDefault();
    if (
      !leaderboardFormData.house ||
      !leaderboardFormData.item ||
      !leaderboardFormData.category ||
      !leaderboardFormData.points
    ) {
      setError("All leaderboard fields are required");
      return;
    }
    setIsSubmittingLeaderboard(true);
    try {
      await addDoc(collection(db, "leaderboard"), {
        house: leaderboardFormData.house,
        item: leaderboardFormData.item,
        category: leaderboardFormData.category,
        points: Number(leaderboardFormData.points),
      });
      setLeaderboardFormData({
        house: "",
        item: "",
        category: "",
        points: "",
      });
      setShowLeaderboardForm(false);
      setError("");
    } catch (error) {
      console.error("Error adding leaderboard entry:", error);
      setError("Failed to add leaderboard entry. Please try again.");
    } finally {
      setIsSubmittingLeaderboard(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Swaralaya Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Manage events and leaderboard
        </p>

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Event
          </button>
          <button
            onClick={() => setShowUpdateForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
            disabled={events.length === 0}
          >
            Update Event
          </button>
          <button
            onClick={() => setShowLeaderboardForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
          >
            Add Leaderboard Entry
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>

        {showUpdateForm && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Event to Update
            </label>
            <select
              value={selectedEventId || ""}
              onChange={(e) => handleEventSelect(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            >
              <option value="" disabled>
                Select an event
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Add New Event
              </h2>
              <form onSubmit={handleAddSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="e.g., 9:15 am - 9:35 am"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingAdd}
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center ${
                      isSubmittingAdd ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmittingAdd ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-blue-200 border-blue-600 rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showUpdateForm && selectedEventId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Update Event
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black">
                  {formData.name}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-black">
                  {formData.category}
                </p>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Winner
                  </label>
                  <input
                    type="text"
                    name="winner"
                    value={formData.winner || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Second
                  </label>
                  <input
                    type="text"
                    name="second"
                    value={formData.second || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Third
                  </label>
                  <input
                    type="text"
                    name="third"
                    value={formData.third || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="completed"
                      checked={formData.completed}
                      onChange={handleInputChange}
                      className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Completed
                    </span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingUpdate}
                    className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center justify-center ${
                      isSubmittingUpdate ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmittingUpdate ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-green-200 border-green-600 rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setSelectedEventId(null);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showLeaderboardForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Add Leaderboard Entry
              </h2>
              <form onSubmit={handleLeaderboardSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House
                  </label>
                  <select
                    name="house"
                    value={leaderboardFormData.house}
                    onChange={handleLeaderboardInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  >
                    <option value="" disabled>
                      Select a house
                    </option>
                    {houses.map((house) => (
                      <option key={house} value={house}>
                        {house}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <input
                    type="text"
                    name="item"
                    value={leaderboardFormData.item}
                    onChange={handleLeaderboardInputChange}
                    list="eventNames"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  />
                  <datalist id="eventNames">
                    {events.map((event) => (
                      <option key={event.id} value={event.name} />
                    ))}
                  </datalist>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={leaderboardFormData.category}
                    onChange={handleLeaderboardInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    value={leaderboardFormData.points}
                    onChange={handleLeaderboardInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingLeaderboard}
                    className={`bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors flex items-center justify-center ${
                      isSubmittingLeaderboard ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmittingLeaderboard ? (
                      <>
                        <div className="w-5 h-5 border-2 border-t-purple-200 border-purple-600 rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeaderboardForm(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Swaralaya;