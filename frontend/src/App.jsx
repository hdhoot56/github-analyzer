import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const analyzeRepository = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, { url });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || '0';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getActivityBadgeColor = (pattern) => {
    const colors = {
      'very-active': 'bg-green-500',
      'active': 'bg-blue-500',
      'moderate': 'bg-yellow-500',
      'low-activity': 'bg-red-500',
      'sporadic': 'bg-gray-500'
    };
    return colors[pattern] || 'bg-gray-500';
  };

  const renderCommitChart = (commitActivity) => {
    if (!commitActivity || commitActivity.length === 0) return null;

    const maxCommits = Math.max(...commitActivity.map(week => week.total));
    
    return (
      <div className="flex items-end space-x-1 h-20">
        {commitActivity.slice(-26).map((week, index) => (
          <div
            key={index}
            className="bg-primary opacity-60 hover:opacity-100 transition-opacity"
            style={{
              height: `${(week.total / maxCommits) * 100}%`,
              width: '8px',
              minHeight: week.total > 0 ? '2px' : '1px'
            }}
            title={`Week ${index + 1}: ${week.total} commits`}
          />
        ))}
      </div>
    );
  };

  const renderLanguageChart = (languages) => {
    if (!languages || Object.keys(languages).length === 0) return null;

    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const languageData = Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        percentage: (bytes / total) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

    return (
      <div className="space-y-3">
        {languageData.map((lang, index) => (
          <div key={lang.name} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${colors[index]}`}></div>
            <span className="text-white text-sm flex-1">{lang.name}</span>
            <span className="text-gray-400 text-sm">{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-dark-lighter bg-dark-light">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">GitHub Analyzer Pro</h1>
                <p className="text-sm text-gray-400">Advanced analytics with MCP integration</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Powered by Windsurf
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-dark-light rounded-full text-sm text-gray-300 mb-8 border border-dark-lighter">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            Advanced GitHub Repository Analytics
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Analyze GitHub<br />
            <span className="text-primary">Repositories</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get comprehensive insights with commit frequency analysis, contributor patterns, 
            project health metrics, and AI-powered recommendations.
          </p>

          {/* Input Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={analyzeRepository} className="relative">
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-6 py-4 bg-dark-light border border-dark-lighter rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-32"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Analyze Repository'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Repository Overview */}
            <div className="bg-dark-light border border-dark-lighter rounded-xl p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{data.repository.fullName}</h2>
                      <p className="text-gray-400">{data.repository.description || 'No description available'}</p>
                    </div>
                  </div>
                  
                  <a
                    href={data.repository.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>View on GitHub</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="bg-dark rounded-xl p-6 border border-dark-lighter">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Stars</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatNumber(data.repository.stars)}</div>
                </div>

                <div className="bg-dark rounded-xl p-6 border border-dark-lighter">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Forks</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatNumber(data.repository.forks)}</div>
                </div>

                <div className="bg-dark rounded-xl p-6 border border-dark-lighter">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Issues</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{formatNumber(data.repository.openIssues)}</div>
                </div>

                <div className="bg-dark rounded-xl p-6 border border-dark-lighter">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Language</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{data.repository.language || 'N/A'}</div>
                </div>

                {/* Project Health Score */}
                <div className="bg-dark rounded-xl p-6 border border-dark-lighter">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Health</span>
                  </div>
                  <div className={`text-2xl font-bold ${getHealthColor(data.analytics?.mcpInsights?.projectHealth || 0)}`}>
                    {data.analytics?.mcpInsights?.projectHealth || 'N/A'}
                    {data.analytics?.mcpInsights?.projectHealth && '/100'}
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Analytics Insights */}
            {data.analytics?.mcpInsights && (
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  MCP AI Insights
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Activity Pattern */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Activity Pattern</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getActivityBadgeColor(data.analytics.mcpInsights.activityPattern.pattern)}`}>
                        {data.analytics.mcpInsights.activityPattern.pattern.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        Avg {data.analytics.mcpInsights.activityPattern.avgDaysBetweenCommits} days between commits
                      </span>
                    </div>
                  </div>

                  {/* Contributor Diversity */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Team Structure</h4>
                    <div className="flex items-center space-x-3">
                      <span className="text-primary font-medium">
                        {data.analytics.mcpInsights.contributorDiversity.diversity.replace('-', ' ')}
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({data.analytics.mcpInsights.contributorDiversity.totalContributors} contributors)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">AI Recommendations</h4>
                  <div className="space-y-2">
                    {data.analytics.mcpInsights.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-dark rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Codebase Insights */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Codebase Insights</h4>
                  <div className="space-y-2">
                    {data.analytics.mcpInsights.codebaseInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-dark rounded-lg">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                        <span className="text-gray-300 text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Dashboard */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Commit Activity Chart */}
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Commit Activity (26 weeks)</h3>
                {renderCommitChart(data?.analytics?.commitActivity || [])}
                <p className="text-gray-400 text-sm mt-4">
                  Weekly commit frequency over the last 6 months
                </p>
              </div>

              {/* Language Distribution */}
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Language Distribution</h3>
                {renderLanguageChart(data.languages)}
              </div>
            </div>

            {/* Commit Frequency Analysis */}
            {data.analytics?.commitFrequency && (
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Commit Frequency Analysis</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {data.analytics.commitFrequency.totalCommits}
                    </div>
                    <div className="text-gray-400 text-sm">Total Commits Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {data.analytics.commitFrequency.avgCommitsPerDay.toFixed(1)}
                    </div>
                    <div className="text-gray-400 text-sm">Avg Commits Per Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {data.analytics.commitFrequency.mostActiveHour?.hour || 'N/A'}
                    </div>
                    <div className="text-gray-400 text-sm">Most Active Hour</div>
                  </div>
                </div>

                {data.analytics.commitFrequency.mostActiveDay && (
                  <div className="mt-6 p-4 bg-dark rounded-lg">
                    <div className="text-white font-medium">Most Active Day</div>
                    <div className="text-gray-400 text-sm">
                      {formatDate(data.analytics.commitFrequency.mostActiveDay.date)} - 
                      {data.analytics.commitFrequency.mostActiveDay.commits} commits
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contributors, Commits, and Releases */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contributors */}
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Top Contributors</h3>
                {data.contributors && data.contributors.length > 0 ? (
                  <div className="space-y-4">
                    {data.contributors.map((contributor, index) => (
                      <div key={contributor.login} className="flex items-center space-x-4">
                        <img
                          src={contributor.avatarUrl}
                          alt={contributor.login}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <a
                              href={contributor.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-primary transition-colors"
                            >
                              {contributor.login}
                            </a>
                            <span className="text-sm text-gray-400">
                              {contributor.contributions}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No contributor data available</p>
                )}
              </div>

              {/* Recent Commits */}
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Commits</h3>
                {data.recentCommits && data.recentCommits.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentCommits.slice(0, 5).map((commit, index) => (
                      <div key={commit.sha} className="border-l-2 border-primary/30 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-white text-sm mb-1 line-clamp-2">
                              {commit.message}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-400">
                              <span>{commit.author}</span>
                              <span>•</span>
                              <span>{formatDate(commit.date)}</span>
                              <a
                                href={commit.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                {commit.sha}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No recent commits available</p>
                )}
              </div>

              {/* Recent Releases */}
              <div className="bg-dark-light border border-dark-lighter rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Recent Releases</h3>
                {data.releases && data.releases.length > 0 ? (
                  <div className="space-y-4">
                    {data.releases.map((release, index) => (
                      <div key={release.tagName} className="border-l-2 border-green-500/30 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <a
                              href={release.htmlUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-primary transition-colors font-medium"
                            >
                              {release.name || release.tagName}
                            </a>
                            <div className="text-xs text-gray-400 mt-1">
                              Released {formatDate(release.publishedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No releases found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;