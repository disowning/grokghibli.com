'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Download, Upload, RefreshCw, Image as ImageIcon, Zap, ArrowUpFromLine, RefreshCcw } from 'lucide-react';

type StyleOption = {
  id: string;
  name: string;
  description: string;
};

type ImageSize = {
  width: number;
  height: number;
};

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [seed, setSeed] = useState<string>('42');
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 768, height: 768 });

  // Style options
  const styleOptions: StyleOption[] = [
    { id: 'totoro', name: 'Totoro', description: 'Peaceful, natural countryside style' },
    { id: 'spirited', name: 'Spirited Away', description: 'Mysterious, dreamlike fantasy world' },
    { id: 'howl', name: 'Howl\'s Moving Castle', description: 'Elegant, magical steampunk style' },
    { id: 'mononoke', name: 'Princess Mononoke', description: 'Natural, mystical forest style' },
    { id: 'ponyo', name: 'Ponyo', description: 'Bright, vibrant ocean style' },
  ];
  
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
      setError(null);
      setIsLoading(true);
      startProgressSimulation();
      
      // Show original image
      const originalImageUrl = URL.createObjectURL(file);
      setOriginalImage(originalImageUrl);
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('seed', seed);
      formData.append('width', imageSize.width.toString());
      formData.append('height', imageSize.height.toString());
      
      // Simulate response - remove in production and use actual API
      setTimeout(() => {
        clearProgressInterval();
        setProgress(100);
        
        // Simulate transformation - use API response in production
        const transformedImageUrl = originalImageUrl;
        setTransformedImage(transformedImageUrl);
        setIsLoading(false);
      }, 3000 + Math.random() * 1000);
      
    } catch (err: any) {
      clearProgressInterval();
      setError(err.message || 'Error transforming image');
      console.error('Error:', err);
      setIsLoading(false);
    }
  }, [seed, imageSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const resetImages = () => {
    if (originalImage && originalImage.startsWith('blob:')) {
      URL.revokeObjectURL(originalImage);
    }
    if (transformedImage && transformedImage.startsWith('blob:')) {
      URL.revokeObjectURL(transformedImage);
    }
    setOriginalImage(null);
    setTransformedImage(null);
    setError(null);
    setProgress(0);
  };

  // Sample images
  const sampleImages = [
    '/images/samples/landscape.webp',
    '/images/samples/cityscape.webp',
    '/images/samples/portrait.webp',
    '/images/samples/et.webp',
    '/images/samples/building.webp'
  ];

  // Handle sample image selection
  const handleSampleImageSelect = (img: string) => {
    setOriginalImage(img);
    setError(null);
    setProgress(0);
    
    // Simulate conversion
    setIsLoading(true);
    startProgressSimulation();
    setTimeout(() => {
      clearProgressInterval();
      setProgress(100);
      setTransformedImage(img);
      setIsLoading(false);
    }, 3000);
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 256 && numValue <= 1024) {
      setImageSize(prev => ({
        ...prev,
        [dimension]: numValue
      }));
    }
  };

  return (
    <div className="space-y-8">
      {!originalImage ? (
        <>
          {/* Upload Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-ghibli-primary bg-ghibli-light/50 scale-105' : 'border-gray-300 hover:border-ghibli-primary hover:shadow-lg'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 bg-ghibli-light rounded-full flex items-center justify-center">
                  <ArrowUpFromLine className="w-6 h-6 text-ghibli-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-heading">{isDragActive ? 'Drop image here' : 'Upload your photo'}</h3>
                  <p className="text-gray-500 mb-3">or drag and drop image here</p>
                  <Button className="bg-ghibli-primary hover:bg-ghibli-primary/90">
                    Choose File
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2">Supports: JPG, JPEG, PNG, WEBP (max 10MB)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Width</h4>
                  <Input 
                    type="number" 
                    min={256} 
                    max={1024} 
                    value={imageSize.width}
                    onChange={(e) => handleSizeChange('width', e.target.value)}
                  />
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Height</h4>
                  <Input 
                    type="number" 
                    min={256} 
                    max={1024} 
                    value={imageSize.height}
                    onChange={(e) => handleSizeChange('height', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Seed</h4>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Enter seed value" 
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSeed(Math.floor(Math.random() * 1000).toString())}
                    title="Generate random seed"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Using the same seed produces consistent results</p>
              </div>
              
              <div className="bg-ghibli-light/30 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Tips</h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Landscape photos work best</li>
                  <li>• Use higher resolution images for better results</li>
                  <li>• Different styles work best for different types of photos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sample Images */}
          <div className="mt-8">
            <h3 className="text-center font-medium mb-6 font-heading text-xl">Try with these sample images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {sampleImages.map((img, i) => (
                <button 
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border hover:border-ghibli-primary hover:shadow-lg focus:outline-none focus:border-ghibli-primary transition-all hover:scale-105"
                  onClick={() => handleSampleImageSelect(img)}
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
        <div className="space-y-8">
          {/* Image Display */}
          {error ? (
            <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200 space-y-4">
              <p className="text-red-500 font-medium">{error}</p>
              <Button 
                onClick={resetImages}
                className="bg-red-500 hover:bg-red-600"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Control Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-lg">Size & Seed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Width</h4>
                        <Input 
                          type="number" 
                          min={256} 
                          max={1024} 
                          value={imageSize.width}
                          onChange={(e) => handleSizeChange('width', e.target.value)}
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Height</h4>
                        <Input 
                          type="number" 
                          min={256} 
                          max={1024} 
                          value={imageSize.height}
                          onChange={(e) => handleSizeChange('height', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Seed</h4>
                      <div className="flex gap-2">
                        <Input 
                          type="text" 
                          value={seed}
                          onChange={(e) => setSeed(e.target.value)}
                          className="flex-grow"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setSeed(Math.floor(Math.random() * 1000).toString())}
                          title="Generate random seed"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-center text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={resetImages}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New Image
                      </Button>
                      
                      {transformedImage && !isLoading && (
                        <a 
                          href={transformedImage} 
                          download="ghibli-transformed.jpg"
                          className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-ghibli-primary text-white hover:bg-ghibli-primary/90 h-10 px-4 py-2"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Image
                        </a>
                      )}
                      
                      {transformedImage && !isLoading && (
                        <Button
                          className="w-full bg-ghibli-secondary hover:bg-ghibli-secondary/90"
                          onClick={() => {
                            setTransformedImage(null);
                            setIsLoading(true);
                            startProgressSimulation();
                            setTimeout(() => {
                              clearProgressInterval();
                              setProgress(100);
                              setTransformedImage(originalImage);
                              setIsLoading(false);
                            }, 2000);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Image Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 bg-ghibli-light/20">
                    <CardTitle className="text-center text-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-ghibli-dark/70" />
                      Original Photo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative h-64">
                      <Image 
                        src={originalImage} 
                        alt="Original image" 
                        fill 
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 bg-ghibli-light/20">
                    <CardTitle className="text-center text-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 mr-2 text-ghibli-primary" />
                      Ghibli Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative h-64">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-ghibli-light/10">
                          <div className="w-full max-w-xs space-y-4 p-4">
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-ghibli-primary h-3 rounded-full transition-all duration-300 ease-in-out" 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="font-medium text-ghibli-primary">
                                {progress < 100 ? `Transforming... ${progress}%` : 'Finalizing...'}
                              </p>
                              <p className="text-xs text-gray-500">Applying "{styleOptions.find(s => s.id === 'totoro')?.name}" style</p>
                            </div>
                          </div>
                        </div>
                      ) : transformedImage ? (
                        <Image 
                          src={transformedImage} 
                          alt="Transformed image" 
                          fill 
                          className="object-contain"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-ghibli-light/10">
                          <p className="text-gray-400">Preparing transformation...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Additional Info */}
              {transformedImage && !isLoading && (
                <Card className="bg-ghibli-light/20">
                  <CardContent className="py-4">
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-medium">Image generation details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <h4 className="text-sm text-gray-500">Dimensions</h4>
                          <p className="font-medium">{imageSize.width} × {imageSize.height}</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <h4 className="text-sm text-gray-500">Seed</h4>
                          <p className="font-medium">{seed}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          className="mx-auto"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `Generated with Grok Ghibli using dimensions: ${imageSize.width}×${imageSize.height}, seed: ${seed}`
                            );
                          }}
                        >
                          Copy Generation Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 