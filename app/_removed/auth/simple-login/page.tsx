'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SimpleLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 简单直接的Google登录
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // 调试信息
      console.log('尝试使用Google登录...');
      console.log('GOOGLE_CLIENT_ID是否存在:', !!process.env.NEXT_PUBLIC_HAS_GOOGLE_ID);
      
      // 直接使用NextAuth的signIn方法，不进行任何自定义
      await signIn('google', { callbackUrl: '/' });
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">简单登录测试</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '登录中...' : '使用Google登录'}
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>这是一个简化的登录页面，直接使用NextAuth的signIn方法</p>
          </div>
        </div>
      </div>
    </div>
  );
} 