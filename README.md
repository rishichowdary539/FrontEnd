# Smart Expense Tracker - Frontend

React-based frontend application for the Smart Expense Tracker system.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create production build
npm run build

# The build folder contains the optimized production build
```

## 📁 Project Structure

```
FrontEnd/
├── public/              # Static files
│   ├── index.html       # HTML template
│   ├── manifest.json    # PWA manifest
│   └── robots.txt       # SEO robots file
├── src/                 # Source code
│   ├── components/      # Reusable components
│   │   ├── NavBar.jsx
│   │   ├── ExpenseChart.jsx
│   │   └── StatCards.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddExpense.jsx
│   │   └── Report.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies
└── .env.example        # Environment variables template
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

**For Production:**
```env
REACT_APP_API_BASE_URL=https://uunr59c9a3.execute-api.eu-west-1.amazonaws.com/prod/api
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 📦 Dependencies

### Core
- **React** 18.3.1 - UI library
- **React Router DOM** 6.23.1 - Routing
- **Axios** 1.7.2 - HTTP client

### UI & Visualization
- **Material-UI (MUI)** 6.0.0 - UI components
- **Recharts** 2.9.0 - Charts and graphs
- **date-fns** 3.6.0 - Date utilities

## 🔐 Authentication

The app uses JWT token-based authentication:
- Tokens are stored in `localStorage`
- Protected routes require authentication
- Token is automatically included in API requests

## 🌐 API Integration

All API calls are configured in `src/services/api.js`:
- Base URL from environment variable
- Automatic JWT token injection
- Error handling

## 📱 Features

- ✅ User authentication (Login/Register)
- ✅ Expense management (Add, View, Edit, Delete)
- ✅ Monthly expense tracking
- ✅ Category-based organization
- ✅ Dashboard with analytics
- ✅ Visual charts (Pie charts)
- ✅ Monthly reports (PDF/CSV download)
- ✅ Spending insights and alerts

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy to Static Hosting

The `build/` folder can be deployed to:
- AWS S3 + CloudFront
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 🔧 Development

### Proxy Configuration

For development, the app uses a proxy to the backend:
- Configured in `package.json`: `"proxy": "http://localhost:8000"`
- Only works in development mode (`npm start`)

### API Base URL

The backend URL is configured via:
1. Environment variable: `REACT_APP_API_BASE_URL`
2. Fallback: `http://localhost:8000/api`

## 📝 Notes

- This is a Create React App project
- Uses React Router for client-side routing
- Material-UI is installed but currently using custom CSS
- All API endpoints require `/api` prefix

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Private project - All rights reserved
