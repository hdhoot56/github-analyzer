# Contributing to GitHub Repository Analyzer

We're excited that you're interested in contributing to our project! Here's how you can help:

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/your-username/github-repo-analyzer.git
   cd github-repo-analyzer
   ```
3. **Install dependencies** for both frontend and backend
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
4. **Create a branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Backend
- Start the development server:
  ```bash
  cd backend
  npm run dev
  ```
- The server will run on `http://localhost:5000`

### Frontend
- Start the development server:
  ```bash
  cd frontend
  npm run dev
  ```
- The app will be available at `http://localhost:3000`

## Making Changes

1. Write clear, concise commit messages
2. Add tests for new features and bug fixes
3. Update documentation as needed
4. Ensure all tests pass

## Submitting a Pull Request

1. Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch
3. Fill out the PR template with all relevant information
4. Request reviews from maintainers

## Code Style

- Follow the existing code style
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following [Conventional Commits](https://www.conventionalcommits.org/)

## Reporting Issues

Found a bug? Please open an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS version if relevant

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
