import React from "react";
import Day from "./Day";
import { DndContext } from '@dnd-kit/core';
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";
import { hasConflict } from "../util";

export default function Month({ month }) {
  const { dispatchCalEvent, savedEvents } = React.useContext(GlobalContext);

  function handleDragEnd(event) {
    const { over, active } = event;
    if (!over || !active.data.current || !active.data.current.evt) return;

    const draggedEvt = active.data.current.evt;
    const newDay = dayjs(over.id);
    const oldDay = dayjs(draggedEvt.day);

    if (newDay.isSame(oldDay, 'day')) return;
    
    const potentialEvt = { ...draggedEvt, day: newDay.valueOf() };
    if (hasConflict(potentialEvt, savedEvents)) {
      if (!window.confirm("This move creates a conflict with an existing event. Proceed anyway?")) {
        return;
      }
    }

    // If it's a recurring event, we move the whole series
    if (draggedEvt.recurrence) {
      const originalEvent = savedEvents.find(e => e.id === draggedEvt.id);
      if (!originalEvent) return;

      const dayDiff = newDay.diff(oldDay, 'day');
      const newStartDate = dayjs(originalEvent.day).add(dayDiff, 'day');
      const newRecurrenceEndDate = originalEvent.recurrence.endDate
        ? dayjs(originalEvent.recurrence.endDate).add(dayDiff, 'day')
        : null;

      // Simulate all new occurrences
      let hasAnyConflict = false;
      let cursor = newStartDate;
      const until = newRecurrenceEndDate || newStartDate.add(1, 'year');
      while(cursor.isBefore(until) || cursor.isSame(until, 'day')) {
        let add = false;
        if (originalEvent.recurrence.type === 'daily') add = true;
        if (originalEvent.recurrence.type === 'weekly' && originalEvent.recurrence.daysOfWeek.includes(cursor.day())) add = true;
        if (originalEvent.recurrence.type === 'monthly' && cursor.date() === originalEvent.recurrence.dayOfMonth) add = true;
        if (originalEvent.recurrence.type === 'custom' && cursor.diff(newStartDate, 'day') % originalEvent.recurrence.interval === 0) add = true;
        if (add) {
          const simulatedEvt = { ...originalEvent, day: cursor.valueOf(), id: originalEvent.id, recurrence: null };
          if (hasConflict(simulatedEvt, savedEvents)) {
            hasAnyConflict = true;
            break;
          }
        }
        cursor = cursor.add(1, 'day');
      }
      if (hasAnyConflict) {
        if (!window.confirm("This move creates a conflict with an existing event in the new series. Proceed anyway?")) {
          return;
        }
      }

      const updatedEvent = {
        ...originalEvent,
        day: newStartDate.valueOf(),
        recurrence: {
          ...originalEvent.recurrence,
          endDate: newRecurrenceEndDate ? newRecurrenceEndDate.valueOf() : undefined,
        },
      };
      dispatchCalEvent({ type: 'update', payload: updatedEvent });
    } else { // It's a simple, non-recurring event
      const updatedEvent = {
        ...draggedEvt,
        day: newDay.valueOf(),
      };
      dispatchCalEvent({ type: 'update', payload: updatedEvent });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-lg">
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <Day day={day} key={idx} rowIdx={i} />
            ))}
          </React.Fragment>
        ))}
      </div>
    </DndContext>
  );
}
