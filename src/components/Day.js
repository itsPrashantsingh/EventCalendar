import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    daySelected,
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter((evt) => {
        const evtStart = dayjs(evt.day);
        const evtEnd = evt.endDate ? dayjs(evt.endDate) : evtStart;
        return day.isSame(evtStart, 'day') || day.isSame(evtEnd, 'day') || (day.isAfter(evtStart) && day.isBefore(evtEnd));
    });
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
        return "bg-teal-500 text-white rounded-full w-7 font-semibold";
    } else if (currDay === slcDay) {
        return "bg-teal-100 dark:bg-teal-700 rounded-full text-teal-600 dark:text-white font-bold w-7";
    } else {
        return "hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors";
    }
  }
  return (
    <div className="border-t border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col min-h-[100px]">
      <header className="flex flex-col items-center pt-1">
        {rowIdx === 0 && (
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 font-semibold tracking-wide">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()} ${!getCurrentDayClass().includes('bg-teal') ? 'text-gray-700 dark:text-gray-200' : ''}`}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={e => { e.stopPropagation(); setSelectedEvent(evt); }}
            className={`bg-${evt.label}-200 dark:bg-${evt.label}-500 p-1 mr-1 text-black text-xs rounded mb-1 truncate shadow-sm`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}
