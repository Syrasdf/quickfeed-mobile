/**
 * AI 模型调用封装
 * 支持多种模型：DeepSeek、豆包、GPT等
 */

import axios from 'axios';

// API 配置
const API_CONFIGS = {
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKeyEnv: 'VITE_DEEPSEEK_API_KEY'
  },
  doubao: {
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'doubao-pro-32k',
    apiKeyEnv: 'VITE_DOUBAO_API_KEY'
  },
  gpt: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    apiKeyEnv: 'VITE_OPENAI_API_KEY'
  }
};

/**
 * 通用的 chat 函数，支持多模型切换
 * @param {Object} options - 配置选项
 * @param {string} options.model - 模型类型 ('deepseek' | 'doubao' | 'gpt')
 * @param {string} options.prompt - 提示词
 * @param {string} [options.apiKey] - API Key (可选，默认从环境变量读取)
 * @returns {Promise<string>} AI 响应内容
 */
export const chat = async ({ model = 'deepseek', prompt, apiKey }) => {
  // 获取模型配置
  const config = API_CONFIGS[model];
  if (!config) {
    throw new Error(`不支持的模型: ${model}`);
  }

  // 获取 API Key
  const finalApiKey = apiKey || import.meta.env[config.apiKeyEnv];
  
  // 如果没有配置 API Key，使用 Mock 数据
  if (!finalApiKey || finalApiKey === 'your_api_key_here') {
    console.warn('未配置 API Key，使用 Mock 数据');
    return mockResponse(prompt);
  }

  try {
    const response = await axios.post(
      config.endpoint,
      {
        model: config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${finalApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒超时
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`AI 调用失败 (${model}):`, error);
    // 降级到 Mock 数据
    return mockResponse(prompt);
  }
};

/**
 * Mock 响应函数（用于开发环境）
 */
const mockResponse = (prompt) => {
  // 模拟延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      if (prompt.includes('标签') || prompt.includes('tag')) {
        resolve(JSON.stringify(['旅行', '美食', '生活', '摄影', '分享']));
      } else if (prompt.includes('话题') || prompt.includes('topic')) {
        resolve(JSON.stringify([
          '周末去哪儿玩',
          '美食探店推荐',
          '旅行必备清单'
        ]));
      } else {
        resolve('这是一个 Mock 响应');
      }
    }, 500);
  });
};

/**
 * 提取内容标签
 * @param {string} content - 文章内容
 * @param {Array} images - 图片列表
 * @returns {Promise<Array<string>>} 标签数组
 */
export const extractTags = async (content, images = []) => {
  const imageCount = images.length;
  const prompt = `请分析以下内容，提取3-5个相关标签。
内容：${content}
图片数量：${imageCount}张

要求：
1. 标签要简短精准，每个标签不超过4个字
2. 标签要符合内容主题
3. 只返回 JSON 数组格式，如：["旅行", "美食", "打卡"]
4. 不要返回其他任何内容`;

  try {
    const response = await chat({ 
      model: 'deepseek', 
      prompt 
    });
    
    // 尝试解析 JSON
    try {
      const tags = JSON.parse(response);
      if (Array.isArray(tags)) {
        return tags.slice(0, 5); // 最多返回5个标签
      }
    } catch (e) {
      // 如果解析失败，尝试从文本中提取
      const matches = response.match(/"([^"]+)"/g);
      if (matches) {
        return matches.map(m => m.replace(/"/g, '')).slice(0, 5);
      }
    }
    
    // 返回默认标签
    return ['生活', '分享'];
  } catch (error) {
    console.error('提取标签失败:', error);
    return ['生活', '分享']; // 默认标签
  }
};

/**
 * 推荐相关话题
 * @param {string} content - 文章内容
 * @param {Array<string>} tags - 已有标签
 * @returns {Promise<Array<string>>} 话题数组
 */
export const suggestTopics = async (content, tags = []) => {
  const tagStr = tags.join('、');
  const prompt = `基于以下内容和标签，推荐3个相关话题。
内容：${content}
标签：${tagStr}

要求：
1. 话题要有吸引力和互动性
2. 每个话题不超过15个字
3. 只返回 JSON 数组格式，如：["周末去哪儿玩", "美食探店推荐"]
4. 不要返回其他任何内容`;

  try {
    const response = await chat({ 
      model: 'deepseek', 
      prompt 
    });
    
    // 尝试解析 JSON
    try {
      const topics = JSON.parse(response);
      if (Array.isArray(topics)) {
        return topics.slice(0, 3); // 最多返回3个话题
      }
    } catch (e) {
      // 如果解析失败，尝试从文本中提取
      const matches = response.match(/"([^"]+)"/g);
      if (matches) {
        return matches.map(m => m.replace(/"/g, '')).slice(0, 3);
      }
    }
    
    // 返回默认话题
    return ['分享你的故事', '一起来打卡'];
  } catch (error) {
    console.error('推荐话题失败:', error);
    return ['分享你的故事', '一起来打卡']; // 默认话题
  }
};

/**
 * 流式输出支持（用于未来扩展）
 */
export const streamChat = async ({ model = 'deepseek', prompt, onChunk }) => {
  // TODO: 实现流式输出
  // 目前先返回完整结果
  const result = await chat({ model, prompt });
  if (onChunk) {
    onChunk(result);
  }
  return result;
};

export default {
  chat,
  extractTags,
  suggestTopics,
  streamChat
};
