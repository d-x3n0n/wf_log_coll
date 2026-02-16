# Primenet Backend

Syslog data collection microservice that receives syslog data via UDP from network devices, stores it in SQLite, and provides REST APIs for data access.

## Features

- UDP syslog listener (RFC 3164 & RFC 5424 support)
- SQLite database with WAL mode for performance
- Batch processing for high-volume ingestion
- REST API with pagination, filtering, and statistics
- API key authentication
- Rate limiting and security headers

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Configuration

Create a `.env` file (copy from `.env.example`):

| Variable            | Default          | Description                |
| ------------------- | ---------------- | -------------------------- |
| `NODE_ENV`          | development      | Environment mode           |
| `HTTP_PORT`         | 3000             | REST API port              |
| `SYSLOG_UDP_PORT`   | 514              | UDP syslog listener port   |
| `SYSLOG_BATCH_SIZE` | 100              | Messages per batch insert  |
| `SQLITE_DB_PATH`    | ./data/syslog.db | Database file path         |
| `LOG_LEVEL`         | info             | Logging level              |
| `CORS_ORIGIN`       | \*               | CORS allowed origins       |
| `API_KEY`           | -                | API key for authentication |

> **Note:** Port 514 requires root/admin privileges. Use a higher port (e.g., 5514) for development.

## API Endpoints

All endpoints except `/health` require the `x-api-key` header.

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/health`                | Health check (no auth)   |
| GET    | `/api/v1/syslogs`        | Get all logs (paginated) |
| GET    | `/api/v1/syslogs/:id`    | Get single log by ID     |
| GET    | `/api/v1/syslogs/search` | Search with filters      |
| GET    | `/api/v1/syslogs/stats`  | Get statistics           |
| DELETE | `/api/v1/syslogs/:id`    | Delete single entry      |

### Query Parameters

**Pagination:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50, max: 1000)

**Search Filters:**

- `startDate` - ISO8601 date (e.g., 2024-01-01T00:00:00Z)
- `endDate` - ISO8601 date
- `severity` - Syslog severity level (0-7)
- `sourceIp` - Source IP address
- `hostname` - Hostname (partial match)

## Usage Examples

### Send Test Syslog

```bash
# RFC 3164 format
echo "<134>Jan 27 10:00:00 router1 test: Hello World" | nc -u localhost 514

# Multiple messages
for i in {1..10}; do
  echo "<134>Jan 27 10:00:00 router1 test: Message $i" | nc -u localhost 514
done
```

### API Requests

```bash
# Health check
curl http://localhost:3000/health

# Get all syslogs
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/v1/syslogs

# Get with pagination
curl -H "x-api-key: YOUR_API_KEY" "http://localhost:3000/api/v1/syslogs?page=1&limit=10"

# Search by severity
curl -H "x-api-key: YOUR_API_KEY" "http://localhost:3000/api/v1/syslogs/search?severity=3"

# Search by date range
curl -H "x-api-key: YOUR_API_KEY" \
  "http://localhost:3000/api/v1/syslogs/search?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z"

# Get statistics
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/v1/syslogs/stats

# Get single entry
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/v1/syslogs/1

# Delete entry
curl -X DELETE -H "x-api-key: YOUR_API_KEY" http://localhost:3000/api/v1/syslogs/1
```

## Syslog Severity Levels

| Level | Name      | Description               |
| ----- | --------- | ------------------------- |
| 0     | Emergency | System is unusable        |
| 1     | Alert     | Immediate action required |
| 2     | Critical  | Critical conditions       |
| 3     | Error     | Error conditions          |
| 4     | Warning   | Warning conditions        |
| 5     | Notice    | Normal but significant    |
| 6     | Info      | Informational messages    |
| 7     | Debug     | Debug-level messages      |

## Project Structure

```
primenet-backend/
├── src/
│   ├── config/           # Configuration files
│   ├── database/         # SQLite connection, models, repositories
│   ├── dataserver/       # UDP listener, syslog parser
│   ├── controllers/      # REST API handlers
│   ├── routes/           # Express routes
│   ├── middleware/       # Auth, validation, error handling
│   ├── services/         # Business logic
│   ├── utils/            # Logger, response helpers
│   └── app.js            # Express app
├── data/                 # SQLite database
├── logs/                 # Application logs
├── server.js             # Entry point
└── package.json
```

## Contribution

- [Shaidul Islam](https://github.com/shawonis08)
