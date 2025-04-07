'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OAuthDiagnosisPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchDiagnostics() {
      try {
        const res = await fetch('/api/auth/diagnostics');
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        const data = await res.json();
        setDiagnostics(data);
      } catch (err) {
        console.error('Failed to fetch diagnostics:', err);
        setError('无法获取诊断信息');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDiagnostics();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-2">加载中...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          {error}
        </div>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }
  
  const getStatusIcon = (condition: boolean) => {
    return condition 
      ? <span className="text-green-500">✓</span> 
      : <span className="text-red-500">✗</span>;
  };
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">OAuth 配置诊断</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Google OAuth 配置</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Google Client ID</h3>
            <ul className="ml-4 space-y-1 text-sm">
              <li>存在: {getStatusIcon(diagnostics.googleId.exists)}</li>
              <li>长度: {diagnostics.googleId.length} 字符</li>
              <li>格式有效: {getStatusIcon(diagnostics.googleId.isValid)}</li>
              <li>值: {diagnostics.googleId.firstChars}...{diagnostics.googleId.lastChars}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Google Client Secret</h3>
            <ul className="ml-4 space-y-1 text-sm">
              <li>存在: {getStatusIcon(diagnostics.googleSecret.exists)}</li>
              <li>长度: {diagnostics.googleSecret.length} 字符</li>
              <li>格式有效: {getStatusIcon(diagnostics.googleSecret.isValid)}</li>
              <li>值: {diagnostics.googleSecret.firstChars}...{diagnostics.googleSecret.lastChars}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">NextAuth 配置</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">NextAuth URL</h3>
            <p className="text-sm">{diagnostics.nextAuthUrl || '未设置'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">NextAuth Secret</h3>
            <ul className="ml-4 space-y-1 text-sm">
              <li>存在: {getStatusIcon(diagnostics.nextAuthSecret.exists)}</li>
              <li>长度: {diagnostics.nextAuthSecret.length} 字符</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">环境</h3>
            <p className="text-sm">{diagnostics.nodeEnv}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">常见问题诊断</h2>
        
        <div className="space-y-2 text-sm">
          <p>1. 请确认您的 Google OAuth 配置已正确设置:</p>
          <ul className="ml-8 list-disc space-y-1">
            <li>已在 Google Cloud Console 创建了 OAuth 凭据</li>
            <li>已添加了正确的重定向URI: <code className="bg-gray-100 px-1 rounded">{diagnostics.nextAuthUrl}/api/auth/callback/google</code></li>
            <li>确保项目已启用了必要的API (Google+ API/Google People API)</li>
          </ul>
          
          <p className="mt-4">2. 确认环境变量正确设置，并且服务器已重启:</p>
          <ul className="ml-8 list-disc space-y-1">
            <li>GOOGLE_CLIENT_ID = 您的Google客户端ID</li>
            <li>GOOGLE_CLIENT_SECRET = 您的Google客户端密钥</li>
            <li>NEXTAUTH_URL = {diagnostics.nextAuthUrl || 'http://localhost:3000'}</li>
            <li>NEXTAUTH_SECRET = 一个随机字符串</li>
          </ul>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button asChild variant="outline">
          <Link href="/auth/simple-login">尝试简化登录</Link>
        </Button>
        
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
} 