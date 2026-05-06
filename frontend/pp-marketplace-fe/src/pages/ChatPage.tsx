import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { CartItem } from '../types';

interface ChatState {
  accountName?: string;
  orderId?: number;
  items?: CartItem[];
  totalPrice?: number;
}

interface Message {
  id: number;
  sender: 'seller' | 'buyer';
  text: string;
}

export default function ChatPage() {
  const location = useLocation();
  const state = (location.state || {}) as ChatState;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'seller',
      text: 'Hi, thanks for the order. I will confirm stock and guide the next buying steps here.',
    },
    {
      id: 2,
      sender: 'seller',
      text: state.accountName
        ? `I received your account info: ${state.accountName}. Please keep the game open while I process it.`
        : 'Send your account name or ID so I can continue the order.',
    },
  ]);

  const orderItems = useMemo(() => state.items || [], [state.items]);
  const totalPrice = useMemo(
    () => state.totalPrice ?? orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.totalPrice, orderItems]
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: 'buyer', text: messageText.trim() },
      {
        id: Date.now() + 1,
        sender: 'seller',
        text: 'Got it. This is a demo chat, so the seller progression is ready for your real chat API later.',
      },
    ]);
    setMessageText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-2 mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="section-title mb-2">Seller Chat</h1>
          <p className="text-gray-400">
            {state.orderId ? `Order #${state.orderId}` : 'Demo order'} is waiting for seller follow-up.
          </p>
        </div>
        <Link to="/" className="btn-secondary text-center">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card min-h-[520px] flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 text-left ${
                    message.sender === 'buyer'
                      ? 'bg-gaming-red text-white'
                      : 'bg-dark-800 text-gray-100 border border-dark-700'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wide opacity-75 mb-1">
                    {message.sender === 'buyer' ? 'You' : 'Seller'}
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="mt-6 flex gap-3">
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Message the seller..."
              className="flex-1"
            />
            <button type="submit" className="btn-primary">Send</button>
          </form>
        </div>

        <aside className="card h-fit">
          <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
          <div className="space-y-3 border-b border-dark-700 pb-4">
            <div>
              <div className="text-sm text-gray-500">Account</div>
              <div className="text-white break-words">{state.accountName || 'Not provided'}</div>
            </div>
            {orderItems.length === 0 ? (
              <p className="text-gray-400">No item snapshot available.</p>
            ) : (
              orderItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                  <span className="text-gaming-orange">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between text-lg font-bold text-gaming-orange mt-4">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
