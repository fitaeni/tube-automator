# Zombload Web Panel - YouTube Upload Automation

A comprehensive React frontend for the Zombload YouTube upload automation system. This application provides a professional interface for managing YouTube upload profiles, scheduling content, monitoring system status, and real-time logging.

## Features

### 🚀 Profile Management
- Create and manage multiple YouTube automation profiles
- Google OAuth2 authentication for YouTube API
- Configurable upload schedules and monetization settings
- Support for multiple YouTube categories

### 📁 File Management
- Drag & drop file uploads for videos, audio, and thumbnails
- Support for multiple file formats (MP4, MOV, MKV, MP3, WAV, M4A, PNG, JPG)
- Real-time file listing and deletion
- Organized folder structure per profile

### ✍️ Content Management
- Built-in text editors for video titles and descriptions
- Spintax support for randomized content ({option1|option2|option3})
- Sequential title consumption for automated uploads
- Random description selection

### 📊 Real-time Monitoring
- Live system logs via WebSocket connection
- CPU and RAM usage monitoring
- Scheduler status and control
- Connection status indicators

### 🎯 Automation Features
- Configurable upload schedules with multiple time slots
- Automatic video processing with FFmpeg integration
- Thumbnail and monetization management
- Sequential workflow execution

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui component library
- **Real-time**: Socket.IO client
- **HTTP Client**: Axios
- **File Uploads**: React Dropzone
- **State Management**: React Context + useState
- **Build Tool**: Vite

## Getting Started

### Prerequisites

Make sure you have the Zombload Python backend running on `http://localhost:5000`. The backend provides:
- Flask web server with Socket.IO
- Google YouTube API integration
- FFmpeg video processing
- File management endpoints
- Authentication system

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:8080`

### Default Login
- Username: `admin`
- Password: `admin`

Configure via environment variables:
- `ZOMBLOAD_USER`: Custom username
- `ZOMBLOAD_PASS`: Custom password

## Backend Integration

The frontend communicates with the Python Flask backend via:

### REST API Endpoints
- `/login` - User authentication
- `/get_profile/<name>` - Profile data retrieval
- `/save_profile` - Profile configuration updates
- `/add_profile` - New profile creation
- `/delete_profile` - Profile deletion
- `/upload_file` - File uploads
- `/delete_file` - File deletion
- `/list_files/<profile>` - File listing
- `/get_text_file/<profile>/<type>` - Text content retrieval
- `/save_text_file` - Text content updates
- `/auth/<profile>` - Google OAuth initiation

### WebSocket Events
- `connect/disconnect` - Connection status
- `scheduler_status` - Scheduler state updates
- `new_log` - Real-time log messages
- `system_stats` - CPU/RAM monitoring
- `start_scheduler/stop_scheduler` - Scheduler control

## Usage Guide

### 1. Initial Setup
1. Login with admin credentials
2. Create your first profile with a descriptive name
3. Upload Google OAuth2 client secret JSON file
4. Complete Google authentication for YouTube API access

### 2. Profile Configuration
- Set number of audio/video files to combine
- Choose YouTube category
- Configure start time and schedule slots
- Set folder paths for different file types
- Enable monetization if desired

### 3. Content Management
- Upload videos, audio, and thumbnail files
- Create title lists (one per line, supports spintax)
- Write descriptions (one per line, random selection)
- Use spintax syntax: `{option1|option2|option3}`

### 4. Automation
- Start the global scheduler
- Monitor real-time logs for upload progress
- Check system resources and connection status
- Manage multiple profiles simultaneously

## Design System

The application features a dark-themed design with:
- Primary color: Green (`hsl(142 86% 28%)`)
- Background: Dark blue-gray (`hsl(222 84% 4.9%)`)
- Cards: Elevated dark surfaces with subtle borders
- Success/Error states with appropriate color coding
- Responsive design for desktop and mobile

## File Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── LoginForm.tsx    # Authentication
│   ├── ProfileList.tsx  # Profile management
│   ├── ProfileEditor.tsx # Profile configuration
│   ├── FileManager.tsx  # File upload/management
│   ├── TextEditor.tsx   # Title/description editing
│   ├── LogViewer.tsx    # Real-time logs
│   └── Header.tsx       # Navigation header
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   └── SocketContext.tsx # WebSocket connection
├── lib/                 # Utilities
│   ├── api.ts          # API client
│   ├── constants.ts    # App constants
│   └── utils.ts        # Utility functions
└── hooks/              # Custom hooks
    └── use-toast.ts    # Toast notifications
```

## API Configuration

The frontend expects the backend to be running on `http://localhost:5000`. To change this, update the `baseURL` in `src/lib/api.ts`.

## Error Handling

The application includes comprehensive error handling:
- Network request failures with user-friendly messages
- File upload validation and error reporting
- Authentication state management
- Real-time connection monitoring
- Graceful degradation when backend is unavailable

## Contributing

This frontend is designed to work seamlessly with the Zombload Python backend. When contributing:

1. Maintain TypeScript strict mode compliance
2. Follow the established design system patterns
3. Add appropriate error handling for new features
4. Update API types when backend changes occur
5. Test real-time features with WebSocket connections

## License

This project is part of the Zombload YouTube automation system.