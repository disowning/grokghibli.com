import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Get file as array buffer
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    // 发送请求到Hugging Face API
    const huggingFaceApiToken = process.env.HUGGINGFACE_API_TOKEN;
    
    if (!huggingFaceApiToken) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    const modelUrl = 'https://api-inference.huggingface.co/models/openfree/flux-chatgpt-ghibli-lora';
    
    const response = await axios.post(
      modelUrl,
      { inputs: `data:image/jpeg;base64,${base64Image}` },
      {
        headers: {
          Authorization: `Bearer ${huggingFaceApiToken}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    // 处理响应
    const result = response.data;
    
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });
  } catch (error: any) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing image' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST method required' }, { status: 405 });
} 