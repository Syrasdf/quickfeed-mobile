import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PullRefresh } from 'react-vant';
import { useRecommendStore } from '../../store/useRecommendStore';
import './index.css';

const TripWaterfall = () => {
  const navigate = useNavigate();
  // 从 store 获取数据，提供默认值
  const storeData = useRecommendStore((state) => state) || {};
  const images = storeData.images || [];
  const loading = storeData.loading || false;
  const hasMore = storeData.hasMore !== undefined ? storeData.hasMore : true;
  const fetchMore = storeData.fetchMore || (() => {});
  const reset = storeData.reset || (() => {});
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [columns, setColumns] = useState([[], []]);
  const [refreshing, setRefreshing] = useState(false);
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const lazyObserverRef = useRef(null);
  const scrollObserverRef = useRef(null);

  // 瀑布流布局算法
  const layoutWaterfall = useCallback((data) => {
    const leftColumn = [];
    const rightColumn = [];
    let leftHeight = 0;
    let rightHeight = 0;

    data.forEach(item => {
      // 选择高度较小的列放置新卡片
      if (leftHeight <= rightHeight) {
        leftColumn.push(item);
        leftHeight += item.height + 16; // 16px 是间距
      } else {
        rightColumn.push(item);
        rightHeight += item.height + 16;
      }
    });

    return [leftColumn, rightColumn];
  }, []);

  // 当images更新时，重新计算瀑布流布局
  useEffect(() => {
    if (images.length > 0) {
      const [leftColumn, rightColumn] = layoutWaterfall(images);
      setColumns([leftColumn, rightColumn]);
    }
  }, [images, layoutWaterfall]);

  // 初始化加载
  useEffect(() => {
    setIsVisible(true);
    setHasInitialized(true);
    if (typeof fetchMore === 'function') {
      fetchMore();
    }
  }, []);

  // 无限滚动观察器 - 滚动到底部加载更多
  useEffect(() => {
    if (!isVisible || !hasMore) return;

    const scrollObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore && typeof fetchMore === 'function') {
          fetchMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (loaderRef.current) {
      scrollObserver.observe(loaderRef.current);
    }

    scrollObserverRef.current = scrollObserver;

    return () => {
      if (scrollObserverRef.current) {
        scrollObserverRef.current.disconnect();
      }
    };
  }, [isVisible, loading, hasMore, fetchMore]);

  // 跳转到详情页
  const handleCardClick = (item) => {
    navigate(`/detail/${item.id}`);
  };

  // 处理下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 重置数据并重新加载
      if (typeof reset === 'function') {
        await reset();
      }
      if (typeof fetchMore === 'function') {
        await fetchMore();
      }
      // 模拟网络请求延迟，提升用户体验
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // 卡片组件
  const WaterfallCard = ({ item }) => (
    <div 
      className="trip-waterfall-card" 
      onClick={() => handleCardClick(item)}
    >
      <div className="trip-image-wrapper">
        {item.isPlaceholder ? (
          // 彩色占位符模式
          <div
            className="trip-placeholder-image"
            style={{
              height: `${item.height}px`,
              backgroundColor: item.color
            }}
          >
            <div className="trip-placeholder-label">
              <span className="trip-placeholder-text">{item.title}</span>
            </div>
          </div>
        ) : (
          // 真实图片模式
          <img
            src={item.image}
            alt={item.title}
            className="trip-card-image"
            style={{ height: `${item.height}px` }}
            loading="lazy"
          />
        )}
      </div>
      <div className="trip-card-content">
        <h3 className="trip-card-title">{item.title}</h3>
        <div className="trip-card-footer">
          <div className="trip-author-info">
            <img
              src={item.avatar}
              alt={item.author}
              className="trip-author-avatar"
            />
            <span className="trip-author-name">{item.author}</span>
          </div>
          <div className="trip-like-info">
            <svg className="trip-heart-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="currentColor"
              />
            </svg>
            <span className="trip-like-count">{item.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PullRefresh
      value={refreshing}
      onRefresh={handleRefresh}
      successText="刷新成功"
      pullingText="下拉刷新"
      loosingText="释放刷新"
      loadingText="刷新中..."
    >
      <div className="trip-recommend-section" ref={containerRef}>
        {images.length === 0 && loading && !refreshing ? (
          // 初次加载中状态
          <div className="trip-loading-container">
            <div className="trip-loading-spinner"></div>
            <span className="trip-loading-text">加载中...</span>
          </div>
        ) : (
          // 实际内容 - 瀑布流显示
          <>
            <div className="trip-waterfall-container">
              <div className="trip-waterfall-column">
                {columns[0].map(item => (
                  <WaterfallCard key={item.id} item={item} />
                ))}
              </div>
              <div className="trip-waterfall-column">
                {columns[1].map(item => (
                  <WaterfallCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* 无限滚动加载更多区域 */}
            {hasMore && (
              <div ref={loaderRef} className="trip-load-more">
                {loading ? (
                  <div className="trip-loading-indicator">
                    <div className="trip-loading-spinner"></div>
                    <span className="trip-loading-text">加载更多精彩内容...</span>
                  </div>
                ) : (
                  <div className="trip-load-more-trigger">
                    <span className="trip-trigger-text">图片.img</span>
                  </div>
                )}
              </div>
            )}

            {/* 没有更多内容时的提示 */}
            {!hasMore && images.length > 0 && (
              <div className="trip-no-more-content">
                <span className="trip-no-more-text">已经到底了~</span>
              </div>
            )}
          </>
        )}
      </div>
    </PullRefresh>
  );
};

export default TripWaterfall;
