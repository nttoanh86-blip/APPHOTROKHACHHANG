import React, { useState } from 'react';
import { Gamepad2, Award, Zap, Sparkles } from 'lucide-react';
import { FlappyBirdGame } from './games/FlappyBirdGame';
import { SnakeGame } from './games/SnakeGame';
import contentData from '../data/contentData.json';

export const GameSection: React.FC = () => {
  const { games } = contentData;
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mini Game Tri Ân Khách Hàng Chờ Quầy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {games.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            {games.subtitle}. Đạt mốc điểm thử thách để nhận ngay phiếu quà tặng Voucher xăng 2L tiện ích!
          </p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-2 shadow-inner">
          <button
            onClick={() => setActiveGame('flappy')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activeGame === 'flappy'
                ? 'bg-white text-[#003B70] shadow-md ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeGame === 'flappy' ? 'text-[#ED1C24]' : 'text-slate-400'}`} />
            <span>Game 1: Flappy Bird</span>
          </button>

          <button
            onClick={() => setActiveGame('snake')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
              activeGame === 'snake'
                ? 'bg-white text-[#003B70] shadow-md ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Award className={`w-4 h-4 ${activeGame === 'snake' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>Game 2: Rắn săn mồi</span>
          </button>
        </div>
      </div>

      {/* Selected Game Container */}
      <div className="transition-all duration-300">
        {activeGame === 'flappy' ? <FlappyBirdGame /> : <SnakeGame />}
      </div>
    </div>
  );
};
