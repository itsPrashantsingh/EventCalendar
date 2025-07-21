import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";

export default function DayEvents() {
  const {
    daySelected,
    filteredEvents,
    setShowEventModal,
    setSelectedEvent,
  } = useContext(GlobalContext);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    if (daySelected) {
      const events = filteredEvents.filter((evt) => {
        const evtStart = dayjs(evt.day);
        const evtEnd = evt.endDate ? dayjs(evt.endDate) : evtStart;
        return daySelected.isSame(evtStart, 'day') || daySelected.isSame(evtEnd, 'day') || (daySelected.isAfter(evtStart) && daySelected.isBefore(evtEnd));
      });
      setDayEvents(events);
    } else {
      setDayEvents([]);
    }
  }, [daySelected, filteredEvents]);

  return (
    <div className="mt-4">
      <p className="text-gray-500 font-bold text-center">
        {daySelected && daySelected.format("dddd, MMMM DD")}
      </p>
      <div className="mt-2">
        {dayEvents.length > 0 ? (
          dayEvents.map((evt, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedEvent(evt);
                setShowEventModal(true);
              }}
              className={`bg-${evt.label}-200 dark:bg-${evt.label}-500 p-2 my-2 text-black text-sm rounded shadow-sm cursor-pointer hover:bg-opacity-80 transition`}
            >
              {evt.title}
            </div>
          ))
        ) : (
          daySelected && <p className="text-center text-gray-500 mt-2">No events for this day.</p>
        )}
      </div>
    </div>
  );
} 