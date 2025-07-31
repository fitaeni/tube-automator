export const YOUTUBE_CATEGORIES = [
  'People & Blogs',
  'Music', 
  'Gaming',
  'Entertainment',
  'Howto & Style',
  'Science & Technology',
] as const;

export const FILE_TYPES = {
  VIDEO: {
    extensions: ['.mp4', '.mov', '.mkv'],
    mimeTypes: ['video/mp4', 'video/mov', 'video/mkv'],
    icon: 'Video',
    color: 'text-blue-500',
  },
  AUDIO: {
    extensions: ['.mp3', '.wav', '.m4a'],
    mimeTypes: ['audio/mp3', 'audio/wav', 'audio/m4a'],
    icon: 'Music',
    color: 'text-green-500',
  },
  THUMBNAIL: {
    extensions: ['.png', '.jpg', '.jpeg'],
    mimeTypes: ['image/png', 'image/jpg', 'image/jpeg'],
    icon: 'Image',
    color: 'text-purple-500',
  },
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  GET_PROFILE: '/get_profile',
  SAVE_PROFILE: '/save_profile',
  ADD_PROFILE: '/add_profile',
  DELETE_PROFILE: '/delete_profile',
  LIST_FILES: '/list_files',
  UPLOAD_FILE: '/upload_file',
  DELETE_FILE: '/delete_file',
  GET_TEXT_FILE: '/get_text_file',
  SAVE_TEXT_FILE: '/save_text_file',
  AUTH_START: '/auth',
  AUTH_CALLBACK: '/callback',
} as const;