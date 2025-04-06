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
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
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
            <p className="text-ghibli-dark/60 mt-2">登录您的帐户以继续</p>
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
                  <Image
                    src="/images/google-logo.png"
                    alt="Google Logo"
                    width={20}
                    height={20}
                  />
                  <span>使用谷歌账号登录</span>
                </>
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或者</span>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ghibli-dark mb-1">
                  电子邮件
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ghibli-primary"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ghibli-dark mb-1">
                  密码
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ghibli-primary"
                />
              </div>
              
              <Button
                type="button"
                onClick={() => alert('账号密码登录功能即将上线!')}
                className="w-full bg-gradient-to-r from-ghibli-primary to-ghibli-secondary hover:from-ghibli-secondary hover:to-ghibli-primary flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                <span>登录</span>
              </Button>
            </form>
          </div>
          
          <div className="mt-6 text-center text-sm text-ghibli-dark/70">
            还没有账号？
            <button onClick={handleGoogleSignIn} className="ml-1 text-ghibli-primary font-medium hover:underline">
              立即注册
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 