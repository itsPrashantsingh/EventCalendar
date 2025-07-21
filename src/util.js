import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export function getMonth(month = dayjs().month(), year = dayjs().year()) {
  month = Math.floor(month);
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

// Expand recurring events into individual occurrences for display
export function expandRecurringEvents(events, fromDate, toDate) {
  const expanded = [];
  events.forEach(evt => {
    if (!evt.recurrence || evt.recurrence.type === 'none') {
      expanded.push(evt);
      return;
    }
    const start = dayjs(evt.day);
    const until = evt.recurrence.endDate ? dayjs(evt.recurrence.endDate) : toDate;
    let cursor = start;
    while (cursor.isBefore(until) || cursor.isSame(until, 'day')) {
      let add = false;
      if (evt.recurrence.type === 'daily') {
        add = true;
      } else if (evt.recurrence.type === 'weekly') {
        add = evt.recurrence.daysOfWeek && evt.recurrence.daysOfWeek.includes(cursor.day());
      } else if (evt.recurrence.type === 'monthly') {
        add = cursor.date() === evt.recurrence.dayOfMonth;
      } else if (evt.recurrence.type === 'custom') {
        const diff = cursor.diff(start, 'day');
        add = diff % evt.recurrence.interval === 0;
      }
      if (add && cursor.isBetween(fromDate, toDate, null, '[]')) {
        expanded.push({ ...evt, day: cursor.valueOf(), _virtual: true });
      }
      cursor = cursor.add(1, 'day');
    }
  });
  return expanded;
}

export function hasConflict(newEvent, allEvents) {
  const newStart = dayjs(newEvent.day);
  
  for (const existingEvent of allEvents) {
    if (newEvent.id === existingEvent.id) continue;

    const existingStart = dayjs(existingEvent.day);

    // Simple same-day conflict for single-day events
    if (newStart.isSame(existingStart, 'day')) {
      return true;
    }

    // Check against recurring instances of existing events
    if (existingEvent.recurrence && existingEvent.recurrence.type !== 'none') {
        let cursor = existingStart;
        const until = existingEvent.recurrence.endDate ? dayjs(existingEvent.recurrence.endDate) : newStart.add(1, 'year');
        while(cursor.isBefore(until) || cursor.isSame(until, 'day')) {
            let add = false;
            if (existingEvent.recurrence.type === 'daily') add = true;
            if (existingEvent.recurrence.type === 'weekly' && existingEvent.recurrence.daysOfWeek.includes(cursor.day())) add = true;
            if (existingEvent.recurrence.type === 'monthly' && cursor.date() === existingEvent.recurrence.dayOfMonth) add = true;
            if (existingEvent.recurrence.type === 'custom' && cursor.diff(existingStart, 'day') % existingEvent.recurrence.interval === 0) add = true;
            
            if(add && cursor.isSame(newStart, 'day')) return true;

            cursor = cursor.add(1, 'day');
        }
    }
  }
  return false;
}
