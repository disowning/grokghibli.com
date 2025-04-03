'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清除进度定时器
  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // 模拟进度更新
  const startProgressSimulation = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 1000);
    progressIntervalRef.current = interval;
  };

  // 处理图片上传
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setError(null);
      setIsLoading(true);
      startProgressSimulation();
      
      // 展示原始图片
      const originalImageUrl = URL.createObjectURL(file);
      setOriginalImage(originalImageUrl);
      
      // 创建FormData对象
      const formData = new FormData();
      formData.append('image', file);
      
      // 发送请求到API
      const response = await axios.post('/api/transform', formData, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // 处理响应
      clearProgressInterval();
      setProgress(100);
      
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const transformedImageUrl = URL.createObjectURL(blob);
      setTransformedImage(transformedImageUrl);
    } catch (err: any) {
      clearProgressInterval();
      setError(err.message || 'Error transforming image');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const resetImages = () => {
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (transformedImage) URL.revokeObjectURL(transformedImage);
    setOriginalImage(null);
    setTransformedImage(null);
    setError(null);
    setProgress(0);
  };

  // 示例图片
  const sampleImages = [
    '/images/samples/landscape.webp',
    '/images/samples/cityscape.webp',
    '/images/samples/portrait.webp',
    '/images/samples/et.webp',
    '/images/samples/building.webp'
  ];

  return (
    <div className="space-y-8">
      {!originalImage ? (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-ghibli-primary bg-ghibli-light/50' : 'border-gray-300 hover:border-ghibli-primary'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-ghibli-light rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-ghibli-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-heading">{isDragActive ? 'Drop the image here' : 'Upload your photo'}</h3>
                <p className="text-gray-500 mb-4">or drop an image</p>
                <Button>Choose File</Button>
              </div>
              <p className="text-xs text-gray-400 mt-4">Supports: JPG, JPEG, PNG (max 5MB)</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-center font-medium mb-4 font-heading">Try with one of these</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {sampleImages.map((img, i) => (
                <button 
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border hover:border-ghibli-primary focus:outline-none focus:border-ghibli-primary transition-colors"
                  onClick={() => {
                    setOriginalImage(img);
                    setError(null);
                    setProgress(0);
                    
                    // 模拟转换效果
                    setIsLoading(true);
                    startProgressSimulation();
                    setTimeout(() => {
                      clearProgressInterval();
                      setProgress(100);
                      setTransformedImage(img);
                      setIsLoading(false);
                    }, 3000);
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image 
                      src={img}
                      alt={`Sample image ${i+1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {error ? (
            <div className="text-center text-red-500 space-y-4">
              <p>{error}</p>
              <Button 
                onClick={resetImages}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl">Before</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-64 md:h-80 rounded-md overflow-hidden">
                      <Image 
                        src={originalImage} 
                        alt="Original image" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-xl">After</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-64 md:h-80 rounded-md overflow-hidden bg-ghibli-light/20">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full max-w-xs space-y-4 p-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-ghibli-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                            <p className="text-center font-medium text-ghibli-primary">
                              {progress < 100 ? `Transforming... ${progress}%` : 'Finalizing...'}
                            </p>
                          </div>
                        </div>
                      ) : transformedImage && (
                        <Image 
                          src={transformedImage} 
                          alt="Transformed image" 
                          fill 
                          className="object-contain"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="outline"
                  onClick={resetImages}
                >
                  Upload New Image
                </Button>
                
                {transformedImage && !isLoading && (
                  <a 
                    href={transformedImage} 
                    download="ghibli-transformed.jpg"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-ghibli-primary text-white hover:bg-ghibli-primary/90 h-10 px-4 py-2"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 