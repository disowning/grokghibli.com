/**
 * Token Manager for Hugging Face API
 * 
 * 管理多个 Hugging Face tokens，实现自动轮换和使用时间跟踪
 */

type HuggingFaceToken = `hf_${string}`;

interface TokenUsage {
  token: HuggingFaceToken;
  usageMinutes: number;
  lastUsed: Date;
  inUse: boolean;
}

class TokenManager {
  private tokens: TokenUsage[] = [];
  private currentTokenIndex: number = 0;
  private resetTimer: NodeJS.Timeout | null = null;
  
  constructor(tokenList: HuggingFaceToken[]) {
    this.tokens = tokenList.map(token => ({
      token,
      usageMinutes: 0,
      lastUsed: new Date(0), // 初始值为 1970 年
      inUse: false
    }));
    
    // 设置每天午夜自动重置
    this.scheduleNextReset();
    
    console.log(`TokenManager 已初始化，共加载 ${this.tokens.length} 个 token`);
  }

  /**
   * 计算距离下一个午夜的毫秒数
   */
  private getMillisecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }
  
  /**
   * 安排下一次午夜重置
   */
  private scheduleNextReset(): void {
    // 清除之前的定时器
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    
    // 计算到下一个午夜的时间
    const msUntilMidnight = this.getMillisecondsUntilMidnight();
    
    // 设置新的定时器
    this.resetTimer = setTimeout(() => {
      console.log('执行每日 Token 使用时间重置');
      this.resetDailyUsage();
      // 安排下一天的重置
      this.scheduleNextReset();
    }, msUntilMidnight);
    
    console.log(`Token 使用时间将在 ${new Date(Date.now() + msUntilMidnight).toLocaleString()} 重置`);
  }

  /**
   * 获取一个可用的 token
   */
  getToken(): HuggingFaceToken | null {
    // 遍历所有 token 找到一个可用的
    for (let i = 0; i < this.tokens.length; i++) {
      const tokenIndex = (this.currentTokenIndex + i) % this.tokens.length;
      const tokenData = this.tokens[tokenIndex];
      
      // 检查 token 是否在使用中
      if (tokenData.inUse) {
        continue;
      }
      
      // 检查 token 是否已达到每日限制 (5分钟)
      const today = new Date();
      const lastUsedDate = tokenData.lastUsed;
      const isSameDay = today.getDate() === lastUsedDate.getDate() &&
                       today.getMonth() === lastUsedDate.getMonth() &&
                       today.getFullYear() === lastUsedDate.getFullYear();
      
      if (isSameDay && tokenData.usageMinutes >= 5) {
        continue;
      }
      
      // 找到可用 token
      this.currentTokenIndex = tokenIndex;
      tokenData.inUse = true;
      return tokenData.token;
    }
    
    // 所有 token 都不可用
    return null;
  }

  /**
   * 开始记录 token 使用
   */
  startUsingToken(token: HuggingFaceToken): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.lastUsed = new Date();
      tokenData.inUse = true;
    }
  }

  /**
   * 标记 token 使用完成并记录使用时间
   */
  finishUsingToken(token: HuggingFaceToken, usageSeconds: number): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.inUse = false;
      
      // 计算使用分钟数并累加（向上取整到最接近的0.1分钟）
      const usageMinutes = Math.ceil(usageSeconds / 6) / 10;
      tokenData.usageMinutes += usageMinutes;
      
      console.log(`Token ${token.slice(0, 10)}... 使用了 ${usageMinutes.toFixed(1)} 分钟，今日累计 ${tokenData.usageMinutes.toFixed(1)} 分钟`);
    }
  }

  /**
   * 标记 token 使用失败，释放使用中状态但不记录时间
   */
  releaseToken(token: HuggingFaceToken): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.inUse = false;
    }
  }

  /**
   * 获取所有 token 的使用情况
   */
  getTokensStatus(): { token: string, usageMinutes: number, available: boolean }[] {
    const today = new Date();
    
    return this.tokens.map(tokenData => {
      const lastUsedDate = tokenData.lastUsed;
      const isSameDay = today.getDate() === lastUsedDate.getDate() &&
                       today.getMonth() === lastUsedDate.getMonth() &&
                       today.getFullYear() === lastUsedDate.getFullYear();
      
      const available = !(tokenData.inUse || (isSameDay && tokenData.usageMinutes >= 5));
      
      return {
        token: `${tokenData.token.slice(0, 10)}...`,
        usageMinutes: tokenData.usageMinutes,
        available
      };
    });
  }

  /**
   * 重置所有 token 的每日使用时间（通常在每天午夜调用）
   */
  resetDailyUsage(): void {
    const today = new Date();
    
    this.tokens.forEach(tokenData => {
      const lastUsedDate = tokenData.lastUsed;
      const isSameDay = today.getDate() === lastUsedDate.getDate() &&
                       today.getMonth() === lastUsedDate.getMonth() &&
                       today.getFullYear() === lastUsedDate.getFullYear();
      
      if (!isSameDay) {
        tokenData.usageMinutes = 0;
      }
    });
    
    console.log(`已重置 Token 使用时间，当前时间: ${today.toLocaleString()}`);
  }
}

/**
 * 从环境变量和默认列表加载 token
 */
function loadTokens(): HuggingFaceToken[] {
  // 默认 token 列表（作为示例，并非真实token）
  const defaultTokens = [
    'hf_example_token_1',
    'hf_example_token_2',
    'hf_example_token_3'
  ] as HuggingFaceToken[];
  
  // 尝试从环境变量获取 token
  const envTokens: HuggingFaceToken[] = [];
  
  // 检查环境变量中的单个 token
  const singleToken = process.env.HUGGING_FACE_TOKEN;
  if (singleToken && singleToken.startsWith('hf_')) {
    envTokens.push(singleToken as HuggingFaceToken);
  }
  
  // 检查环境变量中的 token 列表
  const tokenListStr = process.env.HUGGING_FACE_TOKENS;
  if (tokenListStr) {
    const tokenArray = tokenListStr.split(',').map(t => t.trim());
    for (const token of tokenArray) {
      if (token && token.startsWith('hf_')) {
        envTokens.push(token as HuggingFaceToken);
      }
    }
  }
  
  // 检查按索引命名的单独 token 环境变量（HUGGING_FACE_TOKEN_1, HUGGING_FACE_TOKEN_2 等）
  for (let i = 1; i <= 20; i++) {
    const indexedToken = process.env[`HUGGING_FACE_TOKEN_${i}`];
    if (indexedToken && indexedToken.startsWith('hf_')) {
      envTokens.push(indexedToken as HuggingFaceToken);
    }
  }
  
  // 如果从环境变量找到了 token，则使用它们，否则使用默认列表
  // 注意：默认列表仅用于示例，实际使用时应该只使用环境变量中的token
  const finalTokens = envTokens.length > 0 ? envTokens : defaultTokens;
  
  // 移除重复的 token
  return Array.from(new Set(finalTokens));
}

// 创建单例实例
const tokenManager = new TokenManager(loadTokens());

export { tokenManager, type HuggingFaceToken }; 