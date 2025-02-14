# AI Personality Pal

AI Personality Pal is a modern web application that creates personalized AI experiences by integrating with various platforms like Spotify and Letterboxd to understand and adapt to user preferences.

## 🚀 Features

- **Platform Integrations:**
  - Spotify integration for music preferences
  - Letterboxd integration for movie tastes
  - OpenAI-powered personalized interactions

- **Modern Tech Stack:**
  - React frontend with TypeScript
  - Express.js backend
  - Real-time updates with WebSocket
  - Secure authentication and session management
  - Tailwind CSS for styling
  - Drizzle ORM for database operations

## 🛠️ Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- A database (configured with Drizzle)
- API keys for:
  - OpenAI
  - Spotify
  - Other integrated services

## 🏗️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd AIPersonalityPal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with necessary API keys and configuration:
```
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## 🚀 Development

1. Start the development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## 📁 Project Structure

- `/client` - Frontend React application
  - `/src` - Source code for the React application
  
- `/server` - Backend Express.js server
  - `index.ts` - Server entry point
  - `routes.ts` - API routes
  - `spotify.ts` - Spotify integration
  - `letterboxd.ts` - Letterboxd integration
  - `openai.ts` - OpenAI integration
  - `storage.ts` - Data storage utilities
  
- `/shared` - Shared types and utilities

## 🔧 Configuration

The project uses several configuration files:
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Database ORM configuration
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Dependencies

### Main Dependencies
- React and React DOM
- Express.js
- OpenAI API
- Drizzle ORM
- TailwindCSS
- Various Radix UI components
- Zod for validation
- And more (see package.json for complete list)

### Development Dependencies
- TypeScript
- Vite
- ESBuild
- Various type definitions 