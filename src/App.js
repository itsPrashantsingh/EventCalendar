import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
function App() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal, yearSelected } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex, yearSelected));
  }, [monthIndex, yearSelected]);

  return (
    <div className="dark min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-100">
      {showEventModal && <EventModal />}
      <div className="h-screen flex flex-col">
        <div className="flex flex-1">
          <Month month={currenMonth} />
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
