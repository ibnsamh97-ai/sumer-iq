import React, { useState, useEffect, useRef } from 'react';
import { generateVideo, fileToBase64 } from '../services/geminiService';
import Loading from '../components/Loading';
import ApiKeySelector from '../components/ApiKeySelector';

const VideoGenerateView: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } catch (e) {
        console.error("aistudio not available, running in dev mode. Assuming key is selected.", e);
        setApiKeySelected(true); // Dev fallback
      }
    };
    checkApiKey();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && !imageFile) {
      setError('يرجى كتابة وصف أو رفع صورة لبدء إنشاء الفيديو.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      let imagePayload: { base64: string, mimeType: string } | undefined = undefined;
      if (imageFile) {
        imagePayload = await fileToBase64(imageFile);
      }
      const result = await generateVideo(prompt, aspectRatio, imagePayload);
      setGeneratedVideo(result);
    } catch (err: any) {
      console.error(err);
      if(err.message?.includes("Requested entity was not found.")){
        setError("فشل التحقق من مفتاح API. يرجى إعادة تحديده.");
        setApiKeySelected(false); // Reset key state
      } else {
        setError('حدث خطأ أثناء إنشاء الفيديو. قد تستغرق العملية وقتاً طويلاً. الرجاء المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setPrompt('');
    setImageFile(null);
    setImagePreview(null);
    setGeneratedVideo(null);
    setIsLoading(false);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  if (apiKeySelected === null) {
    return <Loading message="جاري التحقق من الإعدادات..." />;
  }

  if (!apiKeySelected) {
    return <ApiKeySelector onKeySelected={() => setApiKeySelected(true)} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-deep-blue">إنشاء فيديو بالذكاء</h2>
        <p className="text-sumerian-clay">حوّل أفكارك أو صورك إلى مقاطع فيديو مذهلة.</p>
      </div>

      {!generatedVideo && !isLoading && (
        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="وصف الفيديو: سيارة طائرة في بغداد المستقبلية..."
            className="w-full p-3 border-2 border-old-gold rounded-lg focus:ring-sumerian-clay focus:border-sumerian-clay"
            rows={4}
          />

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="image-upload" className="w-full text-center p-4 border-2 border-old-gold border-dashed rounded-lg cursor-pointer bg-white/50 hover:bg-old-gold/10">
                <p className="font-semibold text-deep-blue">اختر صورة (اختياري)</p>
                <p className="text-xs text-sumerian-clay">لتحريكها أو استخدامها كنقطة بداية</p>
              </label>
              <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} ref={fileInputRef} />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 max-h-32 rounded" />}
            </div>
            
            <div>
                <label className="font-semibold text-deep-blue mb-2 block text-center">نسبة العرض إلى الارتفاع</label>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setAspectRatio('16:9')} className={`py-2 px-4 rounded-lg border-2 ${aspectRatio === '16:9' ? 'bg-deep-blue text-white border-deep-blue' : 'bg-white border-old-gold text-deep-blue'}`}>
                        16:9 (أفقي)
                    </button>
                    <button onClick={() => setAspectRatio('9:16')} className={`py-2 px-4 rounded-lg border-2 ${aspectRatio === '9:16' ? 'bg-deep-blue text-white border-deep-blue' : 'bg-white border-old-gold text-deep-blue'}`}>
                        9:16 (عمودي)
                    </button>
                </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt && !imageFile}
            className="w-full bg-deep-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-sumerian-clay transition-colors duration-300 disabled:bg-gray-400"
          >
            ولّد الفيديو
          </button>
        </div>
      )}

      {isLoading && <Loading message="يتم إنشاء الفيديو... هذه العملية قد تستغرق بضع دقائق. يرجى الانتظار." />}

      {error && (
        <div className="text-center p-4 bg-red-100 border border-accent-red text-accent-red rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {generatedVideo && (
        <div className="text-center mt-6 space-y-4">
          <h3 className="text-2xl font-bold text-deep-blue">الفيديو جاهز!</h3>
          <video src={generatedVideo} controls autoPlay loop className="w-full max-w-2xl mx-auto rounded-lg shadow-xl" />
          <div className="flex justify-center gap-4">
            <a
              href={generatedVideo}
              download="sumer-iq-video.mp4"
              className="bg-old-gold text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              تحميل الفيديو
            </a>
            <button
              onClick={resetState}
              className="bg-deep-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              إنشاء فيديو جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerateView;
