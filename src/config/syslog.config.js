/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
module.exports = {
  udpPort: parseInt(process.env.SYSLOG_UDP_PORT, 10) || 514,
  batchSize: parseInt(process.env.SYSLOG_BATCH_SIZE, 10) || 100,
  batchTimeout: 5000
};
