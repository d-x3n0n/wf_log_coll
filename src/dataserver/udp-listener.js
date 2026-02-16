/*
User: Shahidul Islam
Date: 2026-01-27
Time: 12:39
*/
const dgram = require('dgram');
const logger = require('../utils/logger');
const config = require('../config');
const syslogParser = require('./syslog-parser');
const MessageHandler = require('./message-handler');

class UdpListener {
  constructor() {
    this.server = null;
    this.messageHandler = new MessageHandler();
    this.port = config.syslog.udpPort;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = dgram.createSocket('udp4');

      this.server.on('error', (err) => {
        logger.error('UDP server error:', err);
        this.server.close();
        reject(err);
      });

      this.server.on('message', (msg, rinfo) => {
        try {
          const parsed = syslogParser.parse(msg, rinfo.address);
          this.messageHandler.handle(parsed);
        } catch (error) {
          logger.error('Failed to parse syslog message:', error);
        }
      });

      this.server.on('listening', () => {
        const address = this.server.address();
        logger.info(`UDP syslog server listening on ${address.address}:${address.port}`);
        resolve();
      });

      this.server.bind(this.port);
    });
  }

  stop() {
    return new Promise((resolve) => {
      this.messageHandler.shutdown();

      if (this.server) {
        this.server.close(() => {
          logger.info('UDP server closed');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getStats() {
    return {
      bufferSize: this.messageHandler.getBufferSize(),
      port: this.port
    };
  }
}

module.exports = UdpListener;
