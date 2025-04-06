# 安装指南

## 目录
1. [快速启动](#快速启动)
2. [Token系统说明](#token-系统说明)
3. [服务器部署](#服务器部署)
   - [图像处理服务器设置](#图像处理服务器设置)
   - [Redis缓存配置](#redis缓存配置)
   - [Nginx反向代理配置](#nginx反向代理配置)
4. [Vercel部署](#vercel部署)
5. [故障排除](#故障排除)

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
   
   然后编辑 `.env.local` 文件，添加您的 Hugging Face API token。

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
     const { prompt, height, width, seed, token, imageBase64 } = req.body;
     
     console.log(`Received processing request for task ${taskId}`);
     
     // 立即响应
     res.json({ received: true });
     
     // 在后台处理图像
     processImage(taskId, imageBase64, prompt, height, width, seed, token).catch(console.error);
   });

   async function processImage(taskId, imageBase64, prompt, height, width, seed, token) {
     try {
       console.log(`Processing task ${taskId}: ${prompt}`);
       
       // 更新进度-10%
       await redis.set(
         `task:${taskId}:status`, 
         JSON.stringify({
           status: 'processing',
           startTime: Date.now(),
           token,
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
           
           // 完成任务
           await redis.set(
             `task:${taskId}:status`, 
             JSON.stringify({
               status: 'completed',
               startTime: Date.now(),
               token,
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

### Nginx反向代理配置

为了使Vercel能够安全连接到您的图像处理服务，需要设置HTTPS反向代理。

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
   sudo nano /etc/nginx/sites-available/image-processor
   ```
   
   添加以下内容（替换为您的域名）：
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;  # 替换为您的域名
       
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
   sudo ln -s /etc/nginx/sites-available/image
   4. **启用配置并获取SSL证书**
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/image-processor /etc/nginx/sites-enabled/
   sudo nginx -t  # 测试配置
   sudo systemctl restart nginx

   # 获取SSL证书
   sudo certbot --nginx -d api.yourdomain.com
   ```
   
   按照Certbot的提示完成SSL配置，它会自动修改Nginx配置添加SSL设置。

5. **验证HTTPS设置**
   
   在浏览器中访问 `https://api.yourdomain.com/health`，应该返回 `{"status":"ok"}`。

## Vercel部署

1. **准备Next.js应用**
   
   修改应用中的API路由，将图像处理请求发送到您的外部服务器：
   
   编辑 `app/api/transform-ghibli/route.ts` 文件：
   ```typescript
   // 将图像转为Base64
   const imageBuffer = await imageFile.arrayBuffer();
   const imageBase64 = Buffer.from(new Uint8Array(imageBuffer)).toString('base64');
   
   // 发送请求到处理服务器
   console.log(`Sending processing request to external server for task ${taskId}`);
   
   fetch('https://api.yourdomain.com/process/' + taskId, {
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
       imageBase64
     })
   }).catch(err => console.error('Failed to start processing:', err));
   ```

2. **添加环境变量**
   
   在Vercel项目设置中，添加以下环境变量：
   ```
   REDIS_HOST=your_server_ip
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   HUGGING_FACE_TOKEN=your_token_here
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

1. 用户在网站上传图片到Vercel应用
2. Vercel应用将任务ID和图片数据发送到您的外部服务器
3. 外部服务器处理图片并将结果存储在Redis中
4. Vercel应用定期检查任务状态
5. 处理完成后，Vercel从Redis获取结果并展示给用户

这种混合架构解决了Vercel Serverless函数的60秒超时限制问题，同时保持了前端的高性能和可扩展性。

## 故障排除

### Vercel连接问题

**问题**: Vercel无法连接到外部服务器  
**解决方案**: 
- 确保已配置HTTPS并有有效证书
- 验证域名指向正确的服务器IP
- 检查防火墙设置，确保端口443开放
- 测试命令: `curl https://api.yourdomain.com/health`

### Redis连接问题

**问题**: 无法连接到Redis  
**解决方案**:
- 确保Redis密码正确
- 检查Redis是否监听所有接口 (`bind 0.0.0.0`)
- 验证Redis端口是否开放
- 测试命令: `redis-cli -h your_server_ip -p 6379 -a your_password ping`

### 图像处理服务问题

**问题**: 图像处理服务启动失败或崩溃  
**解决方案**:
- 检查Docker日志: `docker logs grokghibli-image-processor`
- 确保所有依赖正确安装
- 验证服务器有足够内存和CPU资源
- 可能需要调整Node.js内存限制: `--max-old-space-size=4096`

### 任务处理卡在某个进度

**问题**: 任务进度停滞，不继续前进  
**解决方案**:
- 检查图像处理服务器日志找出卡住的环节
- 验证Hugging Face API是否正常工作
- 检查是否已达到API配额限制
- 考虑重启图像处理服务: `docker restart grokghibli-image-processor`

### 任务队列管理

为管理任务队列和监控系统性能，可以添加管理端点：

```javascript
// 在server.js中添加
app.get('/admin/tasks', async (req, res) => {
  const keys = await redis.keys('task:*:status');
  const tasks = [];
  
  for (const key of keys) {
    const taskId = key.split(':')[1];
    const status = await redis.get(key);
    tasks.push({ taskId, status: JSON.parse(status) });
  }
  
  res.json(tasks);
});
```

保护此端点，仅允许管理员访问：

```javascript
app.use('/admin', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

## 性能优化

### Redis性能优化

在`/etc/redis/redis.conf`中添加以下配置：
maxmemory 2gb
maxmemory-policy allkeys-lru

### Nginx性能优化

在`/etc/nginx/nginx.conf`中的`http`块添加：

```nginx
http {
    # 基本设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # 缓冲区设置
    client_body_buffer_size 10K;
    client_header_buffer_size 1k;
    client_max_body_size 50m;
    large_client_header_buffers 4 4k;
    
    # 缓存设置
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Gzip压缩
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Node.js性能优化

启动图像处理服务时添加以下环境变量：

```bash
docker run -d ... -e NODE_ENV=production image-processor
```

## 定期维护

1. **SSL证书更新**
   
   Let's Encrypt证书每90天需要更新一次，通常Certbot会自动更新：
   ```bash
   sudo certbot renew --dry-run  # 测试更新
   ```
   
   确保添加cron任务自动更新：
   ```bash
   sudo crontab -e
   # 添加: 0 3 * * * /usr/bin/certbot renew --quiet
   ```

2. **备份Redis数据**
   
   创建定期备份脚本：
   ```bash
   #!/bin/bash
   BACKUP_DIR="/backup/redis"
   DATE=$(date +%Y%m%d)
   mkdir -p $BACKUP_DIR
   docker exec redis-cache redis-cli -a "your_password" SAVE
   docker cp redis-cache:/data/dump.rdb $BACKUP_DIR/redis-$DATE.rdb
   ```
   
   添加cron任务每日执行：
   ```bash
   0 2 * * * /path/to/backup-script.sh
   ```

3. **监控服务器资源**
   
   安装监控工具：
   ```bash
   sudo apt install htop iotop
   ```
   
   考虑添加更高级的监控解决方案，如Prometheus和Grafana。

## 安全最佳实践

1. **防火墙设置**
   
   ```bash
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Redis安全设置**
   
   - 使用强密码
   - 仅允许内部网络访问
   - 禁用危险命令（在redis.conf中）：
     ```
     rename-command FLUSHALL ""
     rename-command CONFIG ""
     ```

3. **定期更新**
   
   ```bash
   sudo apt update
   sudo apt upgrade
   docker pull redis:latest
   docker pull node:18-alpine
   ```

4. **日志监控**
   
   ```bash
   sudo apt install logwatch fail2ban
   ```

## 结论

这套架构为在Vercel上部署的Next.js应用提供了处理长时间运行任务的解决方案，通过将计算密集型任务转移到外部服务器，同时使用Redis进行状态管理，您可以克服Serverless环境的限制，同时保持高可用性和可扩展性。

本指南涵盖了从服务器设置到性能优化的完整流程，但根据您的具体需求，可能需要进一步调整某些参数或配置。
