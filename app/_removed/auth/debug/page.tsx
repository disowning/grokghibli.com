'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthDebugPage() {
  const [envInfo, setEnvInfo] = useState<{
    nextAuthUrl?: string;
    hasSecret?: boolean;
    hasGoogleId?: boolean;
    hasGoogleSecret?: boolean;
  }>({});
  
  useEffect(() => {
    // 检查环境变量是否已正确加载
    async function checkEnv() {
      try {
        const res = await fetch('/api/auth/check-env');
        const data = await res.json();
        setEnvInfo(data);
      } catch (error) {
        console.error('获取环境信息失败:', error);
      }
    }
    
    checkEnv();
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">认证调试页面</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">环境配置</h2>
        
        <dl className="grid grid-cols-1 gap-4 mb-6">
          <div className="border-b pb-2">
            <dt className="font-medium text-gray-600">NextAuth URL</dt>
            <dd>{envInfo.nextAuthUrl || '加载中...'}</dd>
          </div>
          
          <div className="border-b pb-2">
            <dt className="font-medium text-gray-600">NextAuth Secret</dt>
            <dd>{envInfo.hasSecret ? '已配置 ✓' : '未配置 ✗'}</dd>
          </div>
          
          <div className="border-b pb-2">
            <dt className="font-medium text-gray-600">Google Client ID</dt>
            <dd>{envInfo.hasGoogleId ? '已配置 ✓' : '未配置 ✗'}</dd>
          </div>
          
          <div className="border-b pb-2">
            <dt className="font-medium text-gray-600">Google Client Secret</dt>
            <dd>{envInfo.hasGoogleSecret ? '已配置 ✓' : '未配置 ✗'}</dd>
          </div>
        </dl>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Google OAuth配置检查项</h3>
            <ul className="list-disc list-inside text-sm pl-4 space-y-1">
              <li>确认Google开发者控制台中已添加正确的重定向URI: <code className="bg-gray-100 px-1">{envInfo.nextAuthUrl}/api/auth/callback/google</code></li>
              <li>确认Google项目已启用了Google+ API</li>
              <li>确认Client ID和Client Secret正确无误</li>
              <li>确认应用程序域名已在Google开发者控制台中验证</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild variant="outline">
              <Link href="/api/auth/direct-google-login">尝试直接Google登录</Link>
            </Button>
            
            <Button asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 