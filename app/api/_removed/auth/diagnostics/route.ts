import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 获取关于Google OAuth配置的详细信息
  const diagnostics = {
    googleId: {
      exists: !!process.env.GOOGLE_CLIENT_ID,
      length: process.env.GOOGLE_CLIENT_ID?.length || 0,
      isValid: !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com'),
      firstChars: process.env.GOOGLE_CLIENT_ID?.substring(0, 5) || '',
      lastChars: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(process.env.GOOGLE_CLIENT_ID.length - 5) : '',
    },
    googleSecret: {
      exists: !!process.env.GOOGLE_CLIENT_SECRET,
      length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
      isValid: !!process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_SECRET.length > 10,
      firstChars: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 5) || '',
      lastChars: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET.substring(process.env.GOOGLE_CLIENT_SECRET.length - 5) : '',
    },
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: {
      exists: !!process.env.NEXTAUTH_SECRET,
      length: process.env.NEXTAUTH_SECRET?.length || 0,
    },
    nodeEnv: process.env.NODE_ENV,
  };
  
  return NextResponse.json(diagnostics);
} 