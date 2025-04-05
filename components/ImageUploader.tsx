'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, Upload, RefreshCw, Wand2, ImageIcon } from 'lucide-react';

// 添加示例图片数据
const previewExamples = [
  {
    before: '/images/samples/landscape.webp',
    after: '/images/samples/landscape.webp',
    title: 'Landscape'
  },
  {
    before: '/images/samples/portrait.webp',
    after: '/images/samples/portrait.webp',
    title: 'Portrait'
  },
  {
    before: '/images/samples/cityscape.webp',
    after: '/images/samples/cityscape.webp',
    title: 'Cityscape'
  },
  {
    before: '/images/samples/building.webp',
    after: '/images/samples/building.webp',
    title: 'Building'
  }
];

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seed, setSeed] = useState<number>(42);
  const [prompt, setPrompt] = useState<string>("Ghibli Studio style, Charming hand-drawn anime-style illustration");
  
  // Clear progress interval
  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearProgressInterval();
      if (originalImage && originalImage.startsWith('blob:')) {
        URL.revokeObjectURL(originalImage);
      }
      if (transformedImage && transformedImage.startsWith('blob:')) {
        URL.revokeObjectURL(transformedImage);
      }
    };
  }, [originalImage, transformedImage]);

  // Simulate progress
  const startProgressSimulation = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + Math.floor(Math.random() * 5) + 1;
      });
    }, 800);
    progressIntervalRef.current = interval;
  };

  // Handle image upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const originalImageUrl = URL.createObjectURL(file);
      setOriginalImage(originalImageUrl);
      setOriginalImageFile(file);
      setTransformedImage(null); // Reset transformed image when new image is uploaded
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error processing image');
      console.error('Error:', err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleGenerateImage = async () => {
    if (!originalImageFile) return;
    
    try {
      setError(null);
      setIsLoading(true);
      startProgressSimulation();
      
      // 创建form data
      const formData = new FormData();
      formData.append('action', 'submit');
      formData.append('image', originalImageFile);
      formData.append('prompt', prompt);
      formData.append('height', '768');
      formData.append('width', '768');
      formData.append('seed', seed.toString());
      
      // 发送初始请求
      const submitResponse = await axios.post('/api/transform-ghibli', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      // 如果提交成功，开始轮询结果
      if (submitResponse.data && submitResponse.data.taskId) {
        const taskId = submitResponse.data.taskId;
        await pollForResult(taskId);
      } else {
        throw new Error("Failed to start image processing");
      }
    } catch (err: any) {
      clearProgressInterval();
      setError(err.message || 'Error transforming image');
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  // 轮询结果的函数
  const pollForResult = async (taskId: string) => {
    try {
      // 创建用于检查的form data
      const checkFormData = new FormData();
      checkFormData.append('action', 'check');
      checkFormData.append('taskId', taskId);
      
      // 初始轮询间隔(毫秒)
      let pollInterval = 2000;
      // 最大轮询次数
      const maxPolls = 30; // 大约1分钟
      let pollCount = 0;
      
      // 开始轮询
      const checkStatus = async () => {
        if (pollCount >= maxPolls) {
          clearProgressInterval();
          setError("Processing took too long. Please try again.");
          setIsLoading(false);
          return;
        }
        
        pollCount++;
        
        try {
          const response = await axios.post('/api/transform-ghibli', checkFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: pollCount > 3 ? 'blob' : 'json', // 前几次期望json，之后期望blob
          });
          
          // 如果收到blob响应，说明图片处理完成
          if (response.data instanceof Blob) {
            clearProgressInterval();
            setProgress(100);
            
            const transformedImageUrl = URL.createObjectURL(response.data);
            setTransformedImage(transformedImageUrl);
            setIsLoading(false);
            return;
          }
          
          // 处理JSON响应
          const status = response.data.status;
          
          if (status === 'processing') {
            // 根据进度更新UI
            const elapsedTime = response.data.elapsedTime || 0;
            // 计算估计进度 (最多到95%)
            const estimatedProgress = Math.min(95, Math.floor(elapsedTime / 60 * 100));
            setProgress(estimatedProgress);
            
            // 继续轮询
            setTimeout(checkStatus, pollInterval);
            // 逐渐增加轮询间隔
            pollInterval = Math.min(pollInterval * 1.5, 5000);
          } else if (status === 'failed') {
            clearProgressInterval();
            setError(response.data.error || "Failed to process image");
            setIsLoading(false);
          } else {
            // 继续轮询
            setTimeout(checkStatus, pollInterval);
          }
        } catch (err: any) {
          // 如果是404错误(任务不存在)，等待后重试
          if (err.response && err.response.status === 404) {
            setTimeout(checkStatus, pollInterval);
            return;
          }
          
          clearProgressInterval();
          setError(err.message || "Error checking processing status");
          setIsLoading(false);
        }
      };
      
      // 开始第一次检查
      setTimeout(checkStatus, 2000);
    } catch (err: any) {
      clearProgressInterval();
      setError(err.message || 'Error polling for results');
      setIsLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!originalImageFile) return;
    setSeed(Math.floor(Math.random() * 1000));
    handleGenerateImage();
  };

  const resetImages = () => {
    if (originalImage && originalImage.startsWith('blob:')) {
      URL.revokeObjectURL(originalImage);
    }
    if (transformedImage && transformedImage.startsWith('blob:')) {
      URL.revokeObjectURL(transformedImage);
    }
    setOriginalImage(null);
    setOriginalImageFile(null);
    setTransformedImage(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Original Image */}
          <div className="space-y-4">
            <div 
              {...getRootProps()} 
              className={`
                relative h-[400px] border-2 border-dashed rounded-lg
                flex flex-col items-center justify-center
                cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
              `}
            >
              <input {...getInputProps()} />
              {originalImage ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={originalImage}
                    alt="Original"
                    fill
                    className="object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-sm">
                      Click or drop to change image
                    </p>
                </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Drag & drop your photo here, or click to select
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Transformed Image */}
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-lg bg-gray-50">
              {transformedImage ? (
                    <Image 
                  src={transformedImage}
                  alt="Transformed"
                  fill
                  className="object-contain rounded-lg"
                />
              ) : isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-sm text-gray-500">Transforming... {progress}%</p>
            </div>
          ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {!originalImage ? (
                    <div className="w-full space-y-4">
                      <p className="text-sm text-gray-500 text-center mb-6">
                        Example transformations
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {previewExamples.map((example, index) => (
                          <div key={index} className="relative group cursor-pointer overflow-hidden rounded-lg">
                            <div className="relative aspect-[4/3]">
                              <Image
                                src={example.before}
                                alt={`Example ${example.title} Before`}
                                fill
                                className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                              />
                      <Image 
                                src={example.after}
                                alt={`Example ${example.title} After`}
                                fill
                                className="object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                              />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-white text-xs text-center">{example.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 text-center mt-4">
                        Hover over examples to see the transformation
                      </p>
                        </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {error || "Click Generate to transform your image"}
                    </p>
                  )}
                        </div>
                      )}
                    </div>
                        </div>
                      </div>
                      
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {originalImage && !isLoading && (
            <>
              {!transformedImage ? (
                <Button
                  onClick={handleGenerateImage}
                  variant="default"
                  className="bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              ) : (
                <>
                        <Button
                    onClick={handleRegenerateImage}
                          variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                          onClick={() => {
                      const link = document.createElement('a');
                      link.href = transformedImage;
                      link.download = 'ghibli-style.webp';
                      link.click();
                    }}
                    variant="default"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                        </Button>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
} 