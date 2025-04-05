# Grok Ghibli

Grok Ghibli is a web application that transforms your photos into Studio Ghibli-style artwork using AI technology and Next.js 14. The application provides a seamless, user-friendly experience for creating charming Ghibli-inspired transformations of your images.

![Grok Ghibli Preview](/images/showcase/showcase-after.webp)

## Features

- **AI-Powered Transformation**: Leverages advanced AI models for accurate Ghibli-style transformations
- **Async Processing System**: Handles image transformations in the background without timeouts
- **Multiple Styles**: Choose from various iconic Studio Ghibli film styles
- **Real-time Progress Tracking**: Monitor transformations with live progress updates
- **High-Quality Output**: Generate high-resolution Ghibli-style artwork
- **User-Friendly Interface**: Simple drag-and-drop photo upload
- **Sample Images**: Try the transformation with built-in sample images
- **Responsive Design**: Perfect experience on any device
- **SEO Optimized**: Fully optimized for search engines with meta tags, sitemap, and robots.txt

## Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **API Routes**: Next.js API routes with extended timeouts for long-running operations
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Server Components**: React Server Components for optimal performance
- **State Management**: React Hooks for client-side state
- **AI Integration**: Connected to Hugging Face API via Gradio client
- **File Storage**: Serverless-friendly temporary file storage for image processing

## Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation Steps

1. Clone the repository
   ```
   git clone https://github.com/yourusername/grokghibli.git
   cd grokghibli
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create environment variables file
   ```
   cp .env.example .env.local
   ```
   
4. Add required API keys to `.env.local` file
   ```
   HUGGING_FACE_TOKEN=your_api_key_here
   ```
   
   Or add multiple tokens for better reliability:
   ```
   HUGGING_FACE_TOKENS=hf_token1,hf_token2,hf_token3
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

Build an optimized production version:

```
npm run build
npm start
```

### Deployment on Vercel

For the best performance, deploy on Vercel:

1. Push your repository to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy

## Advanced Token Management System

GrokGhibli uses a sophisticated token management system to handle Hugging Face API calls:

### Features

- **Multi-Token Rotation**: Supports automatic rotation of multiple API tokens
- **Intelligent Selection Algorithm**: Prioritizes tokens based on usage, quota limits, and time since last used
- **Usage Time Tracking**: Precisely monitors each token's usage time (accurate to 0.1 minutes)
- **Quota Limit Detection**: Automatically detects when a token reaches its GPU quota limit
- **Automatic Limits**: Switches to alternative tokens when daily usage limits (5 minutes) are reached
- **Daily Reset**: Automatically resets usage statistics at midnight
- **Status Monitoring**: Provides API endpoints for viewing token usage status

### Token Configuration

Three ways to configure tokens:

1. **Single Token**:
   ```
   HUGGING_FACE_TOKEN=hf_your_token_here
   ```

2. **Comma-separated Token List**:
   ```
   HUGGING_FACE_TOKENS=hf_token1,hf_token2,hf_token3
   ```

3. **Indexed Multiple Tokens**:
   ```
   HUGGING_FACE_TOKEN_1=hf_token1
   HUGGING_FACE_TOKEN_2=hf_token2
   ```

### Viewing Token Status

Access the following API endpoint to view token usage:
```
/api/token-status?secret=your_admin_secret
```

Set the `ADMIN_SECRET` environment variable in `.env.local` to protect this endpoint.

## Asynchronous Image Processing

GrokGhibli implements an advanced asynchronous image processing system:

1. **Task Queue**: Images are processed in a background task queue
2. **Status Tracking**: Each task has an ID and status for monitoring
3. **Polling Mechanism**: Client polls for status until processing completes
4. **Progress Updates**: Real-time progress updates during processing
5. **Fallback Mechanism**: If all tokens are exhausted, returns original image
6. **Serverless Compatible**: Uses temporary file storage suitable for serverless environments

## Project Structure

```
grokghibli/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── transform-ghibli/     # Image transformation API
│   │   │   ├── route.ts           # Main API endpoint
│   │   │   └── check/[taskId]/    # Status checking endpoint
│   │   └── token-status/         # Token status API
│   ├── blog/              # Blog pages
│   ├── contact/           # Contact page
│   ├── features/          # Features page
│   ├── showcase/          # Showcase page
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── Header.tsx        # Website header component
│   ├── ImageUploader.tsx # Image upload component
│   ├── GhibliFeatures.tsx# Feature showcase component
│   └── Pricing.tsx       # Pricing component
├── lib/                  # Utility libraries
│   └── token-manager.ts  # Token management system
├── public/               # Static assets
│   ├── robots.txt        # Search engine crawler instructions
│   ├── sitemap.xml       # Site map
│   └── images/          # Image assets
│       ├── showcase/    # Before/after transformation examples
│       └── samples/     # Sample images
│           ├── landscape.webp  # Landscape sample
│           ├── cityscape.webp  # Cityscape sample
│           ├── portrait.webp   # Portrait sample
│           ├── animal.webp     # Animal sample
│           └── building.webp   # Building sample
└── types/               # TypeScript type definitions
```

## Image Resources

The project includes two types of images:

1. **Showcase Images** (`public/images/showcase/`)
   - `showcase-before.webp` - Original image before transformation
   - `showcase-after.webp` - Transformed image in Ghibli style

2. **Sample Images** (`public/images/samples/`)
   - `landscape.webp` - Landscape photo sample
   - `cityscape.webp` - City landscape sample
   - `portrait.webp` - Portrait photo sample
   - `animal.webp` - Animal photo sample
   - `building.webp` - Building photo sample

## API Integration

GrokGhibli uses Hugging Face's AI models for image transformation:

1. Create an account on [Hugging Face](https://huggingface.co/)
2. Obtain API Tokens (recommended to create multiple tokens)
3. Add them to your `.env.local` file (using any of the configuration methods above)
4. Restart the application to load the new environment variables

### API Endpoints

The application provides the following API endpoints:

| Endpoint | Method | Description |
|------|------|------|
| `/api/transform-ghibli` | POST | Submit an image for Ghibli-style transformation |
| `/api/transform-ghibli/check/[taskId]` | GET | Check status of a processing task |
| `/api/token-status` | GET | View token usage status (requires secret key) |

## Performance Optimizations

GrokGhibli includes the following performance optimizations:

1. **Server Components**: Uses Next.js 14 React Server Components to reduce client-side JavaScript
2. **Image Optimization**: Leverages Next.js built-in image optimization for faster loading
3. **Asynchronous Processing**: Handles long-running transformations without timeouts
4. **Intelligent Token Rotation**: Prevents service interruptions due to token limits
5. **Progress Simulation**: Provides immediate feedback during processing
6. **Reduced Image Dimensions**: Automatically scales large images to optimize processing time
7. **Responsive Loading**: Optimizes image loading strategy based on device
8. **File-based Task Storage**: Stores task data in temporary files for serverless compatibility

## Troubleshooting

Common issues and solutions:

1. **API Connection Failures**
   - Check your network connection
   - Verify that your Hugging Face Token is valid
   - Confirm the Hugging Face Space is running
   - Ensure you have not exceeded your daily quota limits

2. **Image Transformation Timeouts**
   - Try using smaller images (the app limits uploads to 3MB)
   - Use images with simpler content
   - Check API server load and try again later
   - Ensure your internet connection is stable

3. **All Tokens Exhausted**
   - Wait for automatic midnight reset
   - Add more tokens to your environment variables
   - Check token status endpoint to identify which tokens are available
   - Consider subscribing to Hugging Face Pro for higher limits

4. **Serverless Function Timeouts**
   - The app uses an asynchronous processing model to avoid timeouts
   - If you still encounter timeouts, try reducing image dimensions further
   - Consider deploying to a platform with longer function timeouts

5. **Image Not Displaying After Transformation**
   - Check browser console for error messages
   - Try a different browser or clear your cache
   - Ensure your browser supports WebP images
   - Try a different image format or size

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## SEO Optimization

GrokGhibli implements the following SEO optimizations:

1. **Metadata Optimization**: Each page has specific titles, descriptions, and keywords optimized for search engines
2. **Structured Data**: Uses appropriate HTML semantic markup to enhance content structure
3. **Responsive Design**: Ensures good user experience on all devices
4. **Site Map**: `sitemap.xml` file helps search engines discover and index all pages
5. **Robots.txt**: Guides search engine crawler behavior for optimized crawling efficiency
6. **Page Speed Optimization**: Uses Next.js server components and image optimization for faster loading

## Future Enhancements

Planned future enhancements include:

1. **Additional Style Options**: More Ghibli style variations
2. **Batch Processing**: Transform multiple images at once
3. **User Accounts**: Save transformation history
4. **Style Customization**: Adjust transformation parameters
5. **Video Processing**: Transform short video clips
6. **Social Sharing**: Direct sharing to social media platforms 