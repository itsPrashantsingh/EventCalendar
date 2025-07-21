import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import { hasConflict } from "../util";

const labelsClasses = [
  "teal",
  "red",
  "blue",
  "indigo",
  "green",
  "pink",
];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    savedEvents,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [day, setDay] = useState(
    selectedEvent ? dayjs(selectedEvent.day) : dayjs(daySelected)
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );

  // Recurrence state
  const [recurrenceType, setRecurrenceType] = useState(
    selectedEvent && selectedEvent.recurrence ? selectedEvent.recurrence.type : 'none'
  );
  const [recurrenceDays, setRecurrenceDays] = useState(
    selectedEvent && selectedEvent.recurrence && selectedEvent.recurrence.daysOfWeek ? selectedEvent.recurrence.daysOfWeek : []
  );
  const [recurrenceDayOfMonth, setRecurrenceDayOfMonth] = useState(
    selectedEvent && selectedEvent.recurrence && selectedEvent.recurrence.dayOfMonth ? selectedEvent.recurrence.dayOfMonth : day.date()
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    selectedEvent && selectedEvent.recurrence && selectedEvent.recurrence.interval ? selectedEvent.recurrence.interval : 1
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(
    selectedEvent && selectedEvent.recurrence && selectedEvent.recurrence.endDate ? dayjs(selectedEvent.recurrence.endDate) : day
  );

  function handleRecurrenceDayToggle(dayIdx) {
    setRecurrenceDays(prev =>
      prev.includes(dayIdx)
        ? prev.filter(d => d !== dayIdx)
        : [...prev, dayIdx]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: day.valueOf(),
      id: selectedEvent ? selectedEvent.id : Date.now(),
      recurrence: recurrenceType === 'none' ? null : {
        type: recurrenceType,
        daysOfWeek: recurrenceType === 'weekly' ? recurrenceDays : undefined,
        dayOfMonth: recurrenceType === 'monthly' ? recurrenceDayOfMonth : undefined,
        interval: recurrenceType === 'custom' ? recurrenceInterval : undefined,
        endDate: recurrenceEndDate.valueOf(),
      }
    };

    if (hasConflict(calendarEvent, savedEvents)) {
      if (!window.confirm("This event conflicts with an existing event. Save anyway?")) {
        return;
      }
    }

    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }
    setShowEventModal(false);
  }

  function handleDelete() {
      dispatchCalEvent({
        type: "delete",
        payload: selectedEvent,
      });
      setShowEventModal(false);
  }

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <form className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg">
        <header className="bg-gray-50 dark:bg-slate-900 px-6 py-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
          <button onClick={() => setShowEventModal(false)} type="button">
            <span className="material-icons-outlined text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors">
              close
            </span>
          </button>
        </header>
        <div className="p-6 flex flex-col gap-y-5">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Add title"
                  value={title}
                  required
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 transition"
                  onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Date</label>
                <div className="flex items-center gap-3">
                    <input 
                        type="date" 
                        value={day.format('YYYY-MM-DD')}
                        onChange={e => setDay(dayjs(e.target.value))}
                        className="w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 transition"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Add a description"
                  value={description}
                  rows="3"
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 transition"
                  onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Label</label>
                <div className="flex gap-x-3 mb-2">
                  {labelsClasses.map((lblClass, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedLabel(lblClass)}
                      className={`bg-${lblClass}-500 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border-2 transition-all ${selectedLabel === lblClass ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-gray-500' : 'border-transparent'}`}
                    >
                      {selectedLabel === lblClass && (
                        <span className="material-icons-outlined text-white text-base">
                          check
                        </span>
                      )}
                    </span>
                  ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Recurrence</label>
                <select
                  value={recurrenceType}
                  onChange={e => setRecurrenceType(e.target.value)}
                  className="w-full p-2 border rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 mb-2"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </select>
                {recurrenceType === 'weekly' && (
                  <div className="flex gap-2 mb-2">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d, idx) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleRecurrenceDayToggle(idx)}
                        className={`px-2 py-1 rounded ${recurrenceDays.includes(idx) ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
                {recurrenceType === 'monthly' && (
                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Day of month:</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={recurrenceDayOfMonth}
                      onChange={e => setRecurrenceDayOfMonth(Number(e.target.value))}
                      className="ml-2 w-16 p-1 border rounded bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}
                {recurrenceType === 'custom' && (
                  <div className="mb-2 flex gap-2 items-center">
                    <label className="text-xs text-gray-500">Every</label>
                    <input
                      type="number"
                      min="1"
                      value={recurrenceInterval}
                      onChange={e => setRecurrenceInterval(Number(e.target.value))}
                      className="w-14 p-1 border rounded bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                    <span className="text-xs text-gray-500">days</span>
                  </div>
                )}
                {recurrenceType !== 'none' && (
                  <div>
                    <label className="text-xs text-gray-500">Repeat until:</label>
                    <input
                      type="date"
                      value={recurrenceEndDate.format('YYYY-MM-DD')}
                      onChange={e => setRecurrenceEndDate(dayjs(e.target.value))}
                      min={day.format('YYYY-MM-DD')}
                      className="ml-2 w-32 p-1 border rounded bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}
            </div>
        </div>
        <footer className="flex justify-between items-center border-t border-gray-200 dark:border-slate-700 p-4 rounded-b-lg">
          <div>
            {selectedEvent && (
                <button
                type="button"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 px-6 py-2 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
