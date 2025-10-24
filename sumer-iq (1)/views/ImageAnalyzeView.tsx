import React, { useState, useRef } from 'react';
import { analyzeImage, fileToBase64 } from '../services/geminiService';
import Loading from '../components/Loading';
import { marked } from 'marked';

const ImageAnalyzeView: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('يرجى رفع صورة أولاً.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await analyzeImage(base64, mimeType);
      setAnalysis(result);
    } catch (err) {
      setError('حدث خطأ أثناء تحليل الصورة. الرجاء المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-deep-blue">حلل صورة</h2>
        <p className="text-sumerian-clay">اكتشف ما يراه الذكاء الاصطناعي في صورتك.</p>
      </div>

      {!imagePreview && (
         <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-old-gold border-dashed rounded-lg cursor-pointer bg-white/50 hover:bg-old-gold/10">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-sumerian-clay" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm text-deep-blue"><span className="font-semibold">انقر للتحميل</span> أو اسحب وأفلت الصورة</p>
                    <p className="text-xs text-sumerian-clay">PNG, JPG or JPEG</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} ref={fileInputRef} />
            </label>
        </div> 
      )}
      
      {imagePreview && !analysis && (
        <div className="text-center space-y-4">
            <img src={imagePreview} alt="Preview" className="max-h-80 rounded-lg shadow-md mx-auto" />
            <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full md:w-auto bg-deep-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-sumerian-clay transition-colors duration-300 disabled:bg-gray-400"
            >
            {isLoading ? 'جاري التحليل...' : 'حلل الصورة'}
            </button>
        </div>
      )}

      {isLoading && <Loading message="يتم تحليل الصورة بعمق..." />}

      {error && <p className="text-center text-accent-red mt-4">{error}</p>}
      
      {analysis && (
        <div className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <img src={imagePreview!} alt="Analyzed" className="w-full rounded-lg shadow-xl" />
                <div 
                    className="prose prose-lg max-w-none bg-white/70 p-6 rounded-lg border border-old-gold/50" 
                    dangerouslySetInnerHTML={{ __html: marked(analysis) }} 
                />
            </div>
          <div className="text-center mt-4">
            <button
              onClick={resetState}
              className="bg-deep-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              تحليل صورة أخرى
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzeView;
