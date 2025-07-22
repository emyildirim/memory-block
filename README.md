# Memory Blocks

A full-stack memory listing website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, search functionality, and CSV export capabilities.

## 🚀 Features

- **Authentication**: Secure JWT-based authentication with user registration and login
- **Memory Management**: Create, read, update, and delete memories with title, context, tag, and detail fields
- **Search & Filter**: Advanced search functionality across all memory fields with filter options
- **CSV Export**: Export all memories to CSV format for backup or external use
- **Account Management**: User profile with memory count and secure account deletion
- **Responsive Design**: Modern, clean UI built with Tailwind CSS
- **Theme Toggle**: Light and dark mode support with persistent preferences
- **Layout Options**: Choose between classic and compact layouts
- **Mobile Friendly**: Fully responsive design for all screen sizes

## 🛠 Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API communication
- Context API for state management
- Tailwind CSS for styling
- SweetAlert2 for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Custom CSV export functionality
- CORS and Helmet for security

## 📁 Project Structure

```
memory-blocks/
├── client/                 # React frontend
│   ├── public/             # Public assets
│   │   ├── logo-light.png  # Light mode logo
│   │   ├── logo-dark.png   # Dark mode logo
│   │   └── background-pattern.jpg  # Login/Register background
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route pages
│       ├── services/       # API services
│       ├── context/        # React context
│       └── assets/         # Static assets
├── server/                 # Express backend
│   ├── controllers/        # Route logic
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   └── utils/              # Utility functions
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd memory-blocks
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (server + client)
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/memory-blocks
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

   **Note**: Replace the values with your actual configuration:
   - For MongoDB Atlas: Use your Atlas connection string
   - For JWT_SECRET: Use a strong, random secret key

4. **Required Assets**

   Place these files in the `public` folder:
   - `logo-light.png` - Logo for light mode
   - `logo-dark.png` - Logo for dark mode
   - `background-pattern.jpg` - Background pattern for login/register pages

### Running the Application

1. **Development Mode** (runs both frontend and backend)
   ```bash
   npm run dev
   ```

2. **Run Backend Only**
   ```bash
   npm run server
   ```

3. **Run Frontend Only**
   ```bash
   npm run client
   ```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Memories
- `GET /api/memories` - Get all memories (with optional search/filter)
- `GET /api/memories/:id` - Get single memory
- `POST /api/memories` - Create new memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `GET /api/memories/export` - Export memories as CSV

### User
- `GET /api/user/profile` - Get user profile with memory count
- `DELETE /api/user/account` - Delete user account and all memories

## 🎨 UI Features

### Theme Toggle
- Switch between light and dark modes
- Theme preference is saved in localStorage
- Automatic theme application on page load

### Layout Options
- **Classic Layout**: Traditional view with search bar at the top
- **Compact Layout**: Modern view with integrated search and add button

### Responsive Design
- Fully responsive for mobile, tablet, and desktop
- Mobile-optimized navigation
- Adaptive layout for different screen sizes

## 🔍 Search & Filter

The search functionality supports:
- **Live Search**: Results update as you type (with debouncing)
- **Filter Options**: All Fields, Title Only, Context Only, Tag Only
- **Persistent Query**: Search string is preserved between sessions

## 📊 CSV Export

Export your memories to CSV format from the Settings page. The CSV includes:
- Title
- Context
- Tag
- Detail
- Creation Date

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS and security headers
- Secure token storage

## 📱 Mobile Features

- Bottom navigation for easy access
- Optimized touch targets
- Responsive memory cards
- Mobile-friendly forms and modals

## 🚀 Deployment

### Backend Deployment (Render/Railway/Vercel Functions)
1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Update the MongoDB URI to your production database

### Frontend Deployment (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `client/dist` directory
3. Update API base URL in production

## 📖 Usage

1. **Register/Login**: Create an account or sign in
2. **Dashboard**: View all your memories, create new ones, or search existing ones
3. **Memory Management**: 
   - Click "Add Memory" to create a new memory
   - Click the edit icon on any memory card to modify it
   - Click the delete icon to remove a memory (with confirmation)
4. **Search**: Use the search bar or "Search & Filter" to find specific memories
5. **Settings**: Access user profile, export data, or delete account
6. **Theme**: Toggle between light and dark modes using the icon in the header
7. **Layout**: Switch between classic and compact layouts using the layout toggle

## ⚠️ Important Notes

- **Data Security**: Always use strong JWT secrets in production
- **Database Backup**: Regularly backup your MongoDB data
- **Environment Variables**: Never commit `.env` files to version control
- **Account Deletion**: Account deletion is permanent and cannot be undone

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in `.env`
   - For Atlas: Verify network access and credentials

2. **JWT Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear localStorage if needed

3. **Port Conflicts**
   - Frontend runs on port 3000
   - Backend runs on port 5001
   - Change ports in configuration if needed

For more help, please open an issue in the repository.
