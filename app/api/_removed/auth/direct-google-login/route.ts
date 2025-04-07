import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 构建重定向URL
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // 直接重定向到Google OAuth登录
  const googleAuthUrl = `${baseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent(baseUrl)}`;
  
  console.log('重定向到Google登录:', googleAuthUrl);
  
  // 返回重定向响应
  return NextResponse.redirect(googleAuthUrl);
} 