/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
module.exports = {
  path: process.env.SQLITE_DB_PATH || './data/syslog.db',
  options: {
    verbose: process.env.NODE_ENV === 'development' ? console.log : null
  },
  walMode: true
};
