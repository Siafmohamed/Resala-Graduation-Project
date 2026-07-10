import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 96) + 'px';
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
    <div className="p-4 bg-white border-t border-blue-200">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالة..."
          disabled={disabled}
          dir="rtl"
          rows={1}
          className="
            flex-1 p-3 border border-blue-200 rounded-2xl resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
            disabled:opacity-50 disabled:cursor-not-allowed
            font-[Cairo]
          "
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="
            p-3 bg-blue-700 text-white rounded-full
            hover:bg-blue-600 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Send size={20} className="rotate-180" />
        </Button>
      </div>
    </div>
  );
};
