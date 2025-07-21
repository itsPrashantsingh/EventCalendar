import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import { expandRecurringEvents } from "../util";
import { useDraggable, useDroppable } from '@dnd-kit/core';

function DraggableEvent({ evt, children }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(evt.id), // Use only evt.id for stable drag id
    data: { evt },
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
}

function DroppableDay({ day, onDrop, children }) {
  const { setNodeRef } = useDroppable({ id: day.format('YYYY-MM-DD') });
  return (
    <div ref={setNodeRef} style={{ minHeight: 90 }}>{children}</div>
  );
}

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    daySelected,
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
    dispatchCalEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    // Expand recurring events for the visible month
    const monthStart = day.startOf('month').subtract(7, 'day');
    const monthEnd = day.endOf('month').add(7, 'day');
    const expanded = expandRecurringEvents(filteredEvents, monthStart, monthEnd);
    const events = expanded.filter((evt) => dayjs(evt.day).isSame(day, 'day'));
    setDayEvents(events);
  }, [filteredEvents, day]);

  function handleDragEnd(event) {
    const { over, active } = event;
    if (over && over.id && active.data.current && active.data.current.evt) {
      const evt = active.data.current.evt;
      const newDay = dayjs(over.id);
      // Only allow drop if the day is different
      if (!newDay.isSame(dayjs(evt.day), 'day')) {
        // For recurring events, you could prompt here (not implemented yet)
        dispatchCalEvent({
          type: 'update',
          payload: { ...evt, day: newDay.valueOf() },
        });
      }
    }
  }

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
    <DroppableDay day={day}>
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
              <DraggableEvent evt={evt} key={evt.id + '-' + evt.day}>
                <div
                  onClick={e => { e.stopPropagation(); setSelectedEvent(evt); setShowEventModal(true); }}
                  className={`bg-${evt.label}-500 p-1 mr-1 text-white text-xs rounded mb-1 truncate shadow-sm`}
                >
                  {evt.title}
                </div>
              </DraggableEvent>
            ))}
          </div>
        </div>
      </DroppableDay>
  );
}
