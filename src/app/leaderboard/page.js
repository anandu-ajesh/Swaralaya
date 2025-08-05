"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to get gradient background class based on house name
  const getHouseColorClass = (house) => {
    switch (house.toLowerCase()) {
      case "nalanda":
        return "bg-gradient-to-r from-blue-500 to-blue-300";
      case "taxila":
        return "bg-gradient-to-r from-green-500 to-green-300";
      case "ujjain":
        return "bg-gradient-to-r from-yellow-400 to-yellow-200";
      case "vikramshila":
        return "bg-gradient-to-r from-red-500 to-red-300";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-300";
    }
  };

  // Fetch and process leaderboard data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "leaderboard"),
      (querySnapshot) => {
        const leaderboardList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group by house and sort by total points
        const housePoints = {};

        leaderboardList.forEach((entry) => {
          const { house, item, category, points } = entry;
          housePoints[house] = housePoints[house] || { points: 0, events: [] };
          housePoints[house].points += Number(points);
          housePoints[house].events.push({ item, category, points });
        });

        const leaderboard = Object.entries(housePoints)
          .map(([house, data]) => ({
            house,
            points: data.points,
            events: data.events,
          }))
          .sort((a, b) => b.points - a.points); // Sort by points descending

        setLeaderboardData(leaderboard);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching leaderboard data:", error);
        setError("Failed to fetch leaderboard data. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-indigo-100 text-black p-6 sm:p-10">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 tracking-tight" style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.3)" }}>
        Leaderboard
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <div className="flex items-center gap-4 bg-white/10 rounded-lg p-6 shadow-lg">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
            <p className="text-lg sm:text-xl font-medium">Loading leaderboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center p-10">
          <div className="bg-white/10 rounded-lg p-6 shadow-lg text-center text-red-300 text-lg sm:text-xl">
            {error}
          </div>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="flex justify-center p-10">
          <div className="bg-white/10 rounded-lg p-6 shadow-lg text-center text-lg sm:text-xl">
            No leaderboard data available
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white/10 rounded-xl shadow-2xl p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20 rounded-t-lg">
                <th className="py-4 px-6 font-semibold text-lg sm:text-xl text-black/90">House</th>
                <th className="py-4 px-6 font-semibold text-lg sm:text-xl text-black/90">Item</th>
                <th className="py-4 px-6 font-semibold text-lg sm:text-xl text-black/90">Category</th>
                <th className="py-4 px-6 font-semibold text-lg sm:text-xl text-black/90">Points</th>
                <th className="py-4 px-6 font-semibold text-lg sm:text-xl text-black/90">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((houseData, index) =>
                houseData.events.map((event, eventIndex) => (
                  <tr
                    key={`${houseData.house}-${eventIndex}`}
                    className={`border-b border-white/10 ${getHouseColorClass(houseData.house)} bg-opacity-30 hover:bg-opacity-40 hover:scale-[1.01] transition-all duration-200`}
                  >
                    {eventIndex === 0 && (
                      <td
                        className="py-4 px-6 text-white text-base sm:text-lg font-bold"
                        rowSpan={houseData.events.length}
                      >
                        {houseData.house}
                      </td>
                    )}
                    <td className="py-4 px-6 text-white text-base sm:text-lg">{event.item}</td>
                    <td className="py-4 px-6 text-white text-base sm:text-lg">{event.category}</td>
                    <td className="py-4 px-6 text-white text-base sm:text-lg">{event.points}</td>
                    {eventIndex === 0 && (
                      <td
                        className="py-4 px-6 text-black lg:text-2xl text-lg font-bold"
                        rowSpan={houseData.events.length}
                      >
                        {houseData.points}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;