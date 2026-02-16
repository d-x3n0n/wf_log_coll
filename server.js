/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const database = require('./src/database');
const { createTable } = require('./src/database/models/syslog.model');
const { UdpListener } = require('./src/dataserver');

let httpServer = null;
let udpListener = null;

const startServer = async () => {
  try {
    database.initialize();
    createTable();

    udpListener = new UdpListener();
    await udpListener.start();

    httpServer = app.listen(config.server.port, () => {
      logger.info(`HTTP server listening on port ${config.server.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (udpListener) {
    await udpListener.stop();
  }

  if (httpServer) {
    httpServer.close(() => {
      logger.info('HTTP server closed');
    });
  }

  database.close();

  logger.info('Graceful shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
