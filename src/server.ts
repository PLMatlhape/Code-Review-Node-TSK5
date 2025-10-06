import express from 'express';
import cors from 'cors';
import http from 'http';
import { config } from './config/env';
import { pool } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { WebSocketServer } from './websocket/websocket';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import submissionRoutes from './routes/submission.routes';
import commentRoutes from './routes/comment.routes';
import reviewRoutes from './routes/review.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const wsServer = new WebSocketServer(server);

// Connect WebSocket to services
import { CommentService } from './services/comment.service';
import { ReviewService } from './services/review.service';

const commentService = new CommentService();
const reviewService = new ReviewService();
commentService.setWebSocketServer(wsServer);
reviewService.setWebSocketServer(wsServer);

// Test database connection first, then start server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
    console.log('');
    console.log('🔧 Please check:');
    console.log('1. PostgreSQL service is running');
    console.log('2. Database credentials in .env are correct');
    console.log('3. Database "code_review_db" exists');
    console.log('');
    process.exit(1);
  }
  
  console.log('✅ Database connected successfully');
  
  // Start server only after database connection is confirmed
  const hostname = '0.0.0.0';
  server.listen(Number(config.port), hostname, () => {
    const address = server.address();
    console.log('');
    console.log('='.repeat(50));
    console.log(`✅ Server running on port ${config.port}`);
    console.log(`📡 Server URL: http://localhost:${config.port}`);
    console.log(`🔌 WebSocket: ws://localhost:${config.port}/ws`);
    console.log(`🌐 Listening on: ${hostname}:${config.port}`);
    console.log(`🔍 Address:`, address);
    console.log('='.repeat(50));
    console.log('');
    console.log('🚀 Ready to accept requests!');
  }).on('error', (err: any) => {
    console.error('❌ Server failed to start:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.log(`🔧 Port ${config.port} is already in use.`);
    }
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});

export { wsServer };