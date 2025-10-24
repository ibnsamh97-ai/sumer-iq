import React, { useState, useRef } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Loading from '../components/Loading';

const ImageEditView: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
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
      setEditedImage(null);
      setError(null);
    }
  };

  const handleEdit = async () => {
    if (!imageFile || !prompt) {
      setError('يرجى رفع صورة وكتابة وصف للتعديل.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const result = await editImage(prompt, base64, mimeType);
      setEditedImage(result);
    } catch (err) {
      setError('حدث خطأ أثناء تعديل الصورة. الرجاء المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt('');
    setEditedImage(null);
    setIsLoading(false);
    setError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-deep-blue">تعديل صورة بالذكاء</h2>
        <p className="text-sumerian-clay">اكتب وصفًا للتعديل الذي تريده على صورتك.</p>
      </div>

      {!editedImage && (
        <div className="space-y-6">
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

          {imagePreview && (
            <div className="flex flex-col items-center gap-4">
              <img src={imagePreview} alt="Preview" className="max-h-80 rounded-lg shadow-md" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="مثال: أضف فلترًا قديمًا، أزل الشخص في الخلفية..."
                className="w-full p-3 border-2 border-old-gold rounded-lg focus:ring-sumerian-clay focus:border-sumerian-clay"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleEdit}
                disabled={isLoading || !prompt}
                className="w-full md:w-auto bg-deep-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-sumerian-clay transition-colors duration-300 disabled:bg-gray-400"
              >
                {isLoading ? 'جاري التعديل...' : 'عدّل الصورة'}
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading && <Loading message="يقوم الذكاء الاصطناعي بتطبيق لمساته..." />}
      
      {error && <p className="text-center text-accent-red mt-4">{error}</p>}

      {editedImage && (
        <div className="text-center mt-6 space-y-4">
          <h3 className="text-2xl font-bold text-deep-blue">النتيجة النهائية</h3>
          <img src={editedImage} alt="Edited result" className="max-w-full mx-auto max-h-[60vh] rounded-lg shadow-xl" />
          <div className="flex justify-center gap-4">
            <a
              href={editedImage}
              download="sumer-iq-edited.jpg"
              className="bg-old-gold text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              تحميل الصورة
            </a>
            <button
              onClick={resetState}
              className="bg-deep-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-sumerian-clay transition-colors"
            >
              البدء من جديد
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditView;
