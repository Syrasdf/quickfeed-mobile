/**
 * IntersectionObserver Hook
 * 用于监听元素是否进入视窗，实现懒加载等功能
 * 参考自Trip项目的实现
 */

import { useEffect, useRef } from 'react';

/**
 * @param {Function} callback - 当元素进入视窗时执行的回调函数
 * @param {Object} options - IntersectionObserver的配置选项
 * @returns {Object} - 返回需要观察的元素的ref
 */
export const useIntersectionObserver = (callback, options = {}) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    const currentTarget = targetRef.current;
    
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRef;
};

/**
 * 用于图片懒加载的特定hook
 */
export const useLazyLoadImage = (src, placeholder) => {
  const imgRef = useRef(null);
  
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const targetImg = entry.target;
        const tempImg = new Image();
        
        // 先显示占位图
        if (placeholder) {
          targetImg.src = placeholder;
        }
        
        // 加载真实图片
        tempImg.src = src;
        tempImg.onload = () => {
          targetImg.src = tempImg.src;
          targetImg.classList.add('loaded');
        };
        
        observer.unobserve(targetImg);
      }
    }, {
      threshold: 0.01,
      rootMargin: '100px'
    });

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src, placeholder]);

  return imgRef;
};

/**
 * 用于滚动加载更多的hook
 */
export const useLoadMore = (callback, hasMore = true) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });

    const currentLoader = loaderRef.current;
    
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [callback, hasMore]);

  return loaderRef;
};

export default useIntersectionObserver;
