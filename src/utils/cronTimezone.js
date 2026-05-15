/**
 * Utility for converting cron expressions between timezones
 */

const TIMEZONE_OFFSETS = {
  'UTC': 0,
  'US/Eastern': -5,
  'US/Central': -6,
  'US/Mountain': -7,
  'US/Pacific': -8,
  'Europe/London': 0,
  'Europe/Paris': 1,
  'Europe/Berlin': 1,
  'Asia/Tokyo': 9,
  'Asia/Shanghai': 8,
  'Asia/Kolkata': 5.5,
  'Australia/Sydney': 10,
};

function getOffsetHours(timezone) {
  if (!(timezone in TIMEZONE_OFFSETS)) {
    throw new Error(`Unsupported timezone: ${timezone}`);
  }
  return TIMEZONE_OFFSETS[timezone];
}

function shiftMinuteHour(minute, hour, shiftHours) {
  if (minute === '*' && hour === '*') return { minute, hour };

  const totalMinutes =
    (parseInt(hour === '*' ? 0 : hour, 10) * 60 +
      parseInt(minute === '*' ? 0 : minute, 10) +
      Math.round(shiftHours * 60) +
      1440) %
    1440;

  return {
    minute: minute === '*' ? '*' : String(totalMinutes % 60),
    hour: hour === '*' ? '*' : String(Math.floor(totalMinutes / 60)),
  };
}

function convertTimezone(expression, fromTz, toTz) {
  if (!expression || typeof expression !== 'string') {
    throw new Error('Invalid cron expression');
  }

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error('Cron expression must have exactly 5 fields');
  }

  const fromOffset = getOffsetHours(fromTz);
  const toOffset = getOffsetHours(toTz);
  const shiftHours = toOffset - fromOffset;

  if (shiftHours === 0) {
    return expression;
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const shifted = shiftMinuteHour(minute, hour, shiftHours);

  return [shifted.minute, shifted.hour, dayOfMonth, month, dayOfWeek].join(' ');
}

function getSupportedTimezones() {
  return Object.keys(TIMEZONE_OFFSETS);
}

module.exports = { convertTimezone, getSupportedTimezones, getOffsetHours };
