// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { db } from "@/lib/firebase-config";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// function Swaralaya() {
//   const router = useRouter();
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [selectedEventId, setSelectedEventId] = useState(null);
//   const [formData, setFormData] = useState({
//     category: "III",
//     completed: false,
//     name: "",
//     second: null,
//     third: null,
//     time: "",
//     venue: "",
//     winner: null,
//   });

//   useEffect(() => {
//     const isAuthenticated =
//       localStorage.getItem("authToken") === "authenticated";
//     if (!isAuthenticated) {
//       router.push("/");
//     } else {
//       const fetchEvents = async () => {
//         try {
//           const querySnapshot = await getDocs(collection(db, "events"));
//           const eventsList = querySnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setEvents(eventsList);
//         } catch (error) {
//           console.error("Error fetching events:", error);
//         }
//       };
//       fetchEvents();
//     }
//   }, [router]);

//   const handleEventSelect = (eventId) => {
//     const selectedEvent = events.find((event) => event.id === eventId);
//     if (selectedEvent) {
//       setSelectedEventId(eventId);
//       setFormData({
//         category: selectedEvent.category || "III",
//         completed: selectedEvent.completed || false,
//         name: selectedEvent.name || "",
//         second: selectedEvent.second || null,
//         third: selectedEvent.third || null,
//         time: selectedEvent.time || "",
//         venue: selectedEvent.venue || "",
//         winner: selectedEvent.winner || null,
//       });
//       setShowUpdateForm(true);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("New Event:", formData);
//       setShowAddForm(false);
//       setFormData({
//         category: "III",
//         completed: false,
//         name: "",
//         second: null,
//         third: null,
//         time: "",
//         venue: "",
//         winner: null,
//       });
//     } catch (error) {
//       console.error("Error adding event:", error);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedEventId) {
//       console.error("No event selected for update");
//       return;
//     }
//     try {
//       const eventRef = doc(db, "events", selectedEventId);
//       await updateDoc(eventRef, {
//         winner: formData.winner,
//         second: formData.second,
//         third: formData.third,
//         completed: true,
//       });
//       console.log("Event updated:", formData);
//       setShowUpdateForm(false);
//       setSelectedEventId(null);

//       const querySnapshot = await getDocs(collection(db, "events"));
//       setEvents(
//         querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//     } catch (error) {
//       console.error("Error updating event:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h1 className="text-3xl font-bold mb-4">Swaralaya Dashboard</h1>
//         <p className="mb-6">Welcome to the Swaralaya admin dashboard!</p>

//         <div className="flex space-x-4 mb-6">
//           <button
//             onClick={() => setShowAddForm(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Add Events
//           </button>
//           <button
//             onClick={() => setShowUpdateForm(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             disabled={events.length === 0}
//           >
//             Update Events
//           </button>
//           <button
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             onClick={() => {
//               router.push("/");
//             }}
//           >
//             Go back
//           </button>
//         </div>

//         {showUpdateForm && (
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">
//               Select Event to Update
//             </label>
//             <select
//               value={selectedEventId || ""}
//               onChange={(e) => handleEventSelect(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               <option value="" disabled>
//                 Select an event
//               </option>
//               {events.map((event) => (
//                 <option key={event.id} value={event.id}>
//                   {event.name} ({event.category})
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {showAddForm && (
//           <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
//               <form onSubmit={handleAddSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">
//                     Category
//                   </label>
//                   <input
//                     type="text"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Time</label>
//                   <input
//                     type="text"
//                     name="time"
//                     value={formData.time}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                     placeholder="e.g., 9:15 am - 9:35 am"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">
//                     Venue
//                   </label>
//                   <input
//                     type="text"
//                     name="venue"
//                     value={formData.venue}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                   >
//                     Submit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowAddForm(false)}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {showUpdateForm && selectedEventId && (
//           <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//               <h2 className="text-2xl font-bold mb-4">Update Event</h2>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">
//                   Event Name
//                 </label>
//                 <p className="w-full p-2 border rounded bg-gray-100">
//                   {formData.name}
//                 </p>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">
//                   Category
//                 </label>
//                 <p className="w-full p-2 border rounded bg-gray-100">
//                   {formData.category}
//                 </p>
//               </div>
//               <form onSubmit={handleUpdateSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">
//                     Winner
//                   </label>
//                   <input
//                     type="text"
//                     name="winner"
//                     value={formData.winner || ""}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">
//                     Second
//                   </label>
//                   <input
//                     type="text"
//                     name="second"
//                     value={formData.second || ""}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">
//                     Third
//                   </label>
//                   <input
//                     type="text"
//                     name="third"
//                     value={formData.third || ""}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="flex items-center">
//                     <input
//                       type="checkbox"
//                       name="completed"
//                       checked={true}
//                       onChange={handleInputChange}
//                       className="mr-2"
//                     />
//                     Completed
//                   </label>
//                 </div>
//                 <div className="flex space-x-4">
//                   <button
//                     type="submit"
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                   >
//                     Update
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowUpdateForm(false);
//                       setSelectedEventId(null);
//                     }}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Swaralaya;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase-config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

function Swaralaya() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
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
        }
      };
      fetchEvents();
    }
  }, [router]);

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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("New Event:", formData);
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
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      console.error("No event selected for update");
      return;
    }
    try {
      const eventRef = doc(db, "events", selectedEventId);
      await updateDoc(eventRef, {
        winner: formData.winner,
        second: formData.second,
        third: formData.third,
        completed: true,
      });
      console.log("Event updated:", formData);
      setShowUpdateForm(false);
      setSelectedEventId(null);

      const querySnapshot = await getDocs(collection(db, "events"));
      setEvents(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center backdrop-blur-xl justify-center bg-gradient-to-br from-indigo-400 via-purple-100 to-pink-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg border border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4 tracking-tight">
          Swaralaya Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage events with ease and elegance
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Add Events
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpdateForm(true)}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md disabled:opacity-50"
            disabled={events.length === 0}
          >
            Update Events
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-md"
          >
            Go Back
          </motion.button>
        </div>

        <AnimatePresence>
          {showUpdateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event to Update
              </label>
              <select
                value={selectedEventId || ""}
                onChange={(e) => handleEventSelect(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
                    >
                      Submit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUpdateForm && selectedEventId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Update Event
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100/50 backdrop-blur-sm">
                    {formData.name}
                  </p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100/50 backdrop-blur-sm">
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
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
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="completed"
                        checked={true}
                        onChange={handleInputChange}
                        className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-400 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Completed
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-teal-700 transition-all duration-300 shadow-md"
                    >
                      Update
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowUpdateForm(false);
                        setSelectedEventId(null);
                      }}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-md"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Swaralaya;