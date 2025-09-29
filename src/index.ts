import express from 'express';
import swaggerUi from 'swagger-ui-express';
import searchRoutes from './routes/search';
import connectRoutes from './routes/connect';
import aiAutomationRoutes from './routes/ai-automation';
import removeRoutes from './routes/remove';
import openAPIDocument from './swagger';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/search', searchRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/automation', aiAutomationRoutes);
app.use('/api/remove', removeRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument));

app.get('/', (req, res) => {
  res.json({
    message: 'LinkedIn Sales Navigator API Server',
    version: '1.0.0',
    endpoints: {
      'GET /api/search/people': 'Search for people in LinkedIn Sales Navigator',
      'POST /api/connect': 'Send connection request to LinkedIn user',
      'POST /api/automation': 'AI-powered LinkedIn outreach automation',
      'POST /api/remove': 'Remove person from lead list',
      'GET /api-docs': 'API documentation (Swagger UI)'
    },
    documentation: '/api-docs'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 LinkedIn Sales Navigator API Server is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`🔍 Search People: GET http://localhost:${PORT}/api/search/people?start=0&count=25`);
  console.log(`🤝 Send Connection: POST http://localhost:${PORT}/api/connect`);
  console.log(`🤖 AI Automation: POST http://localhost:${PORT}/api/automation`);
  console.log(`🗑️ Remove from List: POST http://localhost:${PORT}/api/remove`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;