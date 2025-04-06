// server.js
const express = require('express');
const Redis = require('ioredis');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API密钥验证中间件
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Redis连接
let redis;
try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: 0
  });
  console.log('Redis client created');
} catch (error) {
  console.error('Failed to create Redis client:', error);
}

// 监听Redis连接错误
redis?.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// MySQL连接池
let pool;
try {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'grokghibli',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('MySQL connection pool created');
} catch (error) {
  console.error('Failed to create MySQL connection pool:', error);
}

// 初始化数据库表（如果不存在）
async function initDatabase() {
  if (!pool) {
    console.log('Skipping database initialization - no MySQL connection');
    return;
  }
  
  try {
    const connection = await pool.getConnection();
    
    // 创建tasks表用于跟踪任务
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NULL,
        status ENUM('processing', 'completed', 'failed') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        original_filename VARCHAR(255) NULL,
        prompt TEXT NULL,
        INDEX (user_id),
        INDEX (created_at)
      )
    `);
    
    // 为将来的用户功能创建users表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        monthly_credits INT DEFAULT 30,
        credits_reset_at TIMESTAMP NULL,
        INDEX (email)
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// 保存到MySQL的帮助函数
async function saveTaskToDatabase(taskId, taskData) {
  if (!pool) return false;
  
  let conn;
  try {
    conn = await pool.getConnection();
    
    if (taskData.status === 'processing') {
      await conn.execute(
        'INSERT INTO tasks (id, status, prompt) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = ?',
        [taskId, taskData.status, taskData.prompt || '', taskData.status]
      );
    } else if (taskData.status === 'completed') {
      await conn.execute(
        'UPDATE tasks SET status = ?, completed_at = NOW() WHERE id = ?',
        ['completed', taskId]
      );
    }
    
    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

// API路由

// 1. 任务API
// 保存任务状态
app.post('/api/tasks/:taskId', apiKeyAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const taskData = req.body;
    
    console.log(`Saving task ${taskId} status: ${taskData.status}`);
    
    // 保存到Redis（1小时过期）
    if (redis) {
      await redis.set(
        `task:${taskId}:status`, 
        JSON.stringify(taskData), 
        'EX', 
        3600
      );
    } else {
      console.log('Redis unavailable, not saving task status');
    }
    
    // 同时保存基本信息到MySQL（异步，不阻塞响应）
    if (pool) {
      saveTaskToDatabase(taskId, taskData).catch(err => {
        console.error('Failed to save to database:', err);
      });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task' });
  }
});

// 获取任务状态
app.get('/api/tasks/:taskId', apiKeyAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    console.log(`Getting task ${taskId} status`);
    
    if (!redis) {
      return res.status(503).json({ error: 'Cache service unavailable' });
    }
    
    // 从Redis获取
    const taskData = await redis.get(`task:${taskId}:status`);
    if (!taskData) {
      console.log(`Task ${taskId} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(JSON.parse(taskData));
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
});

// 删除任务
app.delete('/api/tasks/:taskId', apiKeyAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    console.log(`Deleting task ${taskId}`);
    
    if (redis) {
      // 从Redis删除任务状态和图像
      await redis.del(`task:${taskId}:status`);
      await redis.del(`task:${taskId}:image`);
    } else {
      console.log('Redis unavailable, not deleting from cache');
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// 2. 图像API
// 保存图像
app.post('/api/images/:taskId', apiKeyAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { image } = req.body; // Base64编码的图像
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    
    console.log(`Saving image for task ${taskId}, size: ~${Math.floor(image.length / 1.37 / 1024)}KB`);
    
    if (!redis) {
      return res.status(503).json({ error: 'Cache service unavailable' });
    }
    
    // 保存到Redis（1小时过期）
    await redis.set(`task:${taskId}:image`, image, 'EX', 3600);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// 获取图像
app.get('/api/images/:taskId', apiKeyAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    
    console.log(`Getting image for task ${taskId}`);
    
    if (!redis) {
      return res.status(503).json({ error: 'Cache service unavailable' });
    }
    
    // 从Redis获取
    const image = await redis.get(`task:${taskId}:image`);
    if (!image) {
      console.log(`Image for task ${taskId} not found`);
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.status(200).json({ image });
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  const redisStatus = redis && redis.status === 'ready';
  let mysqlStatus = false;
  
  // 异步检查MySQL连接
  if (pool) {
    pool.getConnection()
      .then(conn => {
        mysqlStatus = true;
        conn.release();
      })
      .catch(err => {
        console.error('MySQL health check failed:', err);
      });
  }
  
  res.status(200).json({ 
    status: redisStatus ? 'ok' : 'degraded',
    redis: redisStatus ? 'connected' : 'disconnected',
    mysql: pool ? (mysqlStatus ? 'connected' : 'disconnected') : 'not_configured',
    uptime: process.uptime()
  });
});

// 启动服务器
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Cache server running on port ${PORT}`);
  });
});