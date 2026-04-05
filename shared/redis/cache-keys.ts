export const CacheKeys = {
  categories: () => 'cache:categories',
  collections: (categoryId: string) => `cache:collections:${categoryId}`,
  collectionStars: (categoryId: string, clientId: string) => `cache:collection-stars:${categoryId}:${clientId}`,
  vocabulary: (collectionId: string, clientId: string) => `cache:vocab:${collectionId}:${clientId}`,
  scores: (collectionId: string, clientId: string) => `cache:scores:${collectionId}:${clientId}`,
  scoresSummary: (clientId: string) => `cache:scores:summary:${clientId}`,
};

export const CacheTTL = {
  categories: 1800,      // 30 min
  collections: 600,      // 10 min
  vocabulary: 600,       // 10 min
  scores: 300,           // 5 min
  scoresSummary: 300,    // 5 min
};
