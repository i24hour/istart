# iStart - AI-Powered Project Tracker 🚀

An intelligent project tracking application with 3D visualization and AI-powered progress scoring using Google Gemini AI.

## ✨ Features

- 📊 **Multi-Project Tracking** - Manage multiple projects simultaneously
- 🤖 **AI-Powered Scoring** - Get intelligent daily work evaluations (0-20 points/day)
- 🎨 **3D Water Bucket Visualization** - Beautiful Three.js animated progress indicator
- 📅 **Timeline View** - Visual representation of all logged work
- ✅ **Milestone Tracking** - Create and track project milestones
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🗄️ **MongoDB Atlas Storage** - Cloud-based data persistence
- 📈 **Status Tracking** - Real-time project status (On Track / Behind Schedule)

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **AI**: Google Gemini API
- **Backend**: Express.js + Node.js
- **Database**: MongoDB Atlas
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/i24hour/istart.git
cd istart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
MONGODB_URI="your-mongodb-connection-string"
VITE_API_URL=http://localhost:3001
```

4. **Start the development servers**

Run both frontend and backend:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

5. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔑 Configuration

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Enter it in the app's Settings page

### MongoDB Atlas Setup

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to your `.env` file

## 📝 Usage

1. **Create a Project** - Click "Create New Project" and fill in details
2. **Add Milestones** - Define key deliverables for your project
3. **Set Deadline** - Specify how many days you have to complete the project
4. **Log Daily Work** - Describe what you accomplished each day
5. **Get AI Feedback** - Receive intelligent scoring and suggestions
6. **Track Progress** - Watch the 3D water bucket fill as you progress

## 🏗️ Project Structure

```
istart/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── ProjectSetup.jsx
│   │   ├── ProjectTracking.jsx
│   │   ├── WaterBucketScene.jsx
│   │   └── ...
│   ├── utils/              # Utility functions
│   │   ├── geminiApi.js    # AI integration
│   │   ├── storageApi.js   # MongoDB API calls
│   │   └── helpers.js      # Helper functions
│   └── App.jsx             # Main app component
├── server/                 # Backend API
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── db.js              # Database connection
│   └── index.js           # Express server
├── public/                # Static assets
└── package.json

```

## 🌐 Deployment

The app is deployed on Vercel. To deploy your own instance:

```bash
vercel --prod
```

Set environment variables in Vercel dashboard:
- `MONGODB_URI` - Your MongoDB connection string

## 📊 API Endpoints

- `GET /api/projects/:userId` - Get all projects
- `POST /api/projects/:userId` - Create a project
- `PUT /api/projects/:userId/:projectId` - Update a project
- `DELETE /api/projects/:userId/:projectId` - Delete a project
- `GET /api/logs/:userId/:projectId` - Get project logs
- `POST /api/logs/:userId/:projectId` - Create a log entry
- `GET /api/users/:userId` - Get user settings
- `PUT /api/users/:userId` - Update user settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent scoring
- Three.js for 3D visualization
- MongoDB Atlas for cloud database
- Vercel for hosting

---

Made with ❤️ by [i24hour](https://github.com/i24hour)
