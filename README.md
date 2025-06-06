# GitHub Repository Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)

A powerful tool to analyze GitHub repositories, providing detailed insights and AI-powered analysis using GitHub's API and Cohere AI.

## ✨ Features

> **Note**: This project's website layout and architecture were developed using Windsurf AI and the Model Context Protocol (MCP), providing an intelligent and responsive user interface.

- **Repository Analysis**: Get detailed statistics about any public GitHub repository
- **Commit Visualization**: Interactive charts showing commit history and patterns
- **AI-Powered Insights**: Advanced analysis of repository health and activity
- **Contributor Analytics**: Understand contributor patterns and engagement
- **Modern UI**: Clean, responsive interface with dark mode support
- **Docker Support**: Easy deployment with Docker and Docker Compose

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **GitHub REST API** integration
- **Cohere AI** for advanced analysis
- **Axios** for HTTP requests
- **CORS** enabled for cross-origin requests
- **Winston** for logging

### Frontend  
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- **React Icons** for UI elements
- **Responsive Design** for all devices

### DevOps
- **Docker** & Docker Compose
- **Nginx** for production serving
- **Health checks** and restart policies
- **Environment-based configuration**

## 📁 Project Structure

```
github-analyzer/
├── docker-compose.yml            # Docker Compose configuration
├── docker-compose.override.yml   # Development overrides
├── .env.example                 # Example environment variables
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
├── backend/
│   ├── Dockerfile               # Backend Docker configuration
│   ├── package.json             # Backend dependencies
│   └── src/
│       ├── app.js               # Main application entry point
│       └── services/
│           └── cohereService.js  # Cohere AI integration
└── frontend/
    ├── Dockerfile               # Frontend Docker configuration
    ├── nginx.conf                # Nginx configuration for production
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    ├── index.html                # Main HTML entry point
    └── src/
        ├── main.jsx            # React entry point
        ├── App.jsx              # Main React component
        ├── components/          # Reusable UI components
        ├── hooks/               # Custom React hooks
        └── utils/               # Utility functions
```

## 🚀 Quick Start

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose
- [Node.js](https://nodejs.org/) 18+ (for development mode)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/github-analyzer.git
cd github-analyzer
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file and add your:
- GitHub Personal Access Token (with `repo` scope)
- Cohere API Key

### 3. Start with Docker (Recommended)
```bash
# Start the application
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Development Mode (Without Docker)

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Usage

1. **Enter Repository URL**: Input any public GitHub repository URL
2. **Analyze**: Click "Analyze Repository" to fetch data
3. **View Insights**: See repository stats, contributors, and recent commits
4. **Explore**: Click links to view detailed information on GitHub

### Example URLs to Try:
- `https://github.com/microsoft/vscode`
- `https://github.com/facebook/react`
- `https://github.com/nodejs/node`

## 🔧 API Endpoints

### Backend API

#### `POST /api/analyze`
Analyzes a GitHub repository and returns comprehensive data.

**Request Body:**
```json
{
  "url": "https://github.com/owner/repository"
}
```

**Response:**
```json
{
  "repository": {
    "name": "repository-name",
    "fullName": "owner/repository-name",
    "description": "Repository description",
    "stars": 12345,
    "forks": 1234,
    "openIssues": 123,
    "language": "JavaScript",
    "htmlUrl": "https://github.com/owner/repository"
  },
  "contributors": [
    {
      "login": "username",
      "contributions": 100,
      "avatarUrl": "https://avatars.githubusercontent.com/...",
      "htmlUrl": "https://github.com/username"
    }
  ],
  "recentCommits": [
    {
      "sha": "abc1234",
      "message": "Commit message",
      "author": "Author Name",
      "date": "2024-01-01T00:00:00Z",
      "htmlUrl": "https://github.com/owner/repo/commit/abc1234"
    }
  ]
}
```

#### `GET /health`
Health check endpoint for monitoring.

## 🎨 Design Philosophy

### UI/UX Design
- **Dark Theme**: Modern, eye-friendly interface inspired by Windsurf
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages

### Code Architecture
- **Separation of Concerns**: Clear separation between frontend and backend
- **Error Resilience**: Graceful handling of API failures and rate limits
- **Scalable Structure**: Easy to extend with additional features

## ⚡ Performance & Optimization

- **Concurrent API Calls**: Uses `Promise.allSettled` for parallel GitHub API requests
- **Rate Limit Handling**: Intelligent handling of GitHub API rate limits
- **Docker Multi-stage Builds**: Optimized production images
- **Nginx Compression**: Gzip compression for faster loading
- **Health Checks**: Container health monitoring

## 🔒 Security Features

- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: URL validation and sanitization
- **Error Sanitization**: No sensitive information in error responses
- **Security Headers**: Nginx security headers in production

## 🐳 Docker Configuration

### Services
- **Backend**: Node.js API server with health checks
- **Frontend**: Nginx-served React application
- **Networking**: Custom bridge network for inter-service communication

### Features
- Health checks with automatic restarts
- Production-optimized builds
- Volume persistence ready
- Environment variable support

## 🔧 Development with Windsurf

This project was developed using **Windsurf AI IDE**, leveraging AI assistance for:

### Code Generation
- Rapid backend API development
- React component creation
- Docker configuration setup

### Problem Solving
- GitHub API integration patterns
- Error handling strategies
- UI/UX optimization

### Optimization
- Performance improvements
- Code organization
- Best practices implementation

## 📊 Features Implemented

- [x] GitHub repository URL input
- [x] Repository metadata display (stars, forks, issues)
- [x] Top contributors with avatars
- [x] Recent commits with author information
- [x] Rate limiting and error handling
- [x] Responsive Windsurf-style UI
- [x] Docker containerization
- [x] Production nginx setup
- [x] Health checks and monitoring

## 🚀 Future Enhancements

- [ ] Repository language breakdown visualization
- [ ] Commit frequency charts
- [ ] Issue and PR analytics
- [ ] Repository comparison features
- [ ] Export functionality
- [ ] User authentication for higher rate limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Windsurf AI](https://windsurf.ai) and the Model Context Protocol (MCP)
- GitHub REST API for data
- React and Node.js communities
- Docker for containerization

---

**Demo Video**:https://www.loom.com/share/6c8174f34f81471aa396e8d359a02032?sid=1abb6fcf-c51e-4bf9-b2c0-20cc9b3602d8