import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import { expandRecurringEvents } from "../util";

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
      // Expand recurring events for the visible month
      const expanded = expandRecurringEvents(
        filteredEvents,
        daySelected.startOf('month').subtract(7, 'day'),
        daySelected.endOf('month').add(7, 'day')
      );
      const events = expanded.filter((evt) =>
        dayjs(evt.day).isSame(daySelected, 'day')
      );
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