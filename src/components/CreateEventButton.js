import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center shadow-md hover:shadow-lg transition-all"
    >
      <span>Create Event</span>
    </button>
  );
}
