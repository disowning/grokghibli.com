# 安装指南

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

```
http://localhost:3000/api/token-status?secret=your_admin_secret
```

更多详细信息请参阅 [README.md](README.md)。 11