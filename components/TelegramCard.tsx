import React from 'react';
import { CheckCheck, ShieldAlert, Clock } from 'lucide-react';
import { TipRequest } from '../types';

interface TelegramCardProps {
  request: TipRequest;
}

const TelegramCard: React.FC<TelegramCardProps> = ({ request }) => {
  const isPending = request.status === 'PENDING';
  
  if (isPending) {
    return (
      <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl rounded-tl-none p-4 max-w-md w-full opacity-75">
        <div className="flex items-center space-x-2 text-yellow-500 mb-2">
          <Clock className="w-4 h-4" />
          <span className="font-bold text-xs">Analysis in progress...</span>
        </div>
        <div className="text-gray-400 text-xs">
           One of our experts is analyzing the market for your request.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-[#1C2436] rounded-2xl rounded-tr-none shadow-lg overflow-hidden border border-gray-800 relative group">
      {/* Header */}
      <div className="bg-[#2AABEE] px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-white text-[#2AABEE] flex items-center justify-center font-bold text-[10px]">
            TC
          </div>
          <div>
            <h3 className="text-white font-bold text-xs leading-tight">TipCredit Official</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-gray-100 font-sans text-sm leading-relaxed">
        <div className="mb-3">
          <span className="text-[#2AABEE] font-bold text-sm block">
            {request.title || 'Premium Tip'}
          </span>
        </div>
        
        <div className="whitespace-pre-wrap text-sm">
            {/* Simple mock markdown rendering */}
            {request.content?.split('\n').map((line, i) => {
                if (line.startsWith('**')) {
                    const clean = line.replace(/\*\*/g, '');
                    const parts = clean.split(':');
                    return (
                        <div key={i} className="mb-1">
                            <strong className="text-blue-400">{parts[0]}:</strong>
                            {parts.slice(1).join(':')}
                        </div>
                    )
                }
                return <p key={i} className="mb-2">{line}</p>;
            })}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between items-end">
          <div className="flex items-center space-x-1 text-[10px] text-gray-500">
             <ShieldAlert className="w-3 h-3" />
             <span>Risk involved</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-gray-500">
              {request.deliveredAt ? new Date(request.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
            </span>
            <CheckCheck className="w-3 h-3 text-[#2AABEE]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramCard;