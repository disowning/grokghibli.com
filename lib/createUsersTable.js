// 数据库表初始化脚本
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUsersTable() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '207.211.179.194',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'eZ3sRC25Zt87sRDW',
    database: process.env.MYSQL_DATABASE || 'grokghibli',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');

    // 创建users表（如果不存在）
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NULL,
        name VARCHAR(255) NULL,
        image VARCHAR(1000) NULL,
        provider VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        monthly_credits INT DEFAULT 30,
        credits_reset_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 MONTH),
        INDEX (email)
      )
    `;

    await connection.query(createTableQuery);
    console.log('Users table created or verified');

    connection.release();
    console.log('Database connection released');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    await pool.end();
    console.log('Database pool ended');
  }
}

createUsersTable()
  .then(() => console.log('Database setup complete'))
  .catch(err => console.error('Database setup failed:', err)); 