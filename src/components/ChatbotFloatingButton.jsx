// ✅ ChatbotFloatingButton.jsx（串流版＋多 prompt＋優化版＋可縮放＋清除訊息）
import React, { useState, useRef, useEffect } from 'react';

function ChatbotFloatingButton() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('goal');
  const messagesEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (mode === 'goal') {
      setInput('');
    } else if (mode === 'diet') {
      autoSendMessage('我想要飲食建議');
    } else if (mode === 'exercise') {
      autoSendMessage('我想要運動建議');
    }
  }, [mode]);

  const autoSendMessage = (msg) => {
    const newUserMessage = { role: 'user', content: msg };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      height: '165',
      weight: '60',
      age: '30',
      goal: msg,
      mode: mode
    }).toString();

    const eventSource = new EventSource(`http://localhost:8082/rest/health/healthAI/advice-stream?${queryParams}`, {
      withCredentials: true
    });

    let aiMessage = '';

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        // ✅ 就在這裡！
        setMessages((prev) => [
          ...prev,
          {
            role: 'bot',
            content: aiMessage
              .split('\n')
              .map(line => line.replace(/^[\u3000\s]+/, '')) // ✅ 移除每行開頭的「全形空白或半形空白」
              .join('\n')
          }
        ]);
        setIsLoading(false);
        eventSource.close();
      } else {
        aiMessage += event.data;
      }
    };

    eventSource.onerror = (err) => {
      console.error('串流錯誤', err);
      setMessages((prev) => [...prev, { role: 'bot', content: '⚠️ AI 回覆失敗，請稍後再試' }]);
      setIsLoading(false);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  const sendMessage = (customInput) => {
    const message = customInput || input;
    if (!message.trim()) return;
    const newUserMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      height: '165',
      weight: '60',
      age: '30',
      goal: message,
      mode: mode
    }).toString();

    const eventSource = new EventSource(`http://localhost:8082/rest/health/healthAI/advice-stream?${queryParams}`, {
      withCredentials: true
    });

    let aiMessage = '';

    eventSource.onmessage = (event) => {
      if (event.data === '[DONE]') {
        setMessages((prev) => [...prev, { role: 'bot', content: aiMessage }]);
        setIsLoading(false);
        eventSource.close();
      } else {
        aiMessage += event.data;
      }
    };

    eventSource.onerror = (err) => {
      console.error('串流錯誤', err);
      setMessages((prev) => [...prev, { role: 'bot', content: '⚠️ AI 回覆失敗，請稍後再試' }]);
      setIsLoading(false);
      eventSource.close();
    };

    eventSourceRef.current = eventSource;
  };

  const handleClearMessages = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setShowChat(prev => !prev)}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {showChat && (
        <div className="resize overflow-hidden min-w-[300px] min-h-[300px] w-[400px] h-[520px] bg-white rounded-xl shadow-xl mt-2 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-gray-800 text-base">健康 AI 小幫手</h2>
            <div className="flex gap-2 items-center">
              <button onClick={handleClearMessages} className="text-sm text-gray-500 hover:text-red-500">🗑 清除</button>
              <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-800">✖</button>
            </div>
          </div>

          <div className="flex gap-1 mb-2 text-sm">
            <button
              onClick={() => !isLoading && setMode('goal')}
              disabled={isLoading}
              className={`px-2 py-1 rounded ${mode === 'goal' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >目標建議</button>
            <button
              onClick={() => !isLoading && setMode('diet')}
              disabled={isLoading}
              className={`px-2 py-1 rounded ${mode === 'diet' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >飲食建議</button>
            <button
              onClick={() => !isLoading && setMode('exercise')}
              disabled={isLoading}
              className={`px-2 py-1 rounded ${mode === 'exercise' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >運動建議</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 text-[15px] leading-7 px-1 pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2 rounded-xl whitespace-pre-wrap break-words shadow-md text-sm leading-relaxed font-sans
                  ${msg.role === 'user'
                    ? 'bg-blue-100 text-gray-900 self-end text-left rounded-br-none'
                    : 'bg-gray-50 text-gray-800 self-start text-left border border-gray-200 rounded-bl-none'
                  }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && <div className="text-gray-400 text-sm">AI 回覆中...</div>}
            <div ref={messagesEndRef}></div>
          </div>

          {mode === 'goal' && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                className="flex-1 border rounded px-2 py-1 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="輸入你的問題..."
              />
              <button
                onClick={() => sendMessage()}
                className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
              >
                發送
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatbotFloatingButton;