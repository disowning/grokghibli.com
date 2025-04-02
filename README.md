# GrokGhibli

GrokGhibli是一个使用Next.js 14和人工智能技术将普通照片转换为Studio Ghibli风格艺术作品的Web应用程序。

![GrokGhibli Preview](https://placehold.co/1200x630/4A6670/ffffff/png?text=GrokGhibli+Preview)

## 功能特点

- **照片上传**：简单的拖放界面，支持多种上传方式
- **AI转换**：将普通照片转换为Studio Ghibli风格的艺术作品
- **实时进度**：转换过程中显示进度指示器
- **多种风格**：支持多种不同的Ghibli电影风格
- **高分辨率输出**：生成高质量的图像结果
- **响应式设计**：在任何设备上都有出色的用户体验

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **样式**：Tailwind CSS
- **UI组件**：Radix UI + shadcn/ui
- **服务器组件**：使用React Server Components优化性能
- **AI集成**：通过API连接到Hugging Face模型

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
│   ├── api/                # API 路由
│   ├── page.tsx            # 主页
│   └── layout.tsx          # 根布局
├── components/             # React 组件
│   ├── ui/                 # UI组件库
│   ├── Header.tsx          # 网站头部组件
│   ├── ImageUploader.tsx   # 图片上传组件
│   ├── GhibliFeatures.tsx  # 功能展示组件
│   └── Pricing.tsx         # 价格组件
├── lib/                    # 工具函数库
├── public/                 # 静态资源
└── types/                  # TypeScript类型定义
```

## API集成

GrokGhibli使用Hugging Face的AI模型进行图像转换。要使用此功能，您需要：

1. 在[Hugging Face](https://huggingface.co/)创建一个账户
2. 获取API密钥
3. 将其添加到`.env.local`文件中

## 贡献指南

欢迎贡献！请随时提交问题报告或拉取请求。

## 许可证

该项目基于MIT许可证。详情请参阅[LICENSE](LICENSE)文件。 