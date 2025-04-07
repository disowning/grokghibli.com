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
    src: '/images/samples/landscape.webp',
    title: 'Landscape'
  },
  {
    src: '/images/samples/portrait.webp',
    title: 'Portrait'
  },
  {
    src: '/images/samples/cityscape.webp',
    title: 'Cityscape'
  },
  {
    src: '/images/samples/building.webp',
    title: 'Building'
  }
];

// 添加日志记录的函数
const logDebug = (message: string, data?: any) => {
  console.log(`[Debug] ${message}`, data || '');
};

// 添加等待消息数组
const waitingMessages = [
  "Transforming to Ghibli style...",
  "Hayao Miyazaki is working on your image...",
  "Drawing Ghibli magic...",
  "Totoro is helping with your image...",
  "Spirited Away world is forming...",
  "Howl's Moving Castle is on the move...",
  "Nausicaä of the Valley of the Wind is casting spells...",
  "Castle in the Sky is floating..."
];

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const [seed, setSeed] = useState<number>(42);
  const [prompt, setPrompt] = useState<string>("Ghibli Studio style, Charming hand-drawn anime-style illustration");
  const [sampleImage, setSampleImage] = useState<string | null>(null);
  const messageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清除消息轮换间隔
  const clearMessageInterval = () => {
    if (messageIntervalRef.current) {
      clearInterval(messageIntervalRef.current);
      messageIntervalRef.current = null;
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      clearMessageInterval();
      if (originalImage && originalImage.startsWith('blob:')) {
        URL.revokeObjectURL(originalImage);
      }
      if (transformedImage && transformedImage.startsWith('blob:')) {
        URL.revokeObjectURL(transformedImage);
      }
    };
  }, [originalImage, transformedImage]);

  // 开始消息轮换
  const startMessageRotation = () => {
    // 设置初始等待消息索引
    setWaitingMessageIndex(Math.floor(Math.random() * waitingMessages.length));
    
    // 每4秒随机切换一条等待消息
    const interval = setInterval(() => {
      setWaitingMessageIndex(Math.floor(Math.random() * waitingMessages.length));
    }, 4000);
    
    messageIntervalRef.current = interval;
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
    maxSize: 3 * 1024 * 1024, // 3MB
  });

  const handleGenerateImage = async () => {
    if (!originalImageFile && !sampleImage) {
      setError('Please upload an image or select a sample first');
      return;
    }
    
    try {
      logDebug('Starting image generation');
      setError(null);
      setIsLoading(true);
      // 启动等待消息轮换
      startMessageRotation();
      
      // 创建form data
      const formData = new FormData();
      
      // 添加图像
      if (originalImageFile) {
        formData.append('image', originalImageFile);
      } else if (sampleImage) {
        // 如果使用示例图片，先获取其blob
        const response = await fetch(sampleImage);
        const blob = await response.blob();
        formData.append('image', blob);
      }
      
      formData.append('prompt', prompt);
      formData.append('height', '512');
      formData.append('width', '512');
      formData.append('seed', seed.toString());
      
      logDebug('Sending initial request', {
        prompt,
        height: 512,
        width: 512,
        seed
      });
      
      // 使用fetch API发送请求
      const response = await fetch('/api/transform-ghibli', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败 (${response.status})`);
      }
      
      // 解析JSON响应
      const data = await response.json();
      logDebug('收到初始响应', data);
      
      // 如果提交成功，开始轮询结果
      if (data.taskId) {
        const taskId = data.taskId;
        logDebug(`获取任务ID: ${taskId}，开始轮询结果`);
        await pollForResult(taskId);
      } else {
        throw new Error("Server did not return a valid task ID");
      }
    } catch (err: any) {
      logDebug('Error generating image', err);
      setError(err.message || 'Failed to generate image. Please try again.');
      setIsLoading(false);
    }
  };

  // 轮询结果的函数
  const pollForResult = async (taskId: string) => {
    try {
      logDebug(`Starting to poll task ${taskId}`);
      
      // 初始轮询间隔(毫秒)
      let pollInterval = 2000;
      // 最大轮询次数
      const maxPolls = 30; // 大约1分钟
      let pollCount = 0;
      
      // 开始轮询
      const checkStatus = async () => {
        if (pollCount >= maxPolls) {
          clearMessageInterval();
          logDebug('轮询次数超过最大限制');
          setError("Processing took too long. Please try again.");
          setIsLoading(false);
          return;
        }
        
        pollCount++;
        logDebug(`Poll attempt: ${pollCount}`);
        
        try {
          // 直接使用GET请求访问check/[taskId]端点
          logDebug(`Sending check request #${pollCount} to /api/transform-ghibli/check/${taskId}`);
          
          const response = await fetch(`/api/transform-ghibli/check/${taskId}`);
          const contentType = response.headers.get('content-type');
          
          logDebug(`Response type: ${contentType}`);
          
          // 如果收到图片类型的响应，说明图片处理完成
          if (contentType && contentType.includes('image')) {
            logDebug('Received image response');
            clearMessageInterval();
            
            try {
              // 获取图片数据
              const imageBlob = await response.blob();
              
              logDebug('Creating Blob', {
                type: contentType,
                size: imageBlob.size
              });
              
              // 强制设置类型为image/webp以确保正确识别
              const fixedBlob = new Blob([await imageBlob.arrayBuffer()], { 
                type: contentType.includes('webp') ? 'image/webp' : 'image/png' 
              });
              
              const transformedImageUrl = URL.createObjectURL(fixedBlob);
              logDebug("Created image URL:", transformedImageUrl);
              
              // 确保URL创建后立即设置到状态
              setTransformedImage(transformedImageUrl);
              setIsLoading(false);
              
              // 验证图片URL
              const img = document.createElement('img');
              img.onload = () => logDebug('Image loaded successfully', { width: img.width, height: img.height });
              img.onerror = (e) => {
                logDebug('Image failed to load', e);
                setError("Error displaying the transformed image");
              };
              img.src = transformedImageUrl;
            } catch (imgErr) {
              logDebug('Error processing image', imgErr);
              setError("Error processing the transformed image");
              setIsLoading(false);
            }
            
            return;
          }
          
          // 处理JSON响应
          const data = await response.json();
          logDebug('收到JSON响应', data);
          
          // 状态为404，任务不存在，可能是服务重启
          if (response.status === 404) {
            logDebug('Task not found (404), continuing polling');
            setTimeout(checkStatus, pollInterval);
            return;
          }
          
          const status = data.status;
          
          if (status === 'processing') {
            // 优先使用服务器返回的进度，如果没有则使用本地计算的进度值
            const serverProgress = typeof data.progress === 'number' ? data.progress : null;
            const calculatedProgress = Math.min(95, Math.floor(pollCount / maxPolls * 100));
            const progress = serverProgress !== null ? serverProgress : calculatedProgress;
            
            logDebug(`Processing, elapsed time: ${data.elapsedTime || 0} seconds`);
            
            // 继续轮询，根据轮询次数调整轮询间隔
            if (pollCount > 10) {
              pollInterval = 1000; // 轮询次数大于10次时，每1秒轮询一次
            } else {
              // 基础轮询间隔
              pollInterval = 2000;
            }
            
            setTimeout(checkStatus, pollInterval);
          } else if (status === 'failed') {
            clearMessageInterval();
            logDebug('Processing failed', data.error);
            setError(data.error || "Failed to process image");
            setIsLoading(false);
          } else {
            // 继续轮询
            logDebug(`Unknown status: ${status}, continuing polling`);
            setTimeout(checkStatus, pollInterval);
          }
        } catch (err: any) {
          logDebug('Error checking task status', err);
          // 出错后仍然继续轮询，除非达到最大次数
          setTimeout(checkStatus, pollInterval);
        }
      };
      
      // 开始第一次检查
      logDebug('Starting first check after 2 second delay');
      setTimeout(checkStatus, 2000);
    } catch (err: any) {
      logDebug('Error during polling', err);
      clearMessageInterval();
      setError(err.message || 'Error polling for results');
      setIsLoading(false);
    }
  };

  const handleRegenerateImage = async () => {
    if (!originalImageFile && !sampleImage) return;
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
    setSampleImage(null);
    setError(null);
    clearMessageInterval();
  };

  // 处理选择示例图片
  const handleSelectSample = (sampleSrc: string) => {
    // 清除之前选择的图片
    resetImages();
    // 设置示例图片
    setSampleImage(sampleSrc);
    // 随机设置种子值
    setSeed(Math.floor(Math.random() * 1000));
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
                    Supports JPG, PNG, WebP (max 3MB)
                  </p>
                </div>
              )}
              </div>
            </div>
            
          {/* Right side - Transformed Image */}
            <div className="space-y-4">
            <div className="relative h-[400px] rounded-lg bg-gray-50">
              {transformedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* 使用普通img标签作为备份 */}
                  <img
                    src={transformedImage}
                    alt="Transformed"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }}
                    className="rounded-lg"
                  />
                </div>
              ) : isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="mt-4 text-sm text-gray-500">{waitingMessages[waitingMessageIndex]}</p>
                </div>
              ) : sampleImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={sampleImage}
                    alt="Selected Sample"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }}
                    className="rounded-lg"
                  />
                  <button 
                    onClick={() => setSampleImage(null)}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {!originalImage ? (
                    <div className="w-full space-y-4">
                      <p className="text-sm text-gray-500 text-center mb-6">
                        Sample Images (click to select)
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {previewExamples.map((example, index) => (
                          <div 
                            key={index} 
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => handleSelectSample(example.src)}
                          >
                            <div className="relative aspect-[4/3]">
                      <Image 
                                src={example.src}
                                alt={`Example ${example.title}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-white text-xs text-center">{example.title}</p>
                            </div>
                          </div>
                        ))}
                          </div>
                        </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {error || "Click Generate to transform your image into Ghibli style"}
                    </p>
                  )}
                        </div>
                      )}
                    </div>
                        </div>
                      </div>
                      
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          {(originalImage || sampleImage) && !isLoading && (
            <>
              {!transformedImage ? (
                <Button
                  onClick={handleGenerateImage}
                  variant="default"
                  className="bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Ghibli Style
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