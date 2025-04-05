/**
 * Token Manager for Hugging Face API
 * 
 * Manages multiple Hugging Face tokens, with automatic rotation and usage tracking
 */

type HuggingFaceToken = `hf_${string}`;

interface TokenUsage {
  token: HuggingFaceToken;
  usageMinutes: number;
  lastUsed: Date;
  inUse: boolean;
  quotaExceeded?: boolean; // Mark token whether it has reached GPU quota limit
  lastQuotaCheck?: Date;   // Time of last check quota status
}

class TokenManager {
  private tokens: TokenUsage[] = [];
  private currentTokenIndex: number = 0;
  private resetTimer: NodeJS.Timeout | null = null;
  
  constructor(tokenList: HuggingFaceToken[]) {
    this.tokens = tokenList.map(token => ({
      token,
      usageMinutes: 0,
      lastUsed: new Date(0), // Initial value is 1970
      inUse: false
    }));
    
    // Set automatic reset at midnight every day
    this.scheduleNextReset();
    
    console.log(`TokenManager initialized with ${this.tokens.length} tokens`);
  }

  /**
   * Calculate milliseconds until midnight
   */
  private getMillisecondsUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }
  
  /**
   * Schedule next midnight reset
   */
  private scheduleNextReset(): void {
    // Clear previous timer
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    
    // Calculate time until next midnight
    const msUntilMidnight = this.getMillisecondsUntilMidnight();
    
    // Set new timer
    this.resetTimer = setTimeout(() => {
      console.log('Performing daily token usage reset');
      this.resetDailyUsage();
      // Schedule next reset for the next day
      this.scheduleNextReset();
    }, msUntilMidnight);
    
    console.log(`Token usage will be reset at ${new Date(Date.now() + msUntilMidnight).toLocaleString()}`);
  }
  
  /**
   * Sort tokens by usage
   * - Unrestricted tokens first
   * - Then by today's usage time
   * - Finally by the longest time since last used
   */
  private sortTokensByUsage(): void {
    this.tokens.sort((a, b) => {
      // First sort by quota status (unrestricted first)
      if (a.quotaExceeded && !b.quotaExceeded) return 1;
      if (!a.quotaExceeded && b.quotaExceeded) return -1;
      
      // Then sort by usage within the same day
      const aToday = this.isSameDay(a.lastUsed);
      const bToday = this.isSameDay(b.lastUsed);
      
      if (aToday && !bToday) return 1; // a used today but b didn't, b comes first
      if (!aToday && bToday) return -1; // b used today but a didn't, a comes first
      if (aToday && bToday) return a.usageMinutes - b.usageMinutes; // Both used today, who used less comes first
      
      // Finally sort by last used time (longest time since last used comes first)
      return a.lastUsed.getTime() - b.lastUsed.getTime();
    });
  }
  
  /**
   * Helper function: Check if date is today
   */
  private isSameDay(date: Date): boolean {
    const today = new Date();
    return today.getDate() === date.getDate() &&
           today.getMonth() === date.getMonth() &&
           today.getFullYear() === date.getFullYear();
  }

  /**
   * Get a usable token
   * Use intelligent sorting to select the most suitable token
   */
  getToken(): HuggingFaceToken | null {
    // First sort tokens
    this.sortTokensByUsage();
    
    console.log('Attempting to get token, sorted token list:');
    this.tokens.forEach((t, i) => {
      console.log(`#${i}: ${t.token.substring(0, 10)}..., Usage: ${t.usageMinutes.toFixed(1)} minutes, Exceeded: ${t.quotaExceeded || false}, Last Used: ${t.lastUsed.toISOString()}`);
    });
    
    // Select first usable token
    for (const tokenData of this.tokens) {
      // Skip tokens in use
      if (tokenData.inUse) {
        console.log(`Token ${tokenData.token.substring(0, 10)}... in use, skipping`);
        continue;
      }
      
      // Skip tokens known to have reached GPU quota limit
      if (tokenData.quotaExceeded) {
        // If marked as exceeded and more than 4 hours since last check, reset status again
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        if (!tokenData.lastQuotaCheck || tokenData.lastQuotaCheck < fourHoursAgo) {
          console.log(`Token ${tokenData.token.substring(0, 10)}... exceeded status more than 4 hours, reset status`);
          tokenData.quotaExceeded = false;
        } else {
          console.log(`Token ${tokenData.token.substring(0, 10)}... reached GPU quota limit, skipping`);
          continue;
        }
      }
      
      // Check if token has reached daily limit (5 minutes)
      if (this.isSameDay(tokenData.lastUsed) && tokenData.usageMinutes >= 5) {
        console.log(`Token ${tokenData.token.substring(0, 10)}... reached today's usage limit, skipping`);
        continue;
      }
      
      // Find usable token
      tokenData.inUse = true;
      console.log(`Selected Token ${tokenData.token.substring(0, 10)}...`);
      return tokenData.token;
    }
    
    // All tokens are unusable
    console.log('All Tokens are unusable');
    return null;
  }

  /**
   * Start recording token usage
   */
  startUsingToken(token: HuggingFaceToken): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.lastUsed = new Date();
      tokenData.inUse = true;
    }
  }

  /**
   * Mark token usage completed and record usage time
   */
  finishUsingToken(token: HuggingFaceToken, usageSeconds: number): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.inUse = false;
      
      // Calculate usage minutes and add (rounded up to nearest 0.1 minutes)
      const usageMinutes = Math.ceil(usageSeconds / 6) / 10;
      tokenData.usageMinutes += usageMinutes;
      
      console.log(`Token ${token.slice(0, 10)}... used ${usageMinutes.toFixed(1)} minutes, today's total: ${tokenData.usageMinutes.toFixed(1)} minutes`);
    }
  }

  /**
   * Mark token usage failed, release in use status but don't record time
   */
  releaseToken(token: HuggingFaceToken): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      tokenData.inUse = false;
    }
  }
  
  /**
   * Mark token as reached GPU quota limit
   */
  markTokenQuotaExceeded(token: HuggingFaceToken): void {
    const tokenData = this.tokens.find(t => t.token === token);
    if (tokenData) {
      console.log(`Marking Token ${token.slice(0, 10)}... as GPU quota exceeded`);
      tokenData.quotaExceeded = true;
      tokenData.lastQuotaCheck = new Date();
      tokenData.inUse = false;
    }
  }

  /**
   * Get usage status of all tokens
   */
  getTokensStatus(): { token: string, usageMinutes: number, available: boolean, quotaExceeded: boolean }[] {
    return this.tokens.map(tokenData => {
      const available = !(
        tokenData.inUse || 
        tokenData.quotaExceeded || 
        (this.isSameDay(tokenData.lastUsed) && tokenData.usageMinutes >= 5)
      );
      
      return {
        token: `${tokenData.token.slice(0, 10)}...`,
        usageMinutes: tokenData.usageMinutes,
        available,
        quotaExceeded: tokenData.quotaExceeded || false
      };
    });
  }

  /**
   * Reset daily usage time of all tokens (usually called at midnight every day)
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
    
    console.log(`Token usage reset, current time: ${today.toLocaleString()}`);
  }
}

/**
 * Load tokens from environment variables and default list
 */
function loadTokens(): HuggingFaceToken[] {
  // Default token list (for example, not real tokens)
  const defaultTokens = [
    'hf_example_token_1',
    'hf_example_token_2',
    'hf_example_token_3'
  ] as HuggingFaceToken[];
  
  // Try to get tokens from environment variables
  const envTokens: HuggingFaceToken[] = [];
  
  // Check single token in environment variable
  const singleToken = process.env.HUGGING_FACE_TOKEN;
  if (singleToken && singleToken.startsWith('hf_')) {
    envTokens.push(singleToken as HuggingFaceToken);
  }
  
  // Check token list in environment variable
  const tokenListStr = process.env.HUGGING_FACE_TOKENS;
  if (tokenListStr) {
    const tokenArray = tokenListStr.split(',').map(t => t.trim());
    for (const token of tokenArray) {
      if (token && token.startsWith('hf_')) {
        envTokens.push(token as HuggingFaceToken);
      }
    }
  }
  
  // Check separately named single token environment variables (HUGGING_FACE_TOKEN_1, HUGGING_FACE_TOKEN_2, etc.)
  for (let i = 1; i <= 20; i++) {
    const indexedToken = process.env[`HUGGING_FACE_TOKEN_${i}`];
    if (indexedToken && indexedToken.startsWith('hf_')) {
      envTokens.push(indexedToken as HuggingFaceToken);
    }
  }
  
  // If tokens found from environment variables, use them, otherwise use default list
  // Note: Default list is only for example, actual use should only use tokens from environment variables
  const finalTokens = envTokens.length > 0 ? envTokens : defaultTokens;
  
  // Remove duplicate tokens
  return Array.from(new Set(finalTokens));
}

// Create singleton instance
const tokenManager = new TokenManager(loadTokens());

export { tokenManager, type HuggingFaceToken }; 