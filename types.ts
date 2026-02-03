
export type Role = 'admin' | 'viewer';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type MediaType = 'video' | 'image' | 'audio';

export interface User {
  id: string;
  name: string;
  phone?: string;
  password?: string;
  role: Role;
  status: RequestStatus;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  type: MediaType;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: number;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  videos: MediaItem[];
  messages: Message[];
  aiKnowledge: string; // New field for custom AI training data
}
