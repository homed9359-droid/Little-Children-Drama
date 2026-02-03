
import React, { useState } from 'react';
import { useAppStore } from './store';
import Auth from './components/Auth';
import AdminPortal from './components/AdminPortal';
import ViewerDashboard from './components/ViewerDashboard';
import Logo from './components/Logo';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const store = useAppStore();

  if (!store.currentUser) {
    return <Auth login={store.login} requestAccess={store.requestAccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-rose-50 to-amber-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-sky-100 shadow-sm">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-sm font-bold text-sky-800">
               Hi, {store.currentUser.name}!
             </span>
          </div>
          <button 
            onClick={store.logout}
            className="p-2.5 text-rose-400 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all active:scale-90 border border-transparent hover:border-rose-100 shadow-sm bg-white"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 max-w-7xl mx-auto w-full">
        <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] p-2 md:p-6 min-h-full border border-white/60 shadow-xl shadow-sky-900/5">
          {store.currentUser.role === 'admin' ? (
            <AdminPortal store={store} />
          ) : (
            <ViewerDashboard store={store} />
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="py-8 text-center text-xs text-sky-400/60 mt-8">
        <div className="mb-4 flex justify-center opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
          <Logo size="sm" />
        </div>
        <p className="font-medium tracking-wide">
          &copy; {new Date().getFullYear()} <span className="text-rose-400">Little</span> <span className="text-sky-400">Children</span> <span className="text-amber-400">Drama</span> <span className="text-emerald-400">Association</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
