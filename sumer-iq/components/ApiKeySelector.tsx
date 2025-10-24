
import React from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {

  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      // Optimistically assume key selection was successful.
      onKeySelected();
    } catch (error) {
      console.error("Error opening API key selection dialog:", error);
      alert("لم نتمكن من فتح مربع حوار تحديد المفتاح. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-old-gold/50 text-center max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-deep-blue mb-4">مطلوب مفتاح API</h2>
      <p className="text-sumerian-clay mb-6">
        لإنشاء مقاطع فيديو باستخدام Veo، يجب عليك تحديد مفتاح API. هذا يضمن أن لديك الأذونات اللازمة والفوترة مُعدة.
      </p>
      <button
        onClick={handleSelectKey}
        className="bg-deep-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-sumerian-clay transition-colors duration-300"
      >
        اختيار مفتاح API
      </button>
      <p className="mt-4 text-xs text-gray-500">
        سيتم توجيهك إلى مربع حوار لتحديد مفتاح مشروع Google Cloud الخاص بك. للمزيد من المعلومات حول الفوترة، يرجى زيارة {' '}
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="text-deep-blue underline hover:text-sumerian-clay"
        >
          وثائق الفوترة
        </a>.
      </p>
    </div>
  );
};

export default ApiKeySelector;
