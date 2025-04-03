# Grok Ghibli

Grok Ghibli is a web application that transforms your photos into Studio Ghibli-style artwork using xAI's latest Grok technology and Next.js 14. Last updated: April 3, 2025.

![Grok Ghibli Preview](/images/showcase/showcase-after.webp)

## Features

- **Grok-Powered AI**: Utilizes xAI's advanced Grok technology for accurate Ghibli-style transformations
- **Multiple Styles**: Choose from various iconic Studio Ghibli film styles
- **Real-time Processing**: Watch your photos transform with live progress tracking
- **High-Quality Output**: Generate high-resolution Ghibli-style artwork
- **User-Friendly Interface**: Simple drag-and-drop photo upload
- **Responsive Design**: Perfect experience on any device
- **SEO Optimized**: Fully optimized for search engines with meta tags, sitemap, and robots.txt

## Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Server Components**: React Server Components for optimal performance
- **AI Integration**: Connected to xAI's Grok model via API

## 本地开发

### 前提条件

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/grokghibli.git
   cd grokghibli
   ```

2. 安装依赖
   ```
   npm install
   ```

3. 创建环境变量文件
   ```
   cp .env.example .env.local
   ```
   
4. 在`.env.local`文件中添加所需的API密钥
   ```
   HUGGINGFACE_API_KEY=your_api_key_here
   ```

5. 启动开发服务器
   ```
   npm run dev
   ```

6. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 生产部署

构建优化的生产版本：

```
npm run build
npm start
```

## 项目结构

```
grokghibli/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API 路由
│   ├── blog/              # 博客页面
│   ├── contact/           # 联系页面
│   ├── features/          # 特性页面
│   ├── showcase/          # 展示页面
│   ├── page.tsx           # 主页
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   ├── ui/               # UI组件库
│   ├── Header.tsx        # 网站头部组件
│   ├── ImageUploader.tsx # 图片上传组件
│   ├── GhibliFeatures.tsx# 功能展示组件
│   └── Pricing.tsx       # 价格组件
├── lib/                  # 工具函数库
├── public/               # 静态资源
│   ├── robots.txt        # 搜索引擎爬虫指令文件
│   ├── sitemap.xml       # 站点地图
│   └── images/          # 图片资源
│       ├── showcase/    # 展示用的转换前后对比图
│       └── samples/     # 示例图片
│           ├── landscape.webp  # 风景示例
│           ├── cityscape.webp  # 城市示例
│           ├── portrait.webp   # 人物示例
│           ├── et.webp        # 动物示例
│           └── building.webp   # 建筑示例
└── types/               # TypeScript类型定义
```

## 图片资源说明

项目包含两类图片：

1. **展示图片** (`public/images/showcase/`)
   - `showcase-before.webp` - 转换前的原始图片
   - `showcase-after.webp` - 转换后的Ghibli风格图片

2. **示例图片** (`public/images/samples/`)
   - `landscape.webp` - 风景照片示例
   - `cityscape.webp` - 城市景观示例
   - `portrait.webp` - 人物照片示例
   - `et.webp` - 动物照片示例
   - `building.webp` - 建筑照片示例

## API集成

GrokGhibli使用Hugging Face的AI模型进行图像转换。要使用此功能，您需要：

1. 在[Hugging Face](https://huggingface.co/)创建一个账户
2. 获取API密钥
3. 将其添加到`.env.local`文件中

## 贡献指南

欢迎贡献！请随时提交问题报告或拉取请求。

## 许可证

该项目基于MIT许可证。详情请参阅[LICENSE](LICENSE)文件。

## SEO 优化

GrokGhibli已实施以下SEO优化措施（截至2025年4月更新）：

1. **元数据优化**：每个页面都有特定的标题、描述和关键词，优化了搜索引擎索引
2. **结构化数据**：使用适当的HTML语义标记增强内容结构
3. **响应式设计**：确保在所有设备上有良好的用户体验
4. **站点地图**：`sitemap.xml`文件帮助搜索引擎发现和索引所有页面（2025年4月3日更新）
5. **Robots.txt**：指导搜索引擎爬虫行为，优化爬取效率
6. **页面速度优化**：使用Next.js的服务器组件和图像优化提高加载速度 