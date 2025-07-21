import React, { useContext } from "react";
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
    <aside className="border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 w-72 flex flex-col gap-5 shadow-lg">
        <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full">
                <span className="material-icons-outlined text-gray-600 dark:text-gray-300">chevron_left</span>
            </button>
            <button
                onClick={handleReset}
                className="border border-gray-300 dark:border-slate-600 rounded-md py-1.5 px-4 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
                Today
            </button>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full">
                <span className="material-icons-outlined text-gray-600 dark:text-gray-300">chevron_right</span>
            </button>
        </div>
        <div className="flex items-center gap-3">
            <select value={monthIndex} onChange={handleMonthChange} className="p-2 border rounded-md w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 transition">
                {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i} value={i}>{dayjs(new Date(dayjs().year(), i)).format("MMMM")}</option>
                ))}
            </select>
            <input
                type="number"
                value={yearSelected}
                onChange={handleYearChange}
                className="p-2 border rounded-md w-28 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 transition"
            />
        </div>
      <CreateEventButton />
      <Labels />
      <DayEvents />
    </aside>
  );
}
