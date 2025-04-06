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
- **用户认证系统**：使用NextAuth支持Google登录，用户积分跟踪和管理
- **隐私与条款**：完整的隐私政策、使用条款和Cookie政策文档

## 技术栈

- **前端**：Next.js 14 (App Router)
- **API路由**：Next.js API路由，使用外部服务处理长时间运行的操作
- **样式**：Tailwind CSS
- **UI组件**：Radix UI + shadcn/ui
- **服务器组件**：React Server Components提供最佳性能
- **状态管理**：React Hooks管理客户端状态
- **认证系统**：NextAuth.js提供用户认证和会话管理
- **AI集成**：通过Gradio客户端连接到Hugging Face API
- **缓存系统**：使用Redis进行任务状态和图像存储
- **数据库**：MySQL存储用户数据和转换记录
- **外部图像处理**：使用独立服务器处理图像转换，解决Serverless超时限制

## 系统架构

Grok Ghibli采用了混合架构设计，结合了Serverless和传统服务器的优点：

1. **前端**：部署在Vercel上的Next.js应用
2. **图像处理**：外部服务器上运行的Node.js服务
3. **状态管理**：Redis数据库存储任务状态和结果
4. **用户数据**：MySQL数据库存储用户信息和积分
5. **HTTPS通信**：通过Nginx反向代理实现安全通信

这种架构解决了Serverless环境中长时间运行任务的限制，同时保持了可扩展性和低延迟的用户体验。

## 用户认证系统

Grok Ghibli使用NextAuth.js实现了完整的用户认证系统：

### 特点

- **社交登录**：支持Google OAuth登录
- **积分系统**：每个用户每月获得30点转换积分
- **自动重置**：积分每月自动重置
- **用户界面**：在导航栏显示用户信息和积分余额
- **安全会话**：使用JWT保护用户会话

### 设置认证

1. 创建Google OAuth应用并获取Client ID和Client Secret
2. 在`.env.local`文件中配置以下环境变量：
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

## 本地开发

### 先决条件

- Node.js 18+ 
- npm或yarn
- Redis服务器（可选，用于本地测试）
- MySQL服务器（用于用户认证和积分系统）

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
   
4. 在`.env.local`文件中添加所需API密钥和数据库设置
   ```
   HUGGING_FACE_TOKEN=your_api_key_here
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=grokghibli
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
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

## 项目结构
grokghibli/
├── app/ # Next.js 14 App Router
│ ├── api/ # API路由
│ │ ├── auth/ # NextAuth.js认证路由
│ │ ├── user/ # 用户信息API
│ │ ├── transform-ghibli/ # 图像转换API
│ │ │ ├── route.ts # 主API端点
│ │ │ └── check/[taskId]/ # 状态检查端点
│ │ └── token-status/ # 令牌状态API
│ ├── auth/ # 认证相关页面
│ │ ├── signin/ # 登录页面
│ │ └── error/ # 认证错误页面 
│ ├── about/ # 关于我们页面
│ ├── contact/ # 联系页面
│ ├── gallery/ # 画廊页面
│ ├── privacy-policy/ # 隐私政策页面
│ ├── terms-of-service/ # 使用条款页面
│ ├── cookie-policy/ # Cookie政策页面
│ ├── page.tsx # 主页
│ ├── providers.tsx # 全局providers
│ └── layout.tsx # 根布局
├── components/ # React组件
│ ├── ui/ # UI组件库
│ ├── Header.tsx # 网站头部组件
│ ├── Footer.tsx # 网站底部组件
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

## 用户积分系统

Grok Ghibli实现了积分系统以控制用户对图像转换功能的使用：

### 特点

- **默认积分**：每个用户每月获得30点积分
- **自动续期**：积分每月自动刷新
- **积分消耗**：每次图像转换消耗1点积分
- **积分显示**：用户界面实时显示剩余积分
- **API集成**：提供更新和查询积分的API接口

### API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/user` | GET | 获取当前登录用户的信息，包括积分 |
| `/api/user` | PUT | 更新用户积分 |

## 隐私与法律

Grok Ghibli提供了完整的隐私和法律文档，以保护用户权益并符合数据保护法规：

### 隐私政策

我们的[隐私政策](/privacy-policy)详细说明了我们如何收集、使用、披露和保护用户数据。主要内容包括：

- 收集的信息类型（账户信息、上传的图像、使用数据）
- 数据使用目的（提供服务、改进体验、通信）
- 图像处理和临时存储政策
- 数据分享和安全措施
- 用户权利和数据保留政策

### 使用条款

我们的[使用条款](/terms-of-service)规定了使用本服务的条件和限制，包括：

- 服务描述和用户账户规则
- 积分系统说明
- 用户内容权利和限制
- 禁止使用行为
- 知识产权和免责声明
- 服务修改和终止条件

### Cookie政策

我们的[Cookie政策](/cookie-policy)解释了网站如何使用Cookie和类似技术：

- Cookie的类型和用途
- 第三方Cookie的使用
- Cookie管理选项
- 与隐私政策的关系

所有这些文档均在页面底部可轻松访问，确保用户了解我们如何处理他们的数据和使用我们的服务。

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

4. **登录问题**
   - 确保已正确配置Google OAuth凭据
   - 检查环境变量中的NextAuth设置
   - 清除浏览器缓存和Cookie后重试
   - 确认MySQL数据库正常运行并可访问

5. **积分未正确更新**
   - 检查MySQL数据库连接
   - 验证users表是否存在所需的字段
   - 检查API路由的错误日志
   - 尝试重新登录

## 未来增强

计划的未来增强包括：

1. **更多风格选项**：更多吉卜力风格变体
2. **批量处理**：一次转换多个图像
3. **积分购买**：允许用户购买额外积分
4. **高级账户**：提供订阅计划获取更多功能
5. **风格自定义**：调整转换参数
6. **视频处理**：转换短视频剪辑
7. **社交分享**：直接分享到社交媒体平台
8. **更多登录选项**：添加更多社交登录提供商

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
