/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const FACILITY_NAMES = [
  'kern', 'user', 'mail', 'daemon', 'auth', 'syslog', 'lpr', 'news',
  'uucp', 'cron', 'authpriv', 'ftp', 'ntp', 'security', 'console', 'solaris-cron',
  'local0', 'local1', 'local2', 'local3', 'local4', 'local5', 'local6', 'local7'
];

const SEVERITY_NAMES = [
  'emerg', 'alert', 'crit', 'err', 'warning', 'notice', 'info', 'debug'
];

const RFC3164_REGEX = /^<(\d{1,3})>(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(.+)$/;
const RFC5424_REGEX = /^<(\d{1,3})>(\d)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(-|\[.+?\])\s*(.*)$/;

const parse = (message, sourceIp) => {
  const rawMessage = message.toString().trim();

  let parsed = tryParseRFC5424(rawMessage, sourceIp);
  if (!parsed) {
    parsed = tryParseRFC3164(rawMessage, sourceIp);
  }
  if (!parsed) {
    parsed = parseGeneric(rawMessage, sourceIp);
  }

  return parsed;
};

const tryParseRFC5424 = (message, sourceIp) => {
  const match = message.match(RFC5424_REGEX);
  if (!match) return null;

  const priority = parseInt(match[1], 10);
  const facility = Math.floor(priority / 8);
  const severity = priority % 8;

  return {
    facility,
    severity,
    priority,
    version: parseInt(match[2], 10),
    timestamp: match[3] === '-' ? new Date().toISOString() : match[3],
    hostname: match[4] === '-' ? null : match[4],
    appName: match[5] === '-' ? null : match[5],
    procId: match[6] === '-' ? null : match[6],
    msgId: match[7] === '-' ? null : match[7],
    structuredData: parseStructuredData(match[8]),
    message: match[9] || '',
    rawMessage: message,
    sourceIp,
    facilityName: FACILITY_NAMES[facility] || 'unknown',
    severityName: SEVERITY_NAMES[severity] || 'unknown'
  };
};

const tryParseRFC3164 = (message, sourceIp) => {
  const match = message.match(RFC3164_REGEX);
  if (!match) return null;

  const priority = parseInt(match[1], 10);
  const facility = Math.floor(priority / 8);
  const severity = priority % 8;

  const currentYear = new Date().getFullYear();
  const timestamp = new Date(`${match[2]} ${currentYear}`).toISOString();

  let hostname = match[3];
  let appName = null;
  let procId = null;
  let msgContent = match[4];

  const tagMatch = msgContent.match(/^(\S+?)(?:\[(\d+)\])?:\s*(.*)$/);
  if (tagMatch) {
    appName = tagMatch[1];
    procId = tagMatch[2] || null;
    msgContent = tagMatch[3];
  }

  return {
    facility,
    severity,
    priority,
    timestamp,
    hostname,
    appName,
    procId,
    msgId: null,
    structuredData: null,
    message: msgContent,
    rawMessage: message,
    sourceIp,
    facilityName: FACILITY_NAMES[facility] || 'unknown',
    severityName: SEVERITY_NAMES[severity] || 'unknown'
  };
};

const parseGeneric = (message, sourceIp) => {
  let priority = 13;
  let msgContent = message;

  const priMatch = message.match(/^<(\d{1,3})>(.*)$/);
  if (priMatch) {
    priority = parseInt(priMatch[1], 10);
    msgContent = priMatch[2];
  }

  const facility = Math.floor(priority / 8);
  const severity = priority % 8;

  return {
    facility,
    severity,
    priority,
    timestamp: new Date().toISOString(),
    hostname: null,
    appName: null,
    procId: null,
    msgId: null,
    structuredData: null,
    message: msgContent,
    rawMessage: message,
    sourceIp,
    facilityName: FACILITY_NAMES[facility] || 'unknown',
    severityName: SEVERITY_NAMES[severity] || 'unknown'
  };
};

const parseStructuredData = (sd) => {
  if (!sd || sd === '-') return null;

  const result = {};
  const elementRegex = /\[([^\s\]]+)(?:\s+([^\]]+))?\]/g;
  let match;

  while ((match = elementRegex.exec(sd)) !== null) {
    const sdId = match[1];
    const params = match[2] || '';
    result[sdId] = {};

    const paramRegex = /(\S+)="([^"]*)"/g;
    let paramMatch;
    while ((paramMatch = paramRegex.exec(params)) !== null) {
      result[sdId][paramMatch[1]] = paramMatch[2];
    }
  }

  return Object.keys(result).length > 0 ? result : null;
};

module.exports = {
  parse,
  FACILITY_NAMES,
  SEVERITY_NAMES
};
