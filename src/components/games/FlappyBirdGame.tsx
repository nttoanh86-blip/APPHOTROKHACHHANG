import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Copy, Check, Trophy, Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';
import contentData from '../../data/contentData.json';
import { generateVoucherCode } from '../../utils/formatters';

interface FlappyBirdGameProps {
  onBackToMenu?: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = () => {
  const { games } = contentData;
  const config = games.flappy;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('flappy_high_score') || '0', 10);
  });
  const [lastVoucher, setLastVoucher] = useState<string | null>(() => {
    return localStorage.getItem('flappy_last_voucher') || null;
  });
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Constants
  const WIN_SCORE = config.winScore; // 20
  const GRAVITY = 0.28;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.1;
  const PIPE_SPAWN_INTERVAL = 110; // frames
  const PIPE_GAP = 160; // wide enough for casual counter customers
  const PIPE_WIDTH = 58;

  // Animation frame & internal physics refs
  const animationFrameId = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);
  const birdRef = useRef({
    x: 60,
    y: 180,
    velocity: 0,
    radius: 16,
    rotation: 0,
  });

  interface Pipe {
    x: number;
    topHeight: number;
    bottomHeight: number;
    passed: boolean;
  }
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef<number>(0);

  // Motivation text based on score
  const getMotivation = (currentScore: number) => {
    const step = config.motivationSteps.find(
      (s) => currentScore >= s.min && currentScore <= s.max
    );
    return step ? step.text : 'Tiếp tục nào!';
  };

  const jump = useCallback(() => {
    if (gameState === 'start') {
      startGame();
      return;
    }
    if (gameState === 'playing') {
      birdRef.current.velocity = JUMP_FORCE;
    }
  }, [gameState]);

  const startGame = () => {
    birdRef.current = {
      x: 70,
      y: 180,
      velocity: 0,
      radius: 16,
      rotation: 0,
    };
    pipesRef.current = [];
    scoreRef.current = 0;
    frameCountRef.current = 0;
    setScore(0);
    setGameState('playing');
  };

  const endGame = useCallback(() => {
    setGameState('gameover');
    const finalScore = scoreRef.current;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappy_high_score', String(finalScore));
    }
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [highScore]);

  const winGame = useCallback(() => {
    setGameState('won');
    const voucher = generateVoucherCode();
    setCurrentVoucher(voucher);
    setLastVoucher(voucher);
    localStorage.setItem('flappy_last_voucher', voucher);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#003B70', '#ED1C24', '#f59e0b', '#10b981'],
      });
    } catch {
      // fallback
    }

    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: voucher,
        reward: config.reward,
        timestamp: new Date().toISOString(),
      });
    }
  }, [config.reward, WIN_SCORE]);

  const handleCopyVoucher = () => {
    if (!currentVoucher) return;
    navigator.clipboard.writeText(currentVoucher);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Main Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;
      frameCountRef.current += 1;

      // 1. Update Bird
      const bird = birdRef.current;
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;
      bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 4 * Math.PI) / 180));

      // Ground / Ceiling hit
      if (bird.y + bird.radius >= height - 20) {
        endGame();
        return;
      }
      if (bird.y - bird.radius <= 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
      }

      // 2. Spawn & Move Pipes
      if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
        const minPipeH = 40;
        const availableHeight = height - PIPE_GAP - 60;
        const topH = Math.floor(Math.random() * (availableHeight - minPipeH)) + minPipeH;
        pipesRef.current.push({
          x: width,
          topHeight: topH,
          bottomHeight: height - topH - PIPE_GAP,
          passed: false,
        });
      }

      // 3. Update & Collision check
      for (let i = 0; i < pipesRef.current.length; i++) {
        const pipe = pipesRef.current[i];
        pipe.x -= PIPE_SPEED;

        // Collision check
        const inPipeX =
          bird.x + bird.radius > pipe.x &&
          bird.x - bird.radius < pipe.x + PIPE_WIDTH;

        const inTopPipeY = bird.y - bird.radius < pipe.topHeight;
        const inBottomPipeY = bird.y + bird.radius > height - pipe.bottomHeight;

        if (inPipeX && (inTopPipeY || inBottomPipeY)) {
          endGame();
          return;
        }

        // Score update
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          scoreRef.current += 1;
          const newScore = scoreRef.current;
          setScore(newScore);

          if (newScore >= WIN_SCORE) {
            winGame();
            return;
          }
        }
      }

      // Remove offscreen pipes
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_WIDTH > -10);

      // 4. Render Canvas
      // Sky gradient (VietinBank subtle corporate sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(100, 70, 24, 0, Math.PI * 2);
      ctx.arc(125, 60, 32, 0, Math.PI * 2);
      ctx.arc(155, 70, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 100, 20, 0, Math.PI * 2);
      ctx.arc(300, 90, 26, 0, Math.PI * 2);
      ctx.arc(325, 100, 20, 0, Math.PI * 2);
      ctx.fill();

      // Draw Pipes (VietinBank styled columns with metallic blue/gold accent)
      pipesRef.current.forEach((pipe) => {
        // Top Pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        topGrad.addColorStop(0, '#003B70');
        topGrad.addColorStop(0.5, '#005baa');
        topGrad.addColorStop(1, '#002548');

        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

        // Top Pipe Lip
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, PIPE_WIDTH + 6, 12);

        // Bottom Pipe
        const bottomY = height - pipe.bottomHeight;
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, pipe.bottomHeight);

        // Bottom Pipe Lip
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, bottomY, PIPE_WIDTH + 6, 12);
      });

      // Ground bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, height - 16, width, 16);
      ctx.fillStyle = '#005baa';
      ctx.fillRect(0, height - 20, width, 4);

      // Draw Bird / Mascot (Golden Bank Card or Winged Mascot)
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // Mascot Body: Card/Coin shape
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Mascot Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(8, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Wing (flapping effect)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      const wingY = Math.sin(frameCountRef.current * 0.3) * 4;
      ctx.ellipse(-5, wingY, 9, 6, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      // Beak
      ctx.fillStyle = '#ED1C24';
      ctx.beginPath();
      ctx.moveTo(12, -2);
      ctx.lineTo(20, 2);
      ctx.lineTo(12, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState, endGame, winGame, WIN_SCORE]);

  return (
    <div id="flappy-voucher-game" className="relative w-full max-w-xl mx-auto select-none">
      {/* Game Header Bar */}
      <div className="bg-slate-900 text-white rounded-t-3xl p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            {config.gameType}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white truncate">
            {config.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Kỷ lục</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {highScore} / {WIN_SCORE}
            </span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress & Motivation Bar */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-white font-mono">
            Điểm: {score}/{WIN_SCORE}
          </span>
        </div>
        <div className="text-xs font-semibold text-amber-300 truncate max-w-[200px]">
          {getMotivation(score)}
        </div>
      </div>

      {/* Progress Bar 0 to 20 */}
      <div className="w-full bg-slate-700 h-2">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-[#ED1C24] transition-all duration-200"
          style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
        />
      </div>

      {/* Interactive Game Canvas Box */}
      <div
        ref={containerRef}
        onClick={jump}
        className="relative bg-sky-100 overflow-hidden cursor-pointer touch-none select-none rounded-b-3xl shadow-xl aspect-4/5 sm:aspect-4/4 max-h-[460px] flex items-center justify-center border-x border-b border-slate-200"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={460}
          className="w-full h-full object-cover block"
        />

        {/* Start Overlay Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white z-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg mb-4 animate-bounce">
              <Trophy className="w-8 h-8 text-slate-900" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black mb-2 text-white">
              {config.name}
            </h3>
            <p className="text-sm text-amber-300 font-semibold mb-2">
              {config.description}
            </p>
            <p className="text-xs text-slate-300 mb-6 max-w-xs">
              {config.instruction}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#ED1C24] hover:bg-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>BẮT ĐẦU CHƠI</span>
            </button>

            {lastVoucher && (
              <div className="mt-6 p-2.5 bg-slate-900/90 rounded-xl border border-slate-700 text-xs text-slate-300">
                <span>Mã gần nhất: </span>
                <strong className="text-amber-400 font-mono">{lastVoucher}</strong>
              </div>
            )}
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white z-20">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold mb-1">Rất tiếc!</h3>
            <p className="text-sm text-slate-200 mb-1">
              Bạn đã vượt qua <strong className="text-amber-400 font-mono">{score}/{WIN_SCORE}</strong> thử thách
            </p>
            <p className="text-xs text-slate-400 mb-6">
              Chỉ còn một chút nữa thôi, hãy thử lại nhé!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#005baa] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('start');
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 text-white z-20">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 ring-4 ring-emerald-500/30">
              <Trophy className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-amber-300 mb-1">
              CHÚC MỪNG CHIẾN THẮNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mb-4 max-w-sm">
              {config.winMessage}
            </p>

            {/* Voucher Box */}
            <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/20 border-2 border-amber-400 rounded-2xl p-4 w-full max-w-xs mb-4 shadow-lg">
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-1">
                {config.reward}
              </span>
              <div className="text-2xl font-black font-mono tracking-widest text-white mb-2">
                {currentVoucher}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyVoucher();
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép mã!' : 'Sao chép mã'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-300 mb-5 max-w-xs leading-relaxed">
              {config.guideToClaim}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#003B70] hover:bg-[#005baa] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-[11px] text-slate-400">
        Mẹo: Nhấn chuột, chạm màn hình hoặc bấm phím Space để bay.
      </div>
    </div>
  );
};
