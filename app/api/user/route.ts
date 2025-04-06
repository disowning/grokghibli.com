import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import { authOptions } from '../auth/[...nextauth]/route';

// MySQL连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '207.211.179.194',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'grokghibli.com',
  password: process.env.MYSQL_PASSWORD || 'eZ3sRC25Zt87sRDW',
  database: process.env.MYSQL_DATABASE || 'grokghibli.com',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取用户信息
export async function GET(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 从数据库获取用户信息
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [session.user.email]
      ) as any[];
      
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "用户不存在" },
          { status: 404 }
        );
      }
      
      const user = rows[0];
      
      // 返回用户信息（不包含敏感数据）
      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        monthlyCredits: user.monthly_credits,
        creditsResetAt: user.credits_reset_at
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in GET /api/user:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

// 更新用户积分
export async function PUT(request: NextRequest) {
  try {
    // 获取会话信息
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 获取请求体
    const body = await request.json();
    
    // 确保只能更新允许的字段
    const allowedFields = ['name', 'image'];
    const updateFields: Record<string, any> = {};
    
    for (const field of allowedFields) {
      if (field in body) {
        updateFields[field] = body[field];
      }
    }
    
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { error: "没有提供有效的更新字段" },
        { status: 400 }
      );
    }
    
    // 构建SQL更新语句
    const setClause = Object.entries(updateFields)
      .map(([key, _]) => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updateFields), session.user.email];
    
    // 更新用户信息
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        `UPDATE users SET ${setClause} WHERE email = ?`,
        values
      );
      
      // 获取更新后的用户信息
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [session.user.email]
      ) as any[];
      
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json(
          { error: "用户不存在" },
          { status: 404 }
        );
      }
      
      const user = rows[0];
      
      // 返回更新后的用户信息
      return NextResponse.json({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        monthlyCredits: user.monthly_credits,
        creditsResetAt: user.credits_reset_at
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in PUT /api/user:', error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
} 