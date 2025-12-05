import { create } from 'zustand'

// 模拟推荐数据生成函数
const generateRecommendData = (page = 1, pagesize = 6) => {
  // 第一页保持真实推荐内容
  if (page === 1) {
    const realData = [
      {
        id: `rec-${page}-0`,
        title: "藏在深山里的秘境温泉，治愈疲惫的心",
        image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=290&fit=crop&auto=format&q=80",
        author: "温泉小姐姐",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        likes: "3.2k",
        height: 290,
        isPlaceholder: false
      },
      {
        id: `rec-${page}-1`,
        title: "日出云海｜在2000米高山上看世界醒来",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&fit=crop&auto=format&q=80",
        author: "追日者",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        likes: "5.6k",
        height: 350,
        isPlaceholder: false
      },
      {
        id: `rec-${page}-2`,
        title: "古镇慢生活：时光倒流的江南水乡",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=310&fit=crop&auto=format&q=80",
        author: "古镇控",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        likes: "4.1k",
        height: 310,
        isPlaceholder: false
      },
      {
        id: `rec-${page}-3`,
        title: "海边民宿｜面朝大海春暖花开的日子",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=340&fit=crop&auto=format&q=80",
        author: "海风少女",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
        likes: "9.2k",
        height: 340,
        isPlaceholder: false
      },
      {
        id: `rec-${page}-4`,
        title: "樱花季｜邂逅春天最浪漫的粉色雨",
        image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=320&fit=crop&auto=format&q=80",
        author: "樱花小镇",
        avatar: "https://images.unsplash.com/photo-1544435307-0c4d1c1d8b09?w=50&h=50&fit=crop&crop=face",
        likes: "6.8k",
        height: 320,
        isPlaceholder: false
      },
      {
        id: `rec-${page}-5`,
        title: "西藏｜一生必去的50个地方之首",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=380&fit=crop&auto=format&q=80",
        author: "高原旅行家",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
        likes: "8.3k",
        height: 380,
        isPlaceholder: false
      }
    ];
    return realData.slice(0, pagesize);
  }

  // 第二页及以后生成彩色占位符
  const colors = [
    '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#85C1E9', '#F4D03F', '#A9DFBF', '#D7DBDD', '#FADBD8',
    '#D5DBDB', '#EBDEF0', '#EBF5FB', '#E8F6F3', '#FEF9E7', '#F4F6F6'
  ];

  return Array.from({ length: pagesize }, (_, i) => {
    const index = (page - 1) * pagesize + i;
    const height = 250 + (index % 4) * 40 + Math.floor(Math.random() * 80); // 250-370px变化
    const color = colors[index % colors.length];

    return {
      id: `rec-${page}-${i}`,
      title: `图片 ${index + 1}.img`,
      color: color,
      author: "占位符用户",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
      likes: `${(Math.random() * 9 + 1).toFixed(1)}k`,
      height: height,
      isPlaceholder: true
    };
  });
};

// Zustand Store
export const useRecommendStore = create((set, get) => ({
  images: [],
  page: 1,
  loading: false,
  hasMore: true,

  fetchMore: async () => {
    // 如果还在请求中或没有更多数据，不再发起新的请求
    if (get().loading || !get().hasMore) return;

    set({ loading: true });

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const currentPage = get().page;
    const newData = generateRecommendData(currentPage, 6);

    set((state) => ({
      images: [...state.images, ...newData],
      page: state.page + 1,
      loading: false,
      // 模拟最多加载5页数据
      hasMore: currentPage < 5
    }));
  },

  reset: () => {
    set({
      images: [],
      page: 1,
      loading: false,
      hasMore: true
    });
  }
}));
