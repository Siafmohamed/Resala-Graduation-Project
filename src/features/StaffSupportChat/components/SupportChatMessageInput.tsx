import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface SupportChatMessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const SupportChatMessageInput: React.FC<SupportChatMessageInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100">
      <div className="flex items-end gap-3 p-2 rounded-2xl bg-[#f8fafc] border border-gray-100 focus-within:border-[#00549A]/30 focus-within:ring-4 focus-within:ring-[#00549A]/5 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك بأسلوب واضح ومهني..."
          disabled={disabled}
          dir="rtl"
          rows={1}
          className="flex-1 px-3 py-2.5 bg-transparent resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-[Cairo] text-sm text-[#101727] placeholder:text-[#94a3b8] max-h-[120px]"
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="p-3 min-w-[44px] h-[44px] bg-gradient-to-br from-[#00549A] to-[#0070c0] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#00549A]/20"
        >
          <Send size={18} className="rotate-180" />
        </Button>
      </div>
      <p className="font-[Cairo] text-[10px] text-[#94a3b8] mt-2 text-center">
        Enter للإرسال · Shift+Enter لسطر جديد
      </p>
    </div>
  );
};
