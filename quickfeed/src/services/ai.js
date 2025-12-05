/**
 * AI服务模块
 * 集成各种AI功能，包括标签生成、内容推荐、摘要生成等
 * 参考自Trip项目的LLM实现
 */

// AI模型配置
const AI_CONFIG = {
  DEEPSEEK: {
    url: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    key: import.meta.env.VITE_DEEPSEEK_API_KEY
  },
  DOUBAO: {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'doubao-lite-32k',
    key: import.meta.env.VITE_DOUBAO_API_KEY
  },
  OPENAI: {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    key: import.meta.env.VITE_OPENAI_API_KEY
  }
};

class AIService {
  constructor(provider = 'DEEPSEEK') {
    this.config = AI_CONFIG[provider] || AI_CONFIG.DEEPSEEK;
  }

  /**
   * 基础聊天功能
   */
  async chat(messages, options = {}) {
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.key}`
        },
        body: JSON.stringify({
          model: options.model || this.config.model,
          messages,
          stream: options.stream || false,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000
        })
      });

      if (!response.ok) {
        throw new Error(`AI请求失败: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        role: data.choices[0].message.role
      };
    } catch (error) {
      console.error('AI服务错误:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 生成内容标签
   * @param {string} content - 需要生成标签的内容
   * @returns {Promise<string[]>} - 返回标签数组
   */
  async generateTags(content) {
    const messages = [
      {
        role: "system",
        content: "你是一个专业的内容标签生成助手。请根据用户提供的内容，生成3-5个相关的中文标签。标签应该简洁、准确、相关性强。请直接返回用逗号分隔的标签，不要其他说明文字。"
      },
      {
        role: "user",
        content: `请为以下内容生成标签：\n${content.slice(0, 500)}`
      }
    ];

    const response = await this.chat(messages);
    
    if (response.success) {
      // 解析标签，处理可能的格式问题
      const tags = response.content
        .replace(/[#＃]/g, '') // 移除井号
        .split(/[,，、\s]+/) // 支持多种分隔符
        .filter(tag => tag.length > 0 && tag.length <= 10) // 过滤无效标签
        .slice(0, 5); // 最多5个标签
      
      return tags;
    }
    
    return [];
  }

  /**
   * 生成内容摘要
   * @param {string} content - 需要生成摘要的内容
   * @param {number} maxLength - 摘要最大长度
   * @returns {Promise<string>} - 返回摘要文本
   */
  async generateSummary(content, maxLength = 100) {
    const messages = [
      {
        role: "system",
        content: `你是一个专业的内容摘要生成助手。请将用户提供的内容总结成不超过${maxLength}个字的摘要。摘要应该保留核心信息，语言流畅自然。`
      },
      {
        role: "user",
        content: `请为以下内容生成摘要：\n${content}`
      }
    ];

    const response = await this.chat(messages);
    
    if (response.success) {
      return response.content.slice(0, maxLength);
    }
    
    // 如果AI失败，使用简单的截取方式
    return content.slice(0, maxLength) + '...';
  }

  /**
   * 推荐相关内容
   * @param {string[]} tags - 内容标签
   * @param {string} currentId - 当前内容ID（用于排除）
   * @returns {Promise<string[]>} - 返回推荐的关键词
   */
  async recommendRelatedTopics(tags, currentId) {
    const messages = [
      {
        role: "system",
        content: "你是一个内容推荐助手。根据用户提供的标签，推荐5-8个相关的话题或关键词。推荐的内容应该有一定相关性但不完全相同，有助于用户发现更多感兴趣的内容。请直接返回用逗号分隔的推荐词，不要其他说明。"
      },
      {
        role: "user",
        content: `当前内容标签：${tags.join('、')}\n请推荐相关话题：`
      }
    ];

    const response = await this.chat(messages);
    
    if (response.success) {
      const topics = response.content
        .split(/[,，、\s]+/)
        .filter(topic => topic.length > 0)
        .slice(0, 8);
      
      return topics;
    }
    
    return [];
  }

  /**
   * 智能内容分类
   * @param {string} content - 需要分类的内容
   * @returns {Promise<string>} - 返回分类名称
   */
  async classifyContent(content) {
    const categories = ['生活', '美食', '旅行', '科技', '娱乐', '运动', '时尚', '教育', '其他'];
    
    const messages = [
      {
        role: "system",
        content: `你是一个内容分类助手。请将用户提供的内容分类到以下类别之一：${categories.join('、')}。请直接返回类别名称，不要其他说明。`
      },
      {
        role: "user",
        content: `请对以下内容进行分类：\n${content.slice(0, 300)}`
      }
    ];

    const response = await this.chat(messages);
    
    if (response.success) {
      const category = response.content.trim();
      // 验证是否是有效分类
      if (categories.includes(category)) {
        return category;
      }
    }
    
    return '其他';
  }

  /**
   * 内容优化建议
   * @param {string} content - 需要优化的内容
   * @returns {Promise<string[]>} - 返回优化建议数组
   */
  async suggestContentImprovement(content) {
    const messages = [
      {
        role: "system",
        content: "你是一个内容优化助手。请为用户的内容提供3-5条具体的优化建议，帮助提升内容质量和吸引力。每条建议用一句话概括。请用数组格式返回，每条建议为一个元素。"
      },
      {
        role: "user",
        content: `请为以下内容提供优化建议：\n${content.slice(0, 500)}`
      }
    ];

    const response = await this.chat(messages);
    
    if (response.success) {
      try {
        // 尝试解析为数组
        const suggestions = response.content
          .split(/\n/)
          .filter(line => line.trim())
          .map(line => line.replace(/^[\d\-\*\•\.]+\s*/, '')) // 移除序号
          .slice(0, 5);
        
        return suggestions;
      } catch {
        return [response.content];
      }
    }
    
    return [];
  }

  /**
   * 流式输出支持（用于实时对话）
   * @param {Array} messages - 对话消息
   * @param {Function} onChunk - 收到数据块时的回调
   * @returns {Promise<void>}
   */
  async streamChat(messages, onChunk) {
    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.key}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`AI请求失败: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('流式输出错误:', error);
      throw error;
    }
  }

  /**
   * 切换AI提供商
   * @param {string} provider - 提供商名称
   */
  switchProvider(provider) {
    if (AI_CONFIG[provider]) {
      this.config = AI_CONFIG[provider];
      return true;
    }
    return false;
  }
}

// 导出单例
const aiService = new AIService();

// 导出便捷方法
export const generateTags = (content) => aiService.generateTags(content);
export const generateSummary = (content, maxLength) => aiService.generateSummary(content, maxLength);
export const recommendRelatedTopics = (tags, currentId) => aiService.recommendRelatedTopics(tags, currentId);
export const classifyContent = (content) => aiService.classifyContent(content);
export const suggestContentImprovement = (content) => aiService.suggestContentImprovement(content);
export const streamChat = (messages, onChunk) => aiService.streamChat(messages, onChunk);

export default aiService;
