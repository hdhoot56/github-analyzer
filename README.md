# GitHub Repository Analyzer

> A comprehensive GitHub repository analysis tool built with Windsurf AI IDE, providing insights into repository metrics, contributors, and commit activity.

## 🚀 Features

- **Repository Analysis**: Comprehensive GitHub repo insights
- **Contributor Data**: Top contributors with avatars and commit counts  
- **Recent Activity**: Latest commits with author information
- **Modern UI**: Windsurf-inspired dark theme with responsive design
- **Error Handling**: Graceful handling of rate limits and invalid repositories
- **Docker Ready**: Production-ready containerized deployment

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **GitHub REST API** integration
- **Axios** for HTTP requests
- **CORS** enabled for cross-origin requests

### Frontend  
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Responsive Design** for all devices

### DevOps
- **Docker** & Docker Compose
- **Nginx** for production serving
- **Health checks** and restart policies

## 📁 Project Structure

```
github-analyzer/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── app.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        └── App.jsx
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for development mode)

### Development with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-analyzer.git
   cd github-analyzer
   ```

2. **Start the development environment**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Backend Health Check: http://localhost:5000/health
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Development Mode

```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
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

- Built with [Windsurf AI IDE](https://windsurf.ai)
- GitHub REST API for data
- React and Node.js communities
- Docker for containerization

---

**Demo Video**: [Link to Loom Recording]  
**Windsurf Project**: [Link to Windsurf Share]