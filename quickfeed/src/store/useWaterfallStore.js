import { create } from "zustand";

// 模拟瀑布流数据生成函数
const generateWaterfallData = (page = 1, pagesize = 8) => {
  // 第一页显示真实推荐内容
  if (page === 1) {
    const realData = [
      {
        id: `waterfall-${page}-0`,
        title: "现实版「绿野仙踪」：来一场洗肺之旅",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=320&fit=crop&auto=format&q=80",
        author: "山野行者",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
        likes: "2.1k",
        height: 320,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-1`,
        title: "「人一生必去的50个地方」之梵净山",
        image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=380&fit=crop&auto=format&q=80",
        author: "云端漫步",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        likes: "1.8k",
        height: 380,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-2`,
        title: "藏在深山里的秘境温泉，治愈疲惫的心",
        image: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=290&fit=crop&auto=format&q=80",
        author: "温泉小姐姐",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        likes: "3.2k",
        height: 290,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-3`,
        title: "日出云海｜在2000米高山上看世界醒来",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=350&fit=crop&auto=format&q=80",
        author: "追日者",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        likes: "5.6k",
        height: 350,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-4`,
        title: "古镇慢生活：时光倒流的江南水乡",
        image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=310&fit=crop&auto=format&q=80",
        author: "古镇控",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        likes: "4.1k",
        height: 310,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-5`,
        title: "海边民宿｜面朝大海春暖花开的日子",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=340&fit=crop&auto=format&q=80",
        author: "海风少女",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
        likes: "9.2k",
        height: 340,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-6`,
        title: "西藏｜离天空最近的地方",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=400&h=360&fit=crop&auto=format&q=80",
        author: "藏地密码",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=50&h=50&fit=crop&crop=face",
        likes: "7.3k",
        height: 360,
        isPlaceholder: false
      },
      {
        id: `waterfall-${page}-7`,
        title: "夜市美食｜舌尖上的台湾",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop&auto=format&q=80",
        author: "美食家",
        avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=50&h=50&fit=crop&crop=face",
        likes: "6.8k",
        height: 300,
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

  const titles = [
    "探索未知的精彩瞬间",
    "记录生活的美好时光",
    "发现城市的另一面",
    "寻找内心的宁静之地",
    "品味人间烟火气息",
    "追逐梦想的脚步",
    "感受大自然的魅力",
    "体验不一样的生活"
  ];

  const authors = [
    "旅行达人", "摄影师小明", "美食博主", "生活家",
    "探索者", "背包客", "城市漫游者", "自然爱好者"
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=50&h=50&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=50&h=50&fit=crop&crop=face"
  ];

  return Array.from({ length: pagesize }, (_, i) => {
    const index = (page - 1) * pagesize + i;
    const height = 250 + (index % 4) * 40 + Math.floor(Math.random() * 80); // 250-370px变化
    const color = colors[index % colors.length];
    
    // 随机决定是使用真实图片还是占位符
    const useRealImage = Math.random() > 0.3; // 70%概率使用真实图片
    const imageIndex = index % 8;
    
    return {
      id: `waterfall-${page}-${i}`,
      title: titles[index % titles.length],
      image: useRealImage ? 
        `https://picsum.photos/400/${height}?random=${page}${i}` :
        null,
      color: !useRealImage ? color : null,
      author: authors[index % authors.length],
      avatar: avatars[index % avatars.length],
      likes: `${(Math.random() * 9 + 1).toFixed(1)}k`,
      height: height,
      isPlaceholder: !useRealImage
    };
  });
};

const useWaterfallStore = create((set, get) => ({
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
    const newData = generateWaterfallData(currentPage, 8);

    set((state) => ({
      images: [...state.images, ...newData],
      page: state.page + 1,
      loading: false,
      // 模拟最多加载10页数据
      hasMore: currentPage < 10
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

export default useWaterfallStore;
