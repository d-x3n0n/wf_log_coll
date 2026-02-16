/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const syslogRepository = require('../database/repositories/syslog.repository');
const logger = require('../utils/logger');
const config = require('../config');

class MessageHandler {
  constructor() {
    this.buffer = [];
    this.batchSize = config.syslog.batchSize;
    this.batchTimeout = config.syslog.batchTimeout;
    this.timer = null;
  }

  handle(parsedMessage) {
    this.buffer.push(parsedMessage);

    if (this.buffer.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchTimeout);
    }
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.buffer.length === 0) {
      return;
    }

    const messages = this.buffer.splice(0, this.buffer.length);

    try {
      const count = syslogRepository.insertBatch(messages);
      logger.debug(`Flushed ${count} syslog messages to database`);
    } catch (error) {
      logger.error('Failed to flush syslog messages to database', error);
      this.buffer.unshift(...messages);
    }
  }

  getBufferSize() {
    return this.buffer.length;
  }

  shutdown() {
    this.flush();
    logger.info('Message handler shutdown complete');
  }
}

module.exports = MessageHandler;
