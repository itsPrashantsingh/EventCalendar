import React, { useContext, useState } from "react";
import CreateEventButton from "./CreateEventButton";
import Labels from "./Labels";
import DayEvents from "./DayEvents";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";

export default function Sidebar() {
    const { monthIndex, setMonthIndex, setDaySelected, yearSelected, setYearSelected } = useContext(GlobalContext);

    const handleMonthChange = (e) => {
        setMonthIndex(parseInt(e.target.value));
    };

    const handlePrevMonth = () => {
        setMonthIndex(monthIndex - 1);
    };

    const handleNextMonth = () => {
        setMonthIndex(monthIndex + 1);
    };

    const handleYearChange = (e) => {
        const year = parseInt(e.target.value, 10);
        if (!isNaN(year) && String(year).length <= 4) {
            setYearSelected(year);
        }
    };

    function handleReset() {
        setMonthIndex(dayjs().month());
        setYearSelected(dayjs().year());
        setDaySelected(dayjs());
    }

  return (
    <aside className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-72 ml-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                <span className="material-icons-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
            </button>
            <button
                onClick={handleReset}
                className="border border-gray-300 dark:border-gray-600 rounded py-1 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
                Today
            </button>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
                <span className="material-icons-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
            </button>
        </div>
        <div className="flex items-center gap-2">
            <select value={monthIndex} onChange={handleMonthChange} className="p-2 border rounded w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>{dayjs(new Date(dayjs().year(), i)).format("MMMM")}</option>
                ))}
            </select>
            <input
                type="number"
                value={yearSelected}
                onChange={handleYearChange}
                className="p-2 border rounded w-24 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
        </div>
      <CreateEventButton />
      <Labels />
      <DayEvents />
    </aside>
  );
}
