# Grok Ghibli

Grok Ghibli是一个使用AI技术和Next.js 14将您的照片转换为吉卜力工作室风格艺术作品的Web应用程序。该应用程序提供了无缝、用户友好的体验，用于创建您图像的迷人吉卜力风格转换。

![Grok Ghibli Preview](/images/showcase/showcase-after.webp)

## 特点

- **AI驱动转换**：利用先进的AI模型进行准确的吉卜力风格转换
- **异步处理系统**：在后台处理图像转换，无超时问题
- **实时进度跟踪**：通过实时进度更新监控转换过程
- **高质量输出**：生成高分辨率吉卜力风格艺术作品
- **用户友好界面**：简单的拖放式照片上传
- **示例图像**：使用内置示例图像尝试转换
- **响应式设计**：在任何设备上都能获得完美体验
- **SEO优化**：通过元标签、站点地图和robots.txt完全优化搜索引擎

## 技术栈

- **前端**：Next.js 14 (App Router)
- **API路由**：Next.js API路由，使用外部服务处理长时间运行的操作
- **样式**：Tailwind CSS
- **UI组件**：Radix UI + shadcn/ui
- **服务器组件**：React Server Components提供最佳性能
- **状态管理**：React Hooks管理客户端状态
- **AI集成**：通过Gradio客户端连接到Hugging Face API
- **缓存系统**：使用Redis进行任务状态和图像存储
- **外部图像处理**：使用独立服务器处理图像转换，解决Serverless超时限制

## 系统架构

Grok Ghibli采用了混合架构设计，结合了Serverless和传统服务器的优点：

1. **前端**：部署在Vercel上的Next.js应用
2. **图像处理**：外部服务器上运行的Node.js服务
3. **状态管理**：Redis数据库存储任务状态和结果
4. **HTTPS通信**：通过Nginx反向代理实现安全通信

这种架构解决了Serverless环境中长时间运行任务的限制，同时保持了可扩展性和低延迟的用户体验。

## 本地开发

### 先决条件

- Node.js 18+ 
- npm或yarn
- Redis服务器（可选，用于本地测试）

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
   
4. 在`.env.local`文件中添加所需API密钥
   ```
   HUGGING_FACE_TOKEN=your_api_key_here
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```
   
   或添加多个令牌以提高可靠性：
   ```
   HUGGING_FACE_TOKENS=hf_token1,hf_token2,hf_token3
   ```

5. 启动开发服务器
   ```
   npm run dev
   ```

6. 在浏览器中打开[http://localhost:3000](http://localhost:3000)

## 生产部署

### Vercel部署

对于最佳性能，在Vercel上部署前端：

1. 将仓库推送到GitHub
2. 将GitHub仓库连接到Vercel
3. 在Vercel控制面板中添加环境变量
4. 部署

### 图像处理服务器部署

为了处理长时间运行的图像转换任务，需要设置外部处理服务器：

1. 准备一台具有公网IP的服务器（如AWS EC2、Oracle Cloud等）
2. 配置域名和SSL证书（通过Nginx和Let's Encrypt）
3. 安装Docker和所需软件
4. 部署图像处理服务和Redis缓存
5. 在Vercel环境变量中配置服务器URL

详细的服务器设置说明请参见[INSTALL.md](INSTALL.md)。

## 高级令牌管理系统

GrokGhibli使用复杂的令牌管理系统处理Hugging Face API调用：

### 特点

- **多令牌轮换**：支持多个API令牌的自动轮换
- **智能选择算法**：基于使用情况、配额限制和上次使用时间优先选择令牌
- **使用时间跟踪**：精确监控每个令牌的使用时间（精确到0.1分钟）
- **配额限制检测**：自动检测令牌何时达到其GPU配额限制
- **自动限制**：达到每日使用限制（5分钟）时自动切换到替代令牌
- **每日重置**：在午夜自动重置使用统计
- **状态监控**：提供查看令牌使用状态的API端点

### 令牌配置

配置令牌的三种方式：

1. **单个令牌**：
   ```
   HUGGING_FACE_TOKEN=hf_your_token_here
   ```

2. **逗号分隔令牌列表**：
   ```
   HUGGING_FACE_TOKENS=hf_token1,hf_token2,hf_token3
   ```

3. **索引多个令牌**：
   ```
   HUGGING_FACE_TOKEN_1=hf_token1
   HUGGING_FACE_TOKEN_2=hf_token2
   ```

### 查看令牌状态

访问以下API端点查看令牌使用情况：
/api/token-status?secret=your_admin_secret

在`.env.local`中设置`ADMIN_SECRET`环境变量以保护此端点。

## 异步图像处理

GrokGhibli实现了高级异步图像处理系统：

1. **任务队列**：图像在后台任务队列中处理
2. **状态跟踪**：每个任务都有用于监控的ID和状态
3. **轮询机制**：客户端轮询状态直到处理完成
4. **进度更新**：处理过程中的实时进度更新
5. **回退机制**：如果所有令牌都用尽，则返回原始图像
6. **Redis存储**：使用Redis存储任务状态和处理后的图像
7. **外部处理服务**：使用专用服务器处理图像，避免Serverless超时限制

## 项目结构
grokghibli/
├── app/ # Next.js 14 App Router
│ ├── api/ # API路由
│ │ ├── transform-ghibli/ # 图像转换API
│ │ │ ├── route.ts # 主API端点
│ │ │ └── check/[taskId]/ # 状态检查端点
│ │ └── token-status/ # 令牌状态API
│ ├── blog/ # 博客页面
│ ├── contact/ # 联系页面
│ ├── features/ # 功能页面
│ ├── showcase/ # 展示页面
│ ├── page.tsx # 主页
│ └── layout.tsx # 根布局
├── components/ # React组件
│ ├── ui/ # UI组件库
│ ├── Header.tsx # 网站头部组件
│ ├── ImageUploader.tsx # 图像上传组件
│ ├── GhibliFeatures.tsx# 功能展示组件
│ └── Pricing.tsx # 定价组件
├── lib/ # 工具库
│ ├── token-manager.ts # 令牌管理系统
│ └── cache-service.ts # 缓存服务连接
├── server/ # 外部处理服务器代码
│ ├── Dockerfile # Docker配置
│ ├── server.js # 图像处理服务
│ └── package.json # 服务依赖
├── public/ # 静态资源
│ ├── robots.txt # 搜索引擎爬虫说明
│ ├── sitemap.xml # 站点地图
│ └── images/ # 图像资源
│ ├── showcase/ # 转换前/后的示例
│ └── samples/ # 示例图像
└── types/ # TypeScript类型定义

## 图像资源

项目包含两种类型的图像：

1. **展示图像** (`public/images/showcase/`)
   - `showcase-before.webp` - 转换前的原始图像
   - `showcase-after.webp` - 吉卜力风格的转换后图像

2. **示例图像** (`public/images/samples/`)
   - `landscape.webp` - 风景照片样本
   - `cityscape.webp` - 城市景观样本
   - `portrait.webp` - 人像照片样本
   - `animal.webp` - 动物照片样本
   - `building.webp` - 建筑照片样本

## API集成

GrokGhibli使用Hugging Face的AI模型进行图像转换：

1. 在[Hugging Face](https://huggingface.co/)上创建账户
2. 获取API令牌（建议创建多个令牌）
3. 将它们添加到您的`.env.local`文件中（使用上述任何配置方法）
4. 重新启动应用程序以加载新的环境变量

### API端点

应用程序提供以下API端点：

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/transform-ghibli` | POST | 提交图像进行吉卜力风格转换 |
| `/api/transform-ghibli/check/[taskId]` | GET | 检查处理任务的状态 |
| `/api/token-status` | GET | 查看令牌使用状态（需要密钥） |

## 性能优化

GrokGhibli包含以下性能优化：

1. **服务器组件**：使用Next.js 14 React Server Components减少客户端JavaScript
2. **图像优化**：利用Next.js内置图像优化加快加载速度
3. **异步处理**：处理长时间运行的转换而无超时
4. **智能令牌轮换**：防止由于令牌限制导致的服务中断
5. **进度模拟**：在处理过程中提供即时反馈
6. **图像尺寸缩减**：自动缩小大图像以优化处理时间
7. **响应式加载**：基于设备优化图像加载策略
8. **外部图像处理**：将耗时任务转移到专用服务器
9. **Redis缓存**：高效存储和检索任务状态与图像

## 常见问题解决

常见问题及解决方案：

1. **API连接失败**
   - 检查您的网络连接
   - 验证您的Hugging Face令牌是否有效
   - 确认Hugging Face空间是否正在运行
   - 确保您没有超出每日配额限制

2. **图像转换超时**
   - 尝试使用较小的图像（应用程序限制上传到3MB）
   - 使用内容较简单的图像
   - 检查API服务器负载并稍后再试
   - 确保您的互联网连接稳定

3. **所有令牌用尽**
   - 等待午夜自动重置
   - 向环境变量添加更多令牌
   - 检查令牌状态端点以确定哪些令牌可用
   - 考虑订阅Hugging Face Pro以获得更高限制

4. **Serverless函数超时**
   - 该应用使用异步处理模型和外部处理服务器避免超时
   - 如果仍然遇到超时，请尝试进一步减小图像尺寸
   - 确保图像处理服务器正常运行

5. **转换后图像不显示**
   - 检查浏览器控制台的错误消息
   - 尝试不同的浏览器或清除缓存
   - 确保您的浏览器支持WebP图像
   - 尝试不同的图像格式或大小

## 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 许可证

本项目根据MIT许可证授权。详情请参阅[LICENSE](LICENSE)文件。

## SEO优化

GrokGhibli实现了以下SEO优化：

1. **元数据优化**：每个页面都有为搜索引擎优化的特定标题、描述和关键词
2. **结构化数据**：使用适当的HTML语义标记增强内容结构
3. **响应式设计**：确保在所有设备上都有良好的用户体验
4. **站点地图**：`sitemap.xml`文件帮助搜索引擎发现和索引所有页面
5. **Robots.txt**：指导搜索引擎爬虫行为以优化爬取效率
6. **页面速度优化**：使用Next.js服务器组件和图像优化加快加载速度

## 未来增强

计划的未来增强包括：

1. **更多风格选项**：更多吉卜力风格变体
2. **批量处理**：一次转换多个图像
3. **用户账户**：保存转换历史
4. **风格自定义**：调整转换参数
5. **视频处理**：转换短视频剪辑
6. **社交分享**：直接分享到社交媒体平台
