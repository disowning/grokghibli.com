'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  // 根据错误类型显示不同信息
  const getErrorMessage = () => {
    switch (error) {
      case 'OAuthSignin':
        return '开始OAuth签名流程时出错。';
      case 'OAuthCallback':
        return '处理OAuth回调时出错。';
      case 'OAuthCreateAccount':
        return '创建OAuth账户时出错。';
      case 'EmailCreateAccount':
        return '创建电子邮件账户时出错。';
      case 'Callback':
        return '回调处理程序执行期间出错。';
      case 'OAuthAccountNotLinked':
        return '此电子邮件已使用不同的登录方式注册。';
      case 'EmailSignin':
        return '发送电子邮件时出错。';
      case 'CredentialsSignin':
        return '登录失败。请检查您提供的信息是否正确。';
      case 'SessionRequired':
        return '访问此页面需要登录。';
      default:
        return '发生了意外错误。请稍后再试。';
    }
  };
  
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
            
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-heading font-bold text-ghibli-dark">登录失败</h1>
            <p className="text-ghibli-dark/70 mt-3">{getErrorMessage()}</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Button asChild>
              <Link href="/auth/signin">
                重新尝试登录
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 