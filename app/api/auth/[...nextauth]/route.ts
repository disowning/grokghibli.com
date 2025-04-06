import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
  user: process.env.MYSQL_USER || 'grokghibli.com',
  password: process.env.MYSQL_PASSWORD || 'eZ3sRC25Zt87sRDW',
  database: process.env.MYSQL_DATABASE || 'grokghibli.com',
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
    
    // 检查用户是否已存在
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?', 
      [email]
    ) as any[];
    
    if (Array.isArray(users) && users.length > 0) {
      // 用户存在，更新最后登录时间
      const user = users[0];
      await connection.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [user.id]
      );
      return user;
    } else {
      // 用户不存在，创建新用户
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
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const connection = await pool.getConnection();
          const [users] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [credentials.email]
          ) as any[];
          connection.release();

          if (Array.isArray(users) && users.length > 0) {
            const user = users[0];
            
            // 这里应该使用安全的密码验证，例如bcrypt
            // 为简化，这里假设密码已经存储为哈希值
            if (user.password_hash === credentials.password) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image
              };
            }
          }
        } catch (error) {
          console.error('Error in authorize:', error);
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google" && profile?.email) {
        try {
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
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (session?.user && token?.sub) {
        try {
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
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-me",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30天
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development'
};

// API路由处理函数
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 