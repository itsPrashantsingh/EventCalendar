import React from "react";
import Day from "./Day";
export default function Month({ month }) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
