import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi — I can guide you through registering a property, understanding rates, updating ownership, paying arrears, resolving a notice, or downloading a receipt. What do you need?" }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'Register a property',
    'How rates are calculated',
    'Pay arrears',
    'Resolve a notice',
    'Download a receipt'
  ];

  const getResponse = (question) => {
    const lower = question.toLowerCase();
    if (lower.includes('register')) {
      return "To register a property: open Property Register from the side menu, click '+ Register Property', then fill in the owner, location (sub-county and ward), property type, and unit count. The assessed rate calculates automatically from the County's rate schedule for that property type.";
    }
    if (lower.includes('calculat') || lower.includes('how are rates')) {
      return "Rates are calculated from the property's use type (e.g. residential house, office block, market stall) using the County's per-category rate. Multi-unit properties (apartments, malls, serviced apartments) scale the base rate by unit count. You can see the exact calculation in the registration form's live preview before submitting.";
    }
    if (lower.includes('arrear') || lower.includes('pay')) {
      return "To pay arrears: open the property from the Register or Map, go to the Billing tab, and click 'Record Payment'. Choose a payment channel (Mobile Money, Bank Transfer, Card, or Cash Office) and confirm — a receipt is generated immediately.";
    }
    if (lower.includes('notice')) {
      return "Notices are served on overdue properties from the Billing tab in the property detail drawer, or directly from an Audit Bot flag using 'Send Notice'. Once served, you can offer the ratepayer a payment plan from the same tab.";
    }
    if (lower.includes('receipt')) {
      return "Receipts are listed under Billing & Payments — open any payment row and click 'View' to see the full receipt, which you can also reach right after recording a payment.";
    }
    if (lower.includes('owner') || lower.includes('update ownership')) {
      return "Ownership details are edited from the property's Overview tab. In this prototype, ownership updates are made directly in the drawer; a live deployment would route ownership changes through a verification step (see the IPRS tab) before they take effect.";
    }
    if (lower.includes('iprs') || lower.includes('ardhi') || lower.includes('title')) {
      return "IPRS identity verification and Ardhi Sasa title lookup are shown in each property's detail drawer as clearly-labeled placeholders — they preview the intended workflow but aren't connected to live government systems in this prototype.";
    }
    return "I can help with registering properties, rates calculation, payments, notices, and receipts. Try one of the quick-reply options below, or ask in your own words.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = getResponse(input);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 500);
  };

  const quickReply = (text) => {
    setInput(text);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <>
      {/* FAB */}
      <button
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          isOpen ? 'bg-navy' : 'bg-gold hover:bg-gold/90'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-lg shadow-2xl border border-line z-50 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="bg-navy text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <span className="font-semibold text-sm">County Rates Guided Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.type === 'user' ? 'bg-teal-soft' : 'bg-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-line-soft">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                className="text-xs bg-paper border border-line rounded-full px-3 py-1 hover:bg-teal-soft transition-colors"
                onClick={() => quickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-line-soft">
            <input
              type="text"
              className="input text-sm"
              placeholder="Ask the assistant…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="btn btn-sm btn-primary" onClick={sendMessage}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Assistant;