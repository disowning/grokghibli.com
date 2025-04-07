# 安装指南

## 目录
1. [快速启动](#快速启动)
2. [Token系统说明](#token-系统说明)
3. [等待提示消息配置](#等待提示消息配置)
4. [用户认证系统配置](#用户认证系统配置)
5. [隐私与法律文档配置](#隐私与法律文档配置)
6. [服务器部署](#服务器部署)
   - [图像处理服务器设置](#图像处理服务器设置)
   - [Redis缓存配置](#redis缓存配置)
   - [MySQL数据库配置](#mysql数据库配置)
   - [Nginx反向代理配置](#nginx反向代理配置)
7. [Vercel部署](#vercel部署)
8. [故障排除](#故障排除)

## 快速启动

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/grokghibli.git
   cd grokghibli
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者
   yarn install
   ```

3. **环境变量配置**
   ```bash
   cp .env.example .env.local
   ```
   
   然后编辑 `.env.local` 文件，添加您的 Hugging Face API token、数据库配置以及Google OAuth凭据。

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或者
   yarn dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   npm start
   # 或者
   yarn build
   yarn start
   ```

## Token 系统说明

本项目使用了 Token 轮换系统，能够自动在多个 Hugging Face API token 之间轮换。系统会跟踪每个 token 的使用时间，并在一个 token 达到每日限制时自动切换到下一个。

### 配置多个 Token

在 `.env.local` 文件中，有三种方式配置多个 token：

1. **逗号分隔法**:
   ```
   HUGGING_FACE_TOKENS=hf_token1,hf_token2,hf_token3
   ```

2. **索引方法**:
   ```
   HUGGING_FACE_TOKEN_1=hf_token1
   HUGGING_FACE_TOKEN_2=hf_token2
   HUGGING_FACE_TOKEN_3=hf_token3
   ```

3. **单个 Token** (如果只有一个):
   ```
   HUGGING_FACE_TOKEN=hf_your_token
   ```

### 查看 Token 状态

配置 ADMIN_SECRET 后，可以通过以下 URL 查看所有 token 的使用状态：
http://localhost:3000/api/token-status?secret=your_admin_secret

## 等待提示消息配置

Grok Ghibli使用动态等待提示消息来提升用户在图像转换过程中的等待体验。这些消息具有吉卜力风格的主题，每隔几秒钟自动轮换显示。

### 自定义等待消息

您可以在 `components/ImageUploader.tsx` 文件中修改等待消息数组来自定义显示的消息：

```typescript
// 等待消息数组
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
```

### 修改轮换间隔

默认情况下，等待消息每4秒钟轮换一次。如果需要调整这个间隔，可以修改 `startMessageRotation` 函数中的轮换时间：

```typescript
// 开始消息轮换
const startMessageRotation = () => {
  // 设置初始等待消息索引
  setWaitingMessageIndex(Math.floor(Math.random() * waitingMessages.length));
  
  // 每4秒随机切换一条等待消息
  const interval = setInterval(() => {
    setWaitingMessageIndex(Math.floor(Math.random() * waitingMessages.length));
  }, 4000); // 这里可以修改间隔时间（毫秒）
  
  messageIntervalRef.current = interval;
};
```

### 多语言支持

如果您的应用需要支持多种语言，可以根据用户选择的语言显示不同语言版本的等待消息：

```typescript
// 多语言等待消息示例
const waitingMessagesMultiLingual = {
  en: [
    "Transforming to Ghibli style...",
    "Hayao Miyazaki is working on your image...",
    // 其他英文消息
  ],
  zh: [
    "正在转换为吉卜力风格...",
    "宫崎骏大师正在作画中...",
    // 其他中文消息
  ],
  // 其他语言
};

// 然后根据用户语言选择相应的消息数组
const currentLanguage = "en"; // 或从用户设置中获取
const waitingMessages = waitingMessagesMultiLingual[currentLanguage];
```

## 用户认证系统配置

Grok Ghibli使用NextAuth.js实现用户认证和积分管理系统。以下是完整的配置流程：

### 谷歌OAuth配置

1. **创建Google Cloud项目**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建新项目或使用现有项目
   - 导航到"API和服务" > "OAuth同意屏幕"
   - 设置OAuth同意屏幕（内部或外部用户类型）
   - 添加必要的信息（应用名称、联系方式等）

2. **创建OAuth客户端ID**
   - 导航到"凭据"
   - 点击"创建凭据" > "OAuth客户端ID"
   - 应用类型选择"Web应用"
   - 添加应用名称
   - 添加重定向URI：
     - 开发环境: `http://localhost:3000/api/auth/callback/google`
     - 生产环境: `https://yourdomain.com/api/auth/callback/google`
   - 点击"创建"，记下生成的客户端ID和客户端密钥

### 环境变量配置

将以下环境变量添加到 `.env.local` 文件：

```
# Google OAuth配置
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000 # 开发环境
# NEXTAUTH_URL=https://yourdomain.com # 生产环境
NEXTAUTH_SECRET=generate_a_secure_random_string_here

# MySQL配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=grokghibli
```

对于生产环境，可以使用以下命令生成安全的随机字符串作为NEXTAUTH_SECRET：
```bash
openssl rand -base64 32
```

### MySQL数据库准备

1. **创建数据库表**

确保MySQL服务器中存在以下表结构：

```sql
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  name VARCHAR(255) NULL,
  image VARCHAR(1000) NULL,
  provider VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  monthly_credits INT DEFAULT 30,
  credits_reset_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 MONTH),
  INDEX (email)
);
```

在项目中，这个表的创建通常由server.js中的initDatabase函数处理。

### NextAuth配置文件

确保项目中存在以下文件结构：
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth API路由
- `/app/providers.tsx` - 全局认证providers组件
- `/app/auth/signin/page.tsx` - 自定义登录页面
- `/app/auth/error/page.tsx` - 认证错误页面

## 隐私与法律文档配置

为了确保您的应用程序符合数据保护法规和最佳实践，Grok Ghibli包含了三个关键的法律文档页面。这些页面已预先配置，但您应根据您的实际业务情况进行自定义。

### 文档概述

1. **隐私政策** (`app/privacy-policy/page.tsx`)
   - 详细说明应用如何收集、处理和保护用户数据
   - 包括数据收集范围、使用目的、数据分享情况和用户权利

2. **使用条款** (`app/terms-of-service/page.tsx`)
   - 规定使用服务的条件和限制
   - 包括账户规则、积分系统、用户内容权利和禁止行为

3. **Cookie政策** (`app/cookie-policy/page.tsx`)
   - 解释网站如何使用Cookie和类似技术
   - 包括Cookie类型、第三方Cookie、管理选项等

### 自定义步骤

1. **更新联系信息**
   ```tsx
   // 在每个文档中更新电子邮件地址和联系信息
   <p>
     Email: privacy@yourdomain.com<br />
     // 其他联系信息
   </p>
   ```

2. **修改生效日期**
   - 默认情况下，文档显示当前日期作为"最后更新"日期
   - 如需固定日期，请修改以下代码：
   ```tsx
   {/* 将动态日期替换为固定日期 */}
   <p className="text-gray-600 mb-8">Last updated: April 1, 2025</p>
   ```

3. **调整法律管辖区**
   ```tsx
   // 在使用条款中更新适用法律
   <p>
     These Terms shall be governed by and construed in accordance with the laws of
     [您的法律管辖区], without regard to its conflict of law provisions.
   </p>
   ```

4. **添加特定业务条款**
   - 根据您的业务模式和区域法规要求，在相应部分添加或修改条款

### 链接设置

这些文档已通过页面底部的Footer组件链接。Footer组件包含三个法律文档的链接：

```tsx
// app/components/Footer.tsx
<div>
  <h3 className="text-lg font-semibold mb-4 text-ghibli-primary">Legal</h3>
  <ul className="space-y-2">
    <li>
      <Link href="/privacy-policy" className="text-gray-600 hover:text-ghibli-primary">
        Privacy Policy
      </Link>
    </li>
    <li>
      <Link href="/terms-of-service" className="text-gray-600 hover:text-ghibli-primary">
        Terms of Service
      </Link>
    </li>
    <li>
      <Link href="/cookie-policy" className="text-gray-600 hover:text-ghibli-primary">
        Cookie Policy
      </Link>
    </li>
  </ul>
</div>
```

### 重要注意事项

- **法律咨询**: 这些文档模板仅作为起点。强烈建议在部署前咨询法律专业人士，确保文档符合您的具体业务需求和适用法律法规。
- **数据处理活动**: 确保文档中描述的数据处理活动与您的实际操作一致。
- **定期更新**: 随着法规变化和业务发展，定期审查和更新这些文档。
- **翻译**: 如果您的服务面向不同语言的用户，考虑提供多语言版本的法律文档。

## 服务器部署

为了解决Vercel Serverless函数的超时限制问题（最长60秒），本项目采用了外部服务器处理图像转换任务。以下是完整的服务器部署指南。

### 图像处理服务器设置

1. **准备服务器**
   
   使用具有公网IP的服务器（例如AWS EC2、Oracle Cloud等）。确保服务器有足够的内存（推荐至少4GB）和存储空间。

2. **安装Docker**
   
   ```bash
   # Ubuntu系统
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo systemctl enable --now docker
   ```

3. **创建项目目录**
   
   ```bash
   mkdir -p /opt/image-processor
   cd /opt/image-processor
   ```

4. **创建Docker配置文件**

   创建`Dockerfile`:
   ```bash
   cat > Dockerfile << 'EOF'
   FROM node:18-alpine

   # 安装Python和编译工具
   RUN apk add --no-cache python3 make g++ 

   WORKDIR /app

   # 安装依赖
   COPY package.json .
   RUN npm install

   # 复制应用代码
   COPY server.js .

   # 暴露3002端口
   EXPOSE 3002

   # 启动服务
   CMD ["node", "server.js"]
   EOF
   ```

   创建`package.json`:
   ```bash
   cat > package.json << 'EOF'
   {
     "name": "grokghibli-image-processor",
     "version": "1.0.0",
     "main": "server.js",
     "type": "module",
     "dependencies": {
       "@gradio/client": "^1.14.1",
       "express": "^4.19.1",
       "ioredis": "^5.3.2",
       "node-fetch": "^3.3.0"
     }
   }
   EOF
   ```

   创建`server.js`:
   ```bash
   cat > server.js << 'EOF'
   import express from 'express';
   import Redis from 'ioredis';
   import { Client } from '@gradio/client';
   import fetch from 'node-fetch';
   import { Blob } from 'buffer';

   const app = express();

   app.use(express.json({ limit: '50mb' }));

   // Redis连接 - 使用环境变量
   const redis = new Redis({
     host: process.env.REDIS_HOST || 'localhost',
     port: parseInt(process.env.REDIS_PORT || '6379'),
     password: process.env.REDIS_PASSWORD || 'redis_password'
   });

   // 健康检查
   app.get('/health', (req, res) => {
     res.json({ status: 'ok' });
   });

   // 处理请求
   app.post('/process/:taskId', async (req, res) => {
     const { taskId } = req.params;
     const { prompt, height, width, seed, token, imageBase64, userId } = req.body;
     
     console.log(`Received processing request for task ${taskId}`);
     
     // 立即响应
     res.json({ received: true });
     
     // 在后台处理图像
     processImage(taskId, imageBase64, prompt, height, width, seed, token, userId).catch(console.error);
   });

   async function processImage(taskId, imageBase64, prompt, height, width, seed, token, userId) {
     try {
       console.log(`Processing task ${taskId}: ${prompt}`);
       
       // 更新进度-10%
       await redis.set(
         `task:${taskId}:status`, 
         JSON.stringify({
           status: 'processing',
           startTime: Date.now(),
           token,
           userId,
           progress: 10,
           prompt
         }), 
         'EX', 
         3600
       );
       
       // 将Base64转换为Buffer
       const buffer = Buffer.from(imageBase64, 'base64');
       
       try {
         // 连接到Gradio
         console.log(`Connecting to Gradio API for task ${taskId}`);
         const client = await Client.connect("https://jamesliu1217-easycontrol-ghibli.hf.space/", {
           hf_token: token
         });

         // 更新进度-20%
         await redis.set(
           `task:${taskId}:status`, 
           JSON.stringify({
             status: 'processing',
             startTime: Date.now(),
             token,
             userId,
             progress: 20,
             prompt
           }), 
           'EX', 
           3600
         );

         // 创建Blob对象
         const blob = new Blob([buffer], { type: 'image/jpeg' });
         
         // 调用API生成图像
         console.log(`Sending request to generate image for task ${taskId}`);
         const result = await client.predict("/single_condition_generate_image", {
           prompt: prompt,
           spatial_img: blob,
           height: height,
           width: width,
           seed: seed,
           control_type: "Ghibli"
         });
         
         // 更新进度-70%
         await redis.set(
           `task:${taskId}:status`, 
           JSON.stringify({
             status: 'processing',
             startTime: Date.now(),
             token,
             userId,
             progress: 70,
             prompt
           }), 
           'EX', 
           3600
         );

         // 处理结果
         if (Array.isArray(result.data) && result.data.length > 0 && result.data[0].url) {
           console.log(`Downloading generated image for task ${taskId}`);
           const imageUrl = result.data[0].url;
           
           // 下载图像
           const response = await fetch(imageUrl);
           if (!response.ok) {
             throw new Error(`Failed to download image: ${response.status}`);
           }

           const imageData = await response.arrayBuffer();
           
           // 更新进度-90%
           await redis.set(
             `task:${taskId}:status`, 
             JSON.stringify({
               status: 'processing',
               startTime: Date.now(),
               token,
               userId,
               progress: 90,
               prompt
             }), 
             'EX', 
             3600
           );
           
           // 保存图像
           console.log(`Saving image data for task ${taskId}`);
           const base64Data = Buffer.from(new Uint8Array(imageData)).toString('base64');
           await redis.set(`task:${taskId}:image`, base64Data, 'EX', 3600);
           
           // 如果有用户ID，减少其积分（发送到服务更新用户积分）
           if (userId) {
             try {
               const apiUrl = process.env.API_URL || 'http://localhost:3000';
               await fetch(`${apiUrl}/api/user-credits`, {
                 method: 'POST',
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${process.env.API_TOKEN}`
                 },
                 body: JSON.stringify({
                   userId,
                   operation: 'subtract',
                   amount: 1
                 })
               });
               console.log(`Updated credits for user ${userId}`);
             } catch (creditError) {
               console.error(`Failed to update credits for user ${userId}:`, creditError);
             }
           }
           
           // 完成任务
           await redis.set(
             `task:${taskId}:status`, 
             JSON.stringify({
               status: 'completed',
               startTime: Date.now(),
               token,
               userId,
               progress: 100,
               prompt
             }), 
             'EX', 
             3600
           );
           
           console.log(`Task ${taskId} completed successfully`);
         } else {
           throw new Error('No valid image URL in response');
         }
       } catch (apiError) {
         console.error(`API error for task ${taskId}:`, apiError);
         
         // 检查是否是GPU配额超限
         if (apiError.message && (
           apiError.message.includes("GPU quota exceeded") || 
           apiError.message.includes("exceed free GPU quota")
         )) {
           // 使用原图作为结果
           console.log(`GPU quota exceeded for task ${taskId}, using original image`);
           
           // 保存原始图像作为结果
           await redis.set(`task:${taskId}:image`, imageBase64, 'EX', 3600);
           
           // 更新状态为完成
           await redis.set(
             `task:${taskId}:status`, 
             JSON.stringify({
               status: 'completed',
               startTime: Date.now(),
               token,
               userId,
               progress: 100,
               prompt,
               note: 'Using original image due to GPU quota exceeded'
             }), 
             'EX', 
             3600
           );
         } else {
           throw apiError;
         }
       }
     } catch (error) {
       console.error(`Error processing task ${taskId}:`, error);
       
       // 保存错误状态
       await redis.set(
         `task:${taskId}:status`, 
         JSON.stringify({
           status: 'failed',
           startTime: Date.now(),
           token,
           userId,
           error: error.message,
           prompt
         }), 
         'EX', 
         3600
       );
     }
   }

   // 启动服务器
   const PORT = 3002;
   app.listen(PORT, () => {
     console.log(`Image processing server running on port ${PORT}`);
   });
   EOF
   ```

5. **构建和运行Docker容器**
   
   ```bash
   # 确保已经安装了Docker
   docker build -t image-processor .
   
   # 运行容器，连接到Redis网络
   docker run -d -p 3002:3002 \
     --name grokghibli-image-processor \
     --restart always \
     --network your_redis_network \
     -e REDIS_HOST=your_redis_container_name \
     -e REDIS_PORT=6379 \
     -e REDIS_PASSWORD=your_redis_password \
     -e API_URL=https://yourdomain.com \
     -e API_TOKEN=your_secure_api_token \
     image-processor
   ```

### Redis缓存配置

1. **使用Docker安装Redis**
   
   ```bash
   docker run -d \
     --name redis-cache \
     -p 6379:6379 \
     --restart always \
     -v redis-data:/data \
     redis:latest \
     redis-server --requirepass "your_strong_password"
   ```

2. **测试Redis连接**
   
   ```bash
   docker exec -it redis-cache redis-cli -a "your_strong_password" ping
   ```
   
   应该返回"PONG"。

### MySQL数据库配置

1. **使用Docker安装MySQL**

   ```bash
   docker run -d \
     --name mysql-db \
     -p 3306:3306 \
     --restart always \
     -v mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=your_root_password \
     -e MYSQL_DATABASE=grokghibli \
     -e MYSQL_USER=grokghibli \
     -e MYSQL_PASSWORD=your_user_password \
     mysql:8.0
   ```

2. **初始化数据库表**

   ```bash
   docker exec -i mysql-db mysql -ugrokghibli -pyour_user_password grokghibli << EOF
   CREATE TABLE IF NOT EXISTS users (
     id VARCHAR(50) PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NULL,
     name VARCHAR(255) NULL,
     image VARCHAR(1000) NULL,
     provider VARCHAR(50) NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_login TIMESTAMP NULL,
     monthly_credits INT DEFAULT 30,
     credits_reset_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 1 MONTH),
     INDEX (email)
   );
   EOF
   ```

3. **测试MySQL连接**

   ```bash
   docker exec -it mysql-db mysql -ugrokghibli -pyour_user_password -e "SELECT 'Connection successful!';"
   ```

### Nginx反向代理配置

为了使Vercel能够安全连接到您的图像处理服务和数据库，需要设置HTTPS反向代理。

1. **安装Nginx**
   
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **安装Certbot（用于SSL证书）**
   
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

3. **配置Nginx**
   
   创建配置文件：
   ```bash
   sudo nano /etc/nginx/sites-available/grokghibli
   ```
   
   添加以下内容：
   ```nginx
   server {
       listen 80;
       server_name api.grokghibli.com;
       
       location / {
           proxy_pass http://localhost:3002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_connect_timeout 300s;
           proxy_read_timeout 300s;
           proxy_send_timeout 300s;
           proxy_buffers 16 16k;
           proxy_buffer_size 32k;
           client_max_body_size 50M;  # 允许大文件上传
       }
   }
   ```

4. **启用配置并获取SSL证书**
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/grokghibli /etc/nginx/sites-enabled/
   sudo nginx -t  # 测试配置
   sudo systemctl restart nginx

   # 获取SSL证书
   sudo certbot --nginx -d api.grokghibli.com
   ```
   
   按照Certbot的提示完成SSL配置，它会自动修改Nginx配置添加SSL设置。

5. **验证HTTPS设置**
   
   在浏览器中访问 `https://api.grokghibli.com/health`，应该返回 `{"status":"ok"}`。

## Vercel部署

1. **准备Next.js应用**
   
   修改应用中的API路由，将图像处理请求发送到您的外部服务器，并确保用户ID也一同发送：
   
   编辑 `app/api/transform-ghibli/route.ts` 文件：
   ```typescript
   // 获取当前会话和用户ID
   const session = await getServerSession(authOptions);
   const userId = session?.user?.id;
   
   // 将图像转为Base64
   const imageBuffer = await imageFile.arrayBuffer();
   const imageBase64 = Buffer.from(new Uint8Array(imageBuffer)).toString('base64');
   
   // 发送请求到处理服务器
   console.log(`Sending processing request to external server for task ${taskId}`);
   
   fetch('https://api.grokghibli.com/process/' + taskId, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       prompt,
       height,
       width,
       seed,
       token: usedToken,
       imageBase64,
       userId
     })
   }).catch(err => console.error('Failed to start processing:', err));
   ```

2. **添加环境变量**
   
   在Vercel项目设置中，添加以下环境变量：
   ```
   REDIS_HOST=207.211.179.194
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   HUGGING_FACE_TOKEN=your_token_here
   MYSQL_HOST=207.211.179.194
   MYSQL_PORT=3306
   MYSQL_USER=grokghibli
   MYSQL_PASSWORD=your_user_password
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your_nextauth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```
   
   或者使用多个Token：
   ```
   HUGGING_FACE_TOKENS=token1,token2,token3
   ```

3. **部署到Vercel**
   
   ```bash
   # 安装Vercel CLI（如果尚未安装）
   npm install -g vercel
   
   # 部署
   vercel --prod
   ```
   
   或者使用Vercel控制台进行部署：
   - 推送代码到GitHub
   - 在Vercel控制台中连接仓库
   - 设置环境变量
   - 点击"Deploy"

## 完整架构流程

完整部署后，系统的工作流程如下：

1. 用户通过Google OAuth登录应用
2. Vercel应用验证身份并创建会话
3. 用户上传图片以进行吉卜力风格转换
4. Vercel应用将任务ID、用户ID和图片数据发送到外部服务器
5. 外部服务器处理图片并将结果存储在Redis中
6. 外部服务器减少用户的积分余额
7. Vercel应用定期检查任务状态
8. 处理完成后，Vercel从Redis获取结果并展示给用户

这种混合架构解决了Vercel Serverless函数的60秒超时限制问题，同时保持了前端的高性能和可扩展性。

## 进度显示功能配置

Grok Ghibli的进度显示功能需要正确配置才能正常工作。以下是配置步骤：

### 1. 环境变量配置

在`.env.local`文件中添加以下配置：

```bash
# 进度显示配置
PROGRESS_UPDATE_INTERVAL=2000  # 进度更新间隔（毫秒）
MAX_RETRY_ATTEMPTS=3          # 最大重试次数
RETRY_DELAY=1000             # 重试延迟（毫秒）
```

### 2. Redis配置

确保Redis服务器正确配置了以下设置：

```bash
# Redis配置
maxmemory 1gb
maxmemory-policy allkeys-lru
```

### 3. 进度更新API配置

在图像处理服务器上配置进度更新API：

```javascript
// server.js
app.post('/progress/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { progress, status } = req.body;
  
  // 更新Redis中的进度
  await redis.set(
    `task:${taskId}:status`,
    JSON.stringify({
      status,
      progress,
      updatedAt: Date.now()
    }),
    'EX',
    3600
  );
  
  res.json({ success: true });
});
```

## 错误处理系统配置

### 1. 错误日志配置

配置错误日志系统：

```bash
# 创建日志目录
mkdir -p /var/log/grokghibli

# 设置日志权限
chown -R node:node /var/log/grokghibli
```

### 2. 错误监控配置

配置错误监控系统：

```javascript
// lib/error-handler.ts
export const errorHandler = {
  logError: async (error: Error, context: string) => {
    // 记录错误到日志文件
    await fs.appendFile(
      '/var/log/grokghibli/errors.log',
      `${new Date().toISOString()} [${context}] ${error.message}\n`
    );
    
    // 发送错误通知
    if (process.env.NODE_ENV === 'production') {
      await sendErrorNotification(error, context);
    }
  }
};
```

### 3. 自动重试配置

配置自动重试机制：

```javascript
// lib/retry-handler.ts
export const retryHandler = {
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  }
};
```

### 4. 优雅降级配置

配置优雅降级处理：

```javascript
// lib/fallback-handler.ts
export const fallbackHandler = {
  async handleFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (error) {
      console.error('Primary operation failed, using fallback:', error);
      return await fallbackOperation();
    }
  }
};
```

## 性能优化配置

### 1. 前端优化配置

配置Next.js优化：

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['api.grokghibli.com'],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};
```

### 2. 后端优化配置

配置Redis缓存：

```javascript
// lib/cache-service.ts
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});
```

### 3. 数据库优化配置

配置MySQL连接池：

```javascript
// lib/database.ts
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
});
```

### 4. CDN配置

配置CDN集成：

```nginx
# nginx.conf
server {
    location /static/ {
        proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
        proxy_cache_valid 200 60m;
        proxy_cache_valid 404 1m;
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

## 故障排除

### 认证问题

**问题**: 用户无法登录或登录后立即被登出  
**解决方案**: 
- 检查环境变量中的NEXTAUTH_URL和NEXTAUTH_SECRET是否正确设置
- 确认Google OAuth凭据配置正确，包括重定向URI
- 验证数据库连接正常，users表结构正确
- 测试命令：使用不同浏览器尝试登录
- 查看Next.js日志中的错误信息

### 积分问题

**问题**: 用户积分未更新或显示不正确  
**解决方案**:
- 检查MySQL数据库中用户记录的积分字段
- 验证积分更新API是否正常工作
- 确保图像处理服务有权限调用积分更新API
- 测试命令：直接查询数据库检查积分值
  ```sql
  SELECT id, email, monthly_credits, credits_reset_at FROM users WHERE email='user@example.com';
  ```

### Vercel连接问题

**问题**: Vercel无法连接到外部服务器  
**解决方案**: 
- 确保已配置HTTPS并有有效证书
- 验证域名指向正确的服务器IP
- 检查防火墙设置，确保端口443开放
- 测试命令: `curl https://api.grokghibli.com/health`

### Redis连接问题

**问题**: 无法连接到Redis  
**解决方案**:
- 确保Redis密码正确
- 检查Redis是否监听所有接口 (`bind 0.0.0.0`)
- 验证Redis端口是否开放
- 测试命令: `redis-cli -h 207.211.179.194 -p 6379 -a your_password ping`

### MySQL连接问题

**问题**: 无法连接到MySQL数据库  
**解决方案**:
- 检查MySQL用户名和密码是否正确
- 验证MySQL是否允许远程连接
- 确认防火墙未阻止MySQL端口
- 测试命令: `mysql -h 207.211.179.194 -u grokghibli -p -e "SHOW DATABASES;"`

### 定期维护

为确保系统稳定运行，请定期执行以下维护任务：

1. **更新依赖**
   ```bash
   npm update
   ```

2. **备份数据库**
   ```bash
   # MySQL备份
   docker exec mysql-db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" grokghibli' > grokghibli_$(date +%Y-%m-%d).sql
   ```

3. **监控服务器资源**
   ```bash
   htop
   ```

4. **检查SSL证书有效期**
   ```bash
   sudo certbot certificates
   ```

5. **更新系统软件**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
