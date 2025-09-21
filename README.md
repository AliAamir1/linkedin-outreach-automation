# LinkedIn Sales Navigator API Server

A Node.js TypeScript server that provides two APIs for interacting with LinkedIn Sales Navigator:
1. People search API
2. Connection request API

## Features

- **TypeScript** for type safety
- **Zod** for schema validation
- **Swagger UI** for API documentation
- **Axios with Cookie Jar** for LinkedIn session management
- **Express.js** web server

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update headers.json:**
   - Replace the LinkedIn cookies and session data in `headers.json` with your own
   - The current headers are from the provided curl commands

3. **Build the project:**
   ```bash
   npm run build
   ```

## Running the Server

**Development (with auto-reload):**
```bash
npm run dev:watch
```

**Development (single run):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### 1. Search People
**GET** `/api/search/people`

**Query Parameters:**
- `start` (number, optional): Starting index (default: 0)
- `count` (number, optional): Number of results (default: 25, max: 100)

**Example:**
```bash
curl "http://localhost:3000/api/search/people?start=0&count=25"
```

### 2. Send Connection Request
**POST** `/api/connect`

**Request Body:**
```json
{
  "member": "ACwAACg6hMsB0QZz1LrQ-YmSFfGT2BAonH_RJk4",
  "message": "Hi, I'd love to connect with you!"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/connect" \
  -H "Content-Type: application/json" \
  -d '{
    "member": "ACwAACg6hMsB0QZz1LrQ-YmSFfGT2BAonH_RJk4",
    "message": "Hi, I'\''d love to connect with you!"
  }'
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## Configuration

### headers.json
This file contains the LinkedIn headers and cookies needed for authentication. You'll need to:

1. Log into LinkedIn Sales Navigator in your browser
2. Open browser developer tools
3. Copy the headers from a valid request
4. Update `headers.json` with your session data

### Important Headers to Update:
- `csrf-token`: Your CSRF token
- `cookies`: Your LinkedIn session cookies
- `x-li-identity`: Your LinkedIn identity token

## Error Handling

The server includes comprehensive error handling:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid LinkedIn session)
- **403**: Forbidden (cannot perform action)
- **429**: Rate Limited
- **500**: Internal Server Error

## Security Notes

⚠️ **This server is for internal use only**
- Contains sensitive LinkedIn session data
- No authentication layer implemented
- Should not be exposed to public internet

## File Structure

```
src/
├── index.ts              # Main server file
├── axios-config.ts       # Axios configuration with LinkedIn headers
├── schemas.ts            # Zod validation schemas
├── swagger.ts            # Swagger/OpenAPI documentation
└── routes/
    ├── search.ts         # People search endpoint
    └── connect.ts        # Connection request endpoint
headers.json              # LinkedIn headers and cookies
```

## LinkedIn Session Management

The server uses `axios-cookiejar-support` and `tough-cookie` to maintain LinkedIn session state. Cookies are automatically managed between requests to maintain session continuity.

## Development

The project includes TypeScript compilation and development tools:
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run development server
- `npm run dev:watch`: Run with auto-reload (nodemon)
- `npm start`: Run production build