
import { useState, useEffect } from 'react';
import { User, MediaItem, Message, AppState } from './types';
import { STORAGE_KEYS, ADMIN_CREDENTIALS, INITIAL_VIDEOS } from './constants';

const defaultKnowledge = `Little Children Drama Association (L.C.D.A) is a secure and playful entertainment hub for kids.

CORE IDENTITY:
- Founder & Admin: Vishodha.
- Mission: To provide a safe space for drama, theater, and creativity.
- Visual Style: Playful "bento-box" design with pastel colors (Rose, Sky, Amber, Emerald).

APP FEATURES YOU SHOULD KNOW:
1. SECURITY: Access is controlled by Vishodha. Users request access with their name and phone number. The phone number becomes their "Access Key" (password).
2. MEMBER PORTAL: Only approved members can see the library and chat.
3. MULTI-MEDIA LIBRARY: We host Videos (MP4), Photos (Galleries), and Audio (Music with pulse animations).
4. PRIVATE CHAT: Members can send friendly messages to each other and to the Admin (Vishodha).
5. AI FRIEND: That's you! You are powered by Gemini and designed to be a safe, kid-friendly companion.

ADMIN POWERS:
- Vishodha can approve or reject members.
- Vishodha can add or delete any video, photo, or song in the library.
- Vishodha can "program" your brain by updating this knowledge base.

If kids ask how to use the app, tell them to check the Library for fun videos or use the Chat to talk to friends!`;

const defaultState: AppState = {
  currentUser: null,
  users: [
    {
      id: 'admin-1',
      name: ADMIN_CREDENTIALS.name,
      password: ADMIN_CREDENTIALS.password,
      role: 'admin',
      status: 'approved'
    }
  ],
  videos: (INITIAL_VIDEOS as any[]).map(v => ({ ...v, type: 'video' })),
  messages: [],
  aiKnowledge: defaultKnowledge
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_STATE);
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
  }, [state]);

  const login = (name: string, password?: string) => {
    const user = state.users.find(u => u.name === name && u.password === password && u.status === 'approved');
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const requestAccess = (name: string, phone: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      password: phone,
      role: 'viewer',
      status: 'pending'
    };
    setState(prev => ({ ...prev, users: [...prev.users, newUser] }));
  };

  const approveUser = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => 
        u.id === userId ? { ...u, status: 'approved' } : u
      )
    }));
  };

  const rejectUser = (userId: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
  };

  const addMedia = (item: Omit<MediaItem, 'id'>) => {
    const newItem = { ...item, id: `media-${Date.now()}` };
    setState(prev => ({ ...prev, videos: [newItem, ...prev.videos] }));
  };

  const deleteVideo = (id: string) => {
    setState(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }));
  };

  const sendMessage = (text: string, toId: string) => {
    if (!state.currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromId: state.currentUser.id,
      toId,
      text,
      timestamp: Date.now()
    };
    setState(prev => ({ ...prev, messages: [...prev.messages, newMessage] }));
  };

  const updateAIKnowledge = (text: string) => {
    setState(prev => ({ ...prev, aiKnowledge: text }));
  };

  return {
    ...state,
    login,
    logout,
    requestAccess,
    approveUser,
    rejectUser,
    addMedia,
    deleteVideo,
    sendMessage,
    updateAIKnowledge
  };
}
