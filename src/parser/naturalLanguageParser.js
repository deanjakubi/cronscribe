/**
 * Natural language to cron expression parser
 * Converts human-readable schedule descriptions into cron expressions
 */

const MINUTE = '(?:minute|minutes|min|mins)';
const HOUR = '(?:hour|hours|hr|hrs)';
const DAY = '(?:day|days)';
const WEEK = '(?:week|weeks)';
const MONTH = '(?:month|months)';

const DAY_NAMES = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

const MONTH_NAMES = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

function parseTime(input) {
  const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!timeMatch) return null;
  let hours = parseInt(timeMatch[1], 10);
  const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
  const meridiem = timeMatch[3]?.toLowerCase();
  if (meridiem === 'pm' && hours < 12) hours += 12;
  if (meridiem === 'am' && hours === 12) hours = 0;
  return { hours, minutes };
}

function parse(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }

  const normalized = input.toLowerCase().trim();

  if (/every\s+minute/.test(normalized)) return '* * * * *';
  if (/every\s+hour/.test(normalized)) return '0 * * * *';
  if (/every\s+day\s+at\s+midnight|midnight/.test(normalized)) return '0 0 * * *';
  if (/every\s+day\s+at\s+noon|noon/.test(normalized)) return '0 12 * * *';

  const everyNMinutes = normalized.match(new RegExp(`every\\s+(\\d+)\\s+${MINUTE}`));
  if (everyNMinutes) return `*/${everyNMinutes[1]} * * * *`;

  const everyNHours = normalized.match(new RegExp(`every\\s+(\\d+)\\s+${HOUR}`));
  if (everyNHours) return `0 */${everyNHours[1]} * * *`;

  const everyDayAt = normalized.match(/every\s+day\s+at\s+(.+)/);
  if (everyDayAt) {
    const time = parseTime(everyDayAt[1]);
    if (time) return `${time.minutes} ${time.hours} * * *`;
  }

  const everyWeekday = normalized.match(/every\s+(\w+)\s+at\s+(.+)/);
  if (everyWeekday) {
    const dayNum = DAY_NAMES[everyWeekday[1]];
    if (dayNum !== undefined) {
      const time = parseTime(everyWeekday[2]);
      if (time) return `${time.minutes} ${time.hours} * * ${dayNum}`;
    }
  }

  const onDayOfMonth = normalized.match(/on\s+the\s+(\d+)(?:st|nd|rd|th)?\s+of\s+each\s+month\s+at\s+(.+)/);
  if (onDayOfMonth) {
    const time = parseTime(onDayOfMonth[2]);
    if (time) return `${time.minutes} ${time.hours} ${onDayOfMonth[1]} * *`;
  }

  throw new Error(`Unable to parse schedule: "${input}"`);
}

module.exports = { parse, parseTime, DAY_NAMES, MONTH_NAMES };
