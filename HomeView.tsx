import React from 'react';
import { View } from '../types';
import FeatureCard from '../components/FeatureCard';

interface HomeViewProps {
  navigate: (view: View) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const features = [
    {
      title: 'تعديل صورة بالذكاء',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
      view: View.ImageEdit,
    },
    {
        title: 'حلل صورة',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
        view: View.ImageAnalyze,
    },
    {
        title: 'توليد الصور',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c.407-.917.968-1.784 1.63-2.585m11.246 0c.662.801 1.223 1.668 1.63 2.585a7.5 7.5 0 0 1-7.5 0m-4.5-4.5a3.75 3.75 0 0 0-7.5 0m15 0a3.75 3.75 0 0 0-7.5 0m-3.75 0h7.5m-7.5 3H12M12 3v1.5m0 0h-3.75M12 4.5h3.75m0 0a3.75 3.75 0 1 1-7.5 0m7.5 0a3.75 3.75 0 1 0-7.5 0" /></svg>,
        view: View.ImageGenerate,
    },
    {
        title: 'إنشاء فيديو',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>,
        view: View.VideoGenerate,
    }
  ];

  return (
    <div className="text-center">
        <h2 className="text-3xl font-bold text-deep-blue mb-2">لوحك الإبداعي</h2>
        <p className="text-sumerian-clay mb-8">اختر أداة لتبدأ رحلتك مع الذكاء الاصطناعي</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature) => (
                <FeatureCard
                key={feature.title}
                title={feature.title}
                icon={feature.icon}
                onClick={() => navigate(feature.view)}
                />
            ))}
        </div>
    </div>
  );
};

export default HomeView;
