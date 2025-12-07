import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Loader2, ImagePlus, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, image?: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((text.trim() || selectedImage) && !isLoading) {
      onSend(text, selectedImage || undefined);
      setText('');
      setSelectedImage(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  return (
    <div className="w-full bg-gray-950 border-t border-gray-800 p-4">
      <div className="max-w-4xl mx-auto relative">
        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-20 w-auto rounded-lg border border-gray-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-900 border border-gray-700 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
            capture="environment" // Hints mobile browsers to open camera
          />
          
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-800 mb-0.5"
            title="Adicionar imagem ou tirar foto"
          >
            <ImagePlus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Adicione uma descrição..." : "Descreva seu problema ou envie uma foto da tela..."}
            className="w-full bg-transparent text-gray-200 text-sm p-2 max-h-32 min-h-[44px] resize-none focus:outline-none placeholder-gray-500 scrollbar-hide"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={(!text.trim() && !selectedImage) || isLoading}
            className={`p-2 rounded-lg flex-shrink-0 mb-0.5 transition-colors ${
              (!text.trim() && !selectedImage) || isLoading
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-2">
          IA especializada em Áudio Pro. Para hardware físico, agende com a bancada.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;