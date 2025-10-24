
import React, { useState, useCallback } from 'react';
import { View } from './types';
import HomeView from './views/HomeView';
import ImageEditView from './views/ImageEditView';
import ImageAnalyzeView from './views/ImageAnalyzeView';
import ImageGenerateView from './views/ImageGenerateView';
import VideoGenerateView from './views/VideoGenerateView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);

  const navigate = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case View.ImageEdit:
        return <ImageEditView />;
      case View.ImageAnalyze:
        return <ImageAnalyzeView />;
      case View.ImageGenerate:
        return <ImageGenerateView />;
      case View.VideoGenerate:
        return <VideoGenerateView />;
      case View.Home:
      default:
        return <HomeView navigate={navigate} />;
    }
  };
  
  const Header: React.FC = () => (
    <header className="bg-deep-blue text-old-gold p-4 shadow-lg flex items-center justify-center relative">
        <h1 className="text-3xl font-bold font-cairo">سومر IQ</h1>
    </header>
  );

  const Footer: React.FC = () => (
    <footer className="bg-deep-blue text-old-gold p-4 text-center text-sm">
        <p>© os_iraq0 & Moamin Bio — سومر IQ</p>
    </footer>
  );

  const BottomNavBar: React.FC<{ navigate: (view: View) => void, currentView: View }> = ({ navigate, currentView }) => {
    const isHome = currentView === View.Home;
    if (isHome) return null;
    
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-t-lg border-t border-old-gold/20">
            <nav className="flex justify-around items-center p-2">
                 <button onClick={() => navigate(View.Home)} className="flex flex-col items-center text-deep-blue hover:text-sumerian-clay transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="text-xs">الرئيسية</span>
                </button>
            </nav>
        </div>
    );
  };


  return (
    <div className="min-h-screen bg-light-bg font-cairo flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6">
            {renderView()}
        </main>
        {currentView !== View.Home && <div className="pb-16"></div>}
        <BottomNavBar navigate={navigate} currentView={currentView} />
        <Footer />
    </div>
  );
};

export default App;
