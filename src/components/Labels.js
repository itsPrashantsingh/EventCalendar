import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

export default function Labels() {
  const { labels, updateLabel } = useContext(GlobalContext);
  return (
    <React.Fragment>
      <p className="text-gray-600 dark:text-gray-300 font-bold mt-10 mb-2 text-sm tracking-wide">Label</p>
      {labels.map(({ label: lbl, checked }, idx) => (
        <label key={idx} className="flex items-center mt-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={() =>
              updateLabel({ label: lbl, checked: !checked })
            }
            className={`form-checkbox h-5 w-5 text-${lbl}-400 rounded focus:ring-0 cursor-pointer transition`}
          />
          <span className="ml-2 text-gray-700 dark:text-gray-200 capitalize text-sm font-medium">{lbl}</span>
        </label>
      ))}
    </React.Fragment>
  );
}
