'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  // 如果已登录，重定向到首页
  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/');
    }
  }, [status]);
  
  // 处理谷歌登录
  const handleGoogleSignIn = () => {
    try {
      setLoading(true);
      // 直接导航到新的API路由
      console.log('开始重定向到Google登录...');
      // 使用新的直接登录路由
      window.location.href = `/api/auth/direct-google-login`;
    } catch (error) {
      console.error('登录重定向错误:', error);
      setLoading(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="animate-pulse">
          <p className="text-center text-ghibli-primary">正在加载...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center justify-center">
                <div className="relative w-10 h-10 mr-3">
                  <Image
                    src="/images/logo/grokghibli-logo.svg"
                    alt="Grok Ghibli Logo"
                    width={40}
                    height={40}
                    className="drop-shadow-md"
                  />
                </div>
                <span className="text-2xl font-heading font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-primary to-ghibli-primary/90">Grok</span>
                  <span className="mx-1"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-secondary to-ghibli-secondary/90">Ghibli</span>
                </span>
              </div>
            </Link>
            <h1 className="text-2xl font-heading font-bold text-ghibli-dark">欢迎回来</h1>
            <p className="text-ghibli-dark/60 mt-2">使用Google账号登录即可开始</p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-ghibli-dark"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-ghibli-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>使用谷歌账号登录</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-ghibli-dark/70">
            点击上方按钮使用Google账号登录或注册
          </div>
        </div>
      </div>
    </div>
  );
} 