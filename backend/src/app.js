const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const cohereService = require('./services/cohereService');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Basic MCP (Model Context Protocol) integration
class MCPAnalytics {
  constructor() {
    this.analysisCache = new Map();
  }

  // MCP-style context analysis for repository insights
  async analyzeRepoContext(repoData, contributors, commits) {
    const cacheKey = `${repoData.full_name}-${Date.now()}`;
    
    if (this.analysisCache.has(cacheKey)) {
      return this.analysisCache.get(cacheKey);
    }

    const analysis = {
      projectHealth: this.calculateProjectHealth(repoData, contributors, commits),
      activityPattern: this.analyzeActivityPattern(commits),
      contributorDiversity: this.analyzeContributorDiversity(contributors),
      codebaseInsights: this.generateCodebaseInsights(repoData),
      recommendations: this.generateRecommendations(repoData, contributors, commits)
    };

    // Cache for 5 minutes
    this.analysisCache.set(cacheKey, analysis);
    setTimeout(() => this.analysisCache.delete(cacheKey), 5 * 60 * 1000);

    return analysis;
  }

  calculateProjectHealth(repo, contributors, commits) {
    let score = 50; // Base score
    
    // Recent activity boost
    const lastCommit = new Date(repo.updated_at);
    const daysSinceUpdate = (Date.now() - lastCommit.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) score += 20;
    else if (daysSinceUpdate < 30) score += 10;
    else if (daysSinceUpdate > 365) score -= 20;

    // Community engagement
    if (repo.stargazers_count > 1000) score += 15;
    if (repo.forks_count > 100) score += 10;
    if (contributors.length > 5) score += 10;
    
    // Documentation and best practices
    if (repo.has_wiki) score += 5;
    if (repo.license) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  analyzeActivityPattern(commits) {
    if (!commits || commits.length === 0) return { pattern: 'insufficient-data' };

    const commitDates = commits.map(c => new Date(c.commit.author.date));
    const now = new Date();
    const daysSinceCommits = commitDates.map(date => 
      Math.floor((now - date) / (1000 * 60 * 60 * 24))
    );

    const avgDaysBetween = daysSinceCommits.reduce((a, b) => a + b, 0) / daysSinceCommits.length;

    let pattern = 'sporadic';
    if (avgDaysBetween < 7) pattern = 'very-active';
    else if (avgDaysBetween < 30) pattern = 'active';
    else if (avgDaysBetween < 90) pattern = 'moderate';
    else pattern = 'low-activity';

    return {
      pattern,
      avgDaysBetweenCommits: Math.round(avgDaysBetween),
      recentCommits: commits.length
    };
  }

  analyzeContributorDiversity(contributors) {
    if (!contributors || contributors.length === 0) {
      return { diversity: 'no-data', topContributorDominance: 0 };
    }

    const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
    const topContributorPercent = contributors.length > 0 
      ? (contributors[0].contributions / totalContributions) * 100 
      : 0;

    let diversity = 'balanced';
    if (topContributorPercent > 80) diversity = 'single-maintainer';
    else if (topContributorPercent > 60) diversity = 'few-maintainers';
    else if (topContributorPercent > 40) diversity = 'core-team';
    
    return {
      diversity,
      topContributorDominance: Math.round(topContributorPercent),
      totalContributors: contributors.length
    };
  }

  generateCodebaseInsights(repo) {
    const insights = [];
    
    if (repo.size > 10000) insights.push('Large codebase - consider modularization');
    if (repo.open_issues_count > repo.stargazers_count * 0.1) {
      insights.push('High issue-to-star ratio - may need attention');
    }
    if (repo.forks_count > repo.stargazers_count * 0.3) {
      insights.push('High fork ratio - active development community');
    }
    if (!repo.license) insights.push('No license specified - consider adding one');
    
    return insights.length > 0 ? insights : ['Well-maintained repository'];
  }

  generateRecommendations(repo, contributors, commits) {
    const recommendations = [];
    
    const lastUpdate = new Date(repo.updated_at);
    const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate > 90) {
      recommendations.push('Consider more frequent updates to maintain community engagement');
    }
    
    if (contributors.length < 3) {
      recommendations.push('Encourage more contributors to improve project sustainability');
    }
    
    if (!repo.has_wiki && repo.stargazers_count > 100) {
      recommendations.push('Add documentation wiki for better user experience');
    }
    
    if (repo.open_issues_count > 50) {
      recommendations.push('Address open issues to improve project health');
    }

    return recommendations.length > 0 ? recommendations : ['Project appears well-maintained'];
  }
}

// Enhanced GitHub API service with analytics
class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Analyzer-MCP-App'
    };
    
    // Add token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    this.mcpAnalytics = new MCPAnalytics();
  }

  // Parse GitHub URL to extract owner and repo
  parseGitHubUrl(url) {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  }

  // Get basic repository information
  async getRepoInfo(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: this.headers,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Repository not found or is private');
      }
      if (error.response?.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - GitHub API is slow');
      }
      throw new Error('Failed to fetch repository information');
    }
  }

  // Get contributors information
  async getContributors(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/contributors`, {
        headers: this.headers,
        params: { per_page: 10 },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch contributors:', error.message);
      return [];
    }
  }

  // Get commit activity stats (52 weeks)
  async getCommitActivity(owner, repo) {
    try {
      console.log(`Fetching commit activity for ${owner}/${repo}`);
      const url = `${this.baseURL}/repos/${owner}/${repo}/stats/commit_activity`;
      console.log('GitHub API URL:', url);
      
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 30000 // Even longer timeout as this endpoint can be very slow
      });
      
      console.log('GitHub API Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      if (!response.data) {
        console.log('No commit activity data received');
        return [];
      }
      
      console.log('Raw commit activity data:', JSON.stringify(response.data, null, 2));
      
      console.log(`Received ${response.data.length} weeks of commit activity`);
      
      // Process the data to ensure it has the expected format
      const now = Math.floor(Date.now() / 1000);
      const weekInSeconds = 604800;
      
      return response.data.map((week, index, arr) => {
        // Ensure we have a valid week object
        if (!week || typeof week !== 'object') {
          console.warn('Invalid week data:', week);
          return null;
        }
        
        // Calculate the week timestamp if not provided
        const weekTimestamp = week.week || (now - (arr.length - index - 1) * weekInSeconds);
        
        // Ensure we have a total count
        const total = typeof week.total === 'number' ? week.total : 
                     Array.isArray(week.days) ? week.days.reduce((sum, day) => sum + (day || 0), 0) : 0;
        
        return {
          week: weekTimestamp,
          total: total,
          days: Array.isArray(week.days) ? week.days : [0, 0, 0, 0, 0, 0, 0]
        };
      }).filter(Boolean); // Remove any null entries
      
    } catch (error) {
      console.warn('Failed to fetch commit activity:', error.message);
      if (error.response) {
        console.warn('Response status:', error.response.status);
        console.warn('Response data:', error.response.data);
      }
      return [];
    }
  }

  // Get recent commits with enhanced data
  async getRecentCommits(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/commits`, {
        headers: this.headers,
        params: { per_page: 20 }, // Get more for better analytics
        timeout: 10000
      });
      return response.data;
    } catch (error) {
  }
  throw new Error('Failed to fetch repository information');
}

// Get contributors information
async getContributors(owner, repo) {
  try {
    const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/contributors`, {
      headers: this.headers,
      params: { per_page: 10 },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch contributors:', error.message);
    return [];
  }
  }

  // Get repository languages
  async getLanguages(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/languages`, {
        headers: this.headers,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch languages:', error.message);
      return {};
    }
  }

  // Get repository releases
  async getReleases(owner, repo) {
    try {
      const response = await axios.get(`${this.baseURL}/repos/${owner}/${repo}/releases`, {
        headers: this.headers,
        params: { per_page: 5 },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch releases:', error.message);
      return [];
    }
  }

  // Enhanced commit frequency analysis
  analyzeCommitFrequency(commits) {
    if (!commits || commits.length === 0) return null;

    const commitsByDate = {};
    const commitsByAuthor = {};
    const commitsByHour = new Array(24).fill(0);

    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date);
      const dateKey = date.toISOString().split('T')[0];
      const hour = date.getHours();
      const author = commit.commit.author.name;

      // Count by date
      commitsByDate[dateKey] = (commitsByDate[dateKey] || 0) + 1;
      
      // Count by author
      commitsByAuthor[author] = (commitsByAuthor[author] || 0) + 1;
      
      // Count by hour
      commitsByHour[hour]++;
    });

    // Find most active day and hour
    const mostActiveDay = Object.entries(commitsByDate)
      .sort(([,a], [,b]) => b - a)[0];
    
    const mostActiveHour = commitsByHour
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)[0];

    return {
      totalCommits: commits.length,
      commitsByDate,
      commitsByAuthor,
      commitsByHour,
      mostActiveDay: mostActiveDay ? { date: mostActiveDay[0], commits: mostActiveDay[1] } : null,
      mostActiveHour: mostActiveHour.count > 0 ? mostActiveHour : null,
      avgCommitsPerDay: commits.length / Math.max(1, Object.keys(commitsByDate).length)
    };
  }
}

const githubService = new GitHubService();

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    mcp: 'enabled'
  });
});

// Enhanced analysis endpoint with MCP integration
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }

    console.log('Analyzing GitHub URL with MCP:', url);
    
    // Parse the URL
    const { owner, repo } = githubService.parseGitHubUrl(url);
    console.log('Parsed:', { owner, repo });
    
    // Fetch all data concurrently
    const [repoInfo, contributors, recentCommits, commitActivity, languages, releases] = await Promise.allSettled([
      githubService.getRepoInfo(owner, repo),
      githubService.getContributors(owner, repo),
      githubService.getRecentCommits(owner, repo),
      githubService.getCommitActivity(owner, repo),
      githubService.getLanguages(owner, repo),
      githubService.getReleases(owner, repo)
    ]);

    // Handle the main repo info (this must succeed)
    if (repoInfo.status === 'rejected') {
      return res.status(400).json({ error: repoInfo.reason.message });
    }

    const repoData = repoInfo.value;
    const contributorsData = contributors.status === 'fulfilled' ? contributors.value : [];
    const commitsData = recentCommits.status === 'fulfilled' ? recentCommits.value : [];
    const activityData = commitActivity.status === 'fulfilled' ? commitActivity.value : [];
    const languagesData = languages.status === 'fulfilled' ? languages.value : {};
    const releasesData = releases.status === 'fulfilled' ? releases.value : [];

    // Generate commit frequency analysis
    const commitAnalysis = githubService.analyzeCommitFrequency(commitsData);

    // MCP Analytics integration
    const mcpAnalysis = await githubService.mcpAnalytics.analyzeRepoContext(
      repoData, 
      contributorsData, 
      commitsData
    );

    // Generate AI analysis
    const aiAnalysis = await cohereService.generateAnalysis(repoData);

    // Format the enhanced response
    const analysisData = {
      repository: {
        name: repoData.name,
        fullName: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        language: repoData.language,
        size: repoData.size,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        htmlUrl: repoData.html_url,
        openIssues: repoData.open_issues_count,
        license: repoData.license?.name || 'No license',
        defaultBranch: repoData.default_branch,
        isPrivate: repoData.private,
        hasWiki: repoData.has_wiki,
        hasPages: repoData.has_pages
      },
      contributors: contributorsData.map(contributor => ({
        login: contributor.login,
        contributions: contributor.contributions,
        avatarUrl: contributor.avatar_url,
        htmlUrl: contributor.html_url
      })),
      recentCommits: commitsData.slice(0, 10).map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split('\n')[0],
        author: commit.commit.author.name,
        date: commit.commit.author.date,
        htmlUrl: commit.html_url
      })),
      languages: languagesData,
      releases: releasesData.slice(0, 3).map(release => ({
        name: release.name,
        tagName: release.tag_name,
        publishedAt: release.published_at,
        htmlUrl: release.html_url
      })),
      analytics: {
        commitFrequency: commitAnalysis,
        commitActivity: activityData,
        mcpInsights: mcpAnalysis
      },
      aiInsights: {
        summary: aiAnalysis,
        generatedAt: new Date().toISOString()
      },
      analyzedAt: new Date().toISOString()
    };

    res.json(analysisData);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
});

// Rate limit info endpoint
app.get('/api/rate-limit', async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/rate_limit', {
      headers: githubService.headers
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate limit info' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enhanced GitHub Analyzer with MCP running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 MCP Analytics: Enabled`);
  console.log(`📊 Advanced Analytics: Enabled`);
});