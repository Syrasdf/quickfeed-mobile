/**
 * 防抖Hook
 * 用于优化搜索等频繁触发的操作
 * 参考自Trip项目的实现
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * 防抖值hook - 延迟更新值
 * @param {any} value - 需要防抖的值
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {any} - 防抖后的值
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 防抖函数hook - 返回防抖后的函数
 * @param {Function} callback - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
export const useDebouncedCallback = (callback, delay = 500) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback((...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  }, [callback, delay, debounceTimer]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedCallback;
};

/**
 * 搜索防抖hook - 专门用于搜索场景
 * @param {string} searchTerm - 搜索关键词
 * @param {Function} searchFunction - 搜索函数
 * @param {number} delay - 延迟时间（毫秒）
 */
export const useSearchDebounce = (searchTerm, searchFunction, delay = 300) => {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchFunction(debouncedSearchTerm).finally(() => {
        setIsSearching(false);
      });
    }
  }, [debouncedSearchTerm, searchFunction]);

  return { isSearching, debouncedSearchTerm };
};

/**
 * 节流hook - 限制函数执行频率
 * @param {Function} callback - 需要节流的函数
 * @param {number} delay - 间隔时间（毫秒）
 * @returns {Function} - 节流后的函数
 */
export const useThrottle = (callback, delay = 1000) => {
  const [lastRun, setLastRun] = useState(Date.now());

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun >= delay) {
      setLastRun(now);
      callback(...args);
    }
  }, [callback, delay, lastRun]);

  return throttledCallback;
};

export default useDebounce;
