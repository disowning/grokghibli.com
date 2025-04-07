import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Redis } from "ioredis";
import mysql from "mysql2/promise";
import crypto from "crypto";

// Redis连接
const redis = new Redis({
  host: process.env.REDIS_HOST || '207.211.179.194',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || 'redis_akyGdb'
});

// MySQL连接池
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

// 获取或创建用户
async function getOrCreateUser(email: string, name: string | null, image: string | null, provider: string) {
  const connection = await pool.getConnection();
  try {
    // 生成唯一ID
    const userId = `user_${crypto.randomBytes(8).toString('hex')}`;
    
    console.log(`开始验证用户: ${email}`);
    
    // 检查用户是否已存在
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    ) as any[];
    
    if (Array.isArray(users) && users.length > 0) {
      // 用户存在，更新最后登录时间
      const user = users[0];
      console.log(`用户存在: ${user.id}, 更新登录时间`);
      
      await connection.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );
      return user;
    } else {
      // 用户不存在，创建新用户
      console.log(`创建新用户: ${email}`);
      
      await connection.execute(
        `INSERT INTO users 
         (id, email, name, image, provider, created_at, last_login, monthly_credits, credits_reset_at) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 30, DATE_ADD(NOW(), INTERVAL 1 MONTH))`,
        [userId, email, name || '', image || '', provider]
      );
      
      // 获取新创建的用户
      const [newUsers] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      ) as any[];
      
      console.log(`新用户创建完成: ${userId}`);
      
      return Array.isArray(newUsers) && newUsers.length > 0 ? newUsers[0] : null;
    }
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// NextAuth配置选项
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // 简化授权配置
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      console.log('--------- SIGNIN CALLBACK ---------');
      console.log('User:', user);
      console.log('Account:', account);
      console.log('Profile:', { email: profile?.email });
      
      if (account?.provider === "google" && profile?.email) {
        try {
          console.log(`Google登录: ${profile.email}`);
          
          // 获取或创建用户
          await getOrCreateUser(
            profile.email,
            user.name,
            user.image,
            account.provider
          );
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return '/auth/error?error=OAuthCallback&cause=database';
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        try {
          console.log(`更新会话: ${session.user.email}`);
          
          const connection = await pool.getConnection();
          const [users] = await connection.execute(
            'SELECT * FROM users WHERE id = ? OR email = ?',
            [token.sub, session.user.email]
          ) as any[];
          connection.release();

          if (Array.isArray(users) && users.length > 0) {
            const user = users[0];
            session.user.id = user.id;
            session.user.credits = user.monthly_credits;
            session.user.credits_reset_at = user.credits_reset_at;
            
            console.log(`会话更新完成: ${user.id}, 积分: ${user.monthly_credits}`);
          }
        } catch (error) {
          console.error('Error in session callback:', error);
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30天
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: true,
  logger: {
    error(code, ...message) {
      console.error('NEXTAUTH_ERROR:', { code, message });
    },
    warn(code, ...message) {
      console.warn('NEXTAUTH_WARNING:', { code, message });
    },
    debug(code, ...message) {
      console.log('NEXTAUTH_DEBUG:', { code, message });
    }
  }
};

// API路由处理函数
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 