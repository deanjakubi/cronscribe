/**
 * Generates a human-readable description from a cron expression.
 */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function describeMinute(value) {
  if (value === '*') return 'every minute';
  if (value.startsWith('*/')) return `every ${value.slice(2)} minutes`;
  return `at minute ${value}`;
}

function describeHour(value) {
  if (value === '*') return null;
  if (value.startsWith('*/')) return `every ${value.slice(2)} hours`;
  const hour = parseInt(value, 10);
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

function describeDay(dom, dow) {
  if (dom !== '*' && dow !== '*') return `on day ${dom} of the month and on ${DAYS[parseInt(dow, 10)] || dow}`;
  if (dom !== '*') return `on day ${dom} of the month`;
  if (dow !== '*') {
    if (dow.includes('-')) {
      const [start, end] = dow.split('-');
      return `${DAYS[parseInt(start, 10)]} through ${DAYS[parseInt(end, 10)]}`;
    }
    return `on ${DAYS[parseInt(dow, 10)] || dow}`;
  }
  return null;
}

function describeMonth(value) {
  if (value === '*') return null;
  const month = parseInt(value, 10);
  return `in ${MONTHS[month - 1] || value}`;
}

/**
 * @param {string} expression - A valid 5-part cron expression
 * @returns {string} Human-readable description
 */
function describe(expression) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression';

  const [minute, hour, dom, month, dow] = parts;
  const segments = [];

  const hourDesc = describeHour(hour);
  const minuteDesc = describeMinute(minute);
  const dayDesc = describeDay(dom, dow);
  const monthDesc = describeMonth(month);

  if (hourDesc && !hourDesc.startsWith('every')) {
    segments.push(`At ${hourDesc.replace(':00', `:${minute === '*' ? '00' : minute.padStart(2, '0')}`)}`)
  } else {
    segments.push(`Runs ${minuteDesc}`);
    if (hourDesc) segments.push(hourDesc);
  }

  if (dayDesc) segments.push(dayDesc);
  if (monthDesc) segments.push(monthDesc);

  return segments.join(', ');
}

module.exports = { describe };
