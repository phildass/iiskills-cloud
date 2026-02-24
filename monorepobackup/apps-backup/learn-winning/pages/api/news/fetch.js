export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q = 'artificial intelligence', limit = 9, page = 1 } = req.query;

    // If NEWS_API_KEY is available, fetch from NewsAPI
    if (process.env.NEWS_API_KEY) {
      const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&pageSize=${limit}&page=${page}&apiKey=${process.env.NEWS_API_KEY}`;
      
      const response = await fetch(newsApiUrl);
      const data = await response.json();

      if (data.status === 'ok') {
        return res.status(200).json({
          articles: data.articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            image: article.urlToImage,
            source: article.source.name,
            publishedAt: article.publishedAt
          }))
        });
      }
    }

    // Fallback: Return mock news articles
    const mockArticles = [
      {
        title: 'AI Breakthrough in Natural Language Processing',
        description: 'Researchers achieve new milestone in understanding human language with advanced AI models.',
        url: '#',
        image: null,
        source: 'AI News',
        publishedAt: new Date().toISOString()
      },
      {
        title: 'Machine Learning Transforms Healthcare Diagnosis',
        description: 'New ML algorithms showing 95% accuracy in early disease detection.',
        url: '#',
        image: null,
        source: 'Tech Today',
        publishedAt: new Date().toISOString()
      },
      {
        title: 'India Leads in AI Talent Development',
        description: 'Report shows India producing more AI professionals than ever before.',
        url: '#',
        image: null,
        source: 'Career Insights',
        publishedAt: new Date().toISOString()
      }
    ];

    return res.status(200).json({ articles: mockArticles });
  } catch (error) {
    console.error('News fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
}
