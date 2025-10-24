import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Loading from '../components/Loading';

const ImageGenerateView: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('يرجى كتابة وصف للصورة التي تريد إنشائها.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الصورة. الرجاء المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setPrompt('');
    setGeneratedImage(null);
    setIsLoading(false);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-deep-blue">توليد الصور بالذكاء</h2>
        <p className="text-sumerian-clay">اكتب وصف الصورة التي تتخيلها ودع الذكاء يبدعها.</p>
      </div>
      
      {!generatedImage && !isLoading && (
        <div className="space-y-4">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="امرِ بما تريد: مشهد سومري مستقبلي، امرأة بملابس سومرية، منظر نهري دجلة..."
                className="w-full p-3 border-2 border-old-gold rounded-lg focus:ring-sumerian-clay focus:border-sumerian-clay"
                rows={4}
            />
            <button
                onClick={handleGenerate}
                disabled={!prompt}
                className="w-full bg-deep-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-sumerian-clay transition-colors duration-300 disabled:bg-gray-400"
            >
                ولّد الصورة
            </button>
        </div>
      )}

      {isLoading && <Loading message="يتم رسم تحفتك الفنية..." />}
      
      {error && <p className="text-center text-accent-red mt-4">{error}</p>}

      {generatedImage && (
        <div className="text-center mt-6 space-y-4">
          <h3 className="text-2xl font-bold text-deep-blue">الصورة المولّدة</h3>
          <img src={generatedImage} alt="Generated result" className="max-w-full mx-auto max-h-[60vh] rounded-lg shadow-xl" />
          <div className="flex justify-center gap-4">
            <a
              href={generatedImage}
              download="sumer-iq-generated.jpg"
              className="bg-old-gold text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              تحميل الصورة
            </a>
            <button
              onClick={resetState}
              className="bg-deep-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              إنشاء صورة جديدة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerateView;
