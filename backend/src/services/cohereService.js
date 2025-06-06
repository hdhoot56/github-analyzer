const { CohereClient } = require('cohere-ai');

class CohereService {
  constructor() {
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
      console.error('COHERE_API_KEY is not set');
      throw new Error('Cohere API key is not configured');
    }
    
    this.cohere = new CohereClient({
      token: apiKey
    });
    
    console.log('Cohere client initialized');
  }

  async generateAnalysis(repoData) {
    try {
      const prompt = `Analyze this GitHub repository and provide a concise summary (2-3 sentences):
      
Name: ${repoData.name}
Description: ${repoData.description || 'No description'}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
Primary Language: ${repoData.language || 'Not specified'}
Created: ${new Date(repoData.created_at).toLocaleDateString()}
Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}
Open Issues: ${repoData.open_issues_count}
License: ${repoData.license?.name || 'None'}

Analysis:`;

      const response = await this.cohere.generate({
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
        k: 0,
        p: 0.75,
      });

      return response.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return 'AI analysis is currently unavailable.';
    }
  }
}

module.exports = new CohereService();
