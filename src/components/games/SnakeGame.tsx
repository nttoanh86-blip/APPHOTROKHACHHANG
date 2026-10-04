import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import contentData from '../../data/contentData.json';
import { generateVoucherCode } from '../../utils/formatters';

interface SnakeGameProps {
  onBackToMenu?: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC<SnakeGameProps> = () => {
  const { games } = contentData;
  const config = games.snake;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [gameState, setGameState] = useState<'idle' | 'running' | 'ended'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('snake_high_score') || '0', 10);
  });
  const [completionTime, setCompletionTime] = useState<string>('');
  const [rewardTier, setRewardTier] = useState<string>('Chưa có thưởng');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Grid params
  const GRID_SIZE = 20; // 20x20 tiles
  const TILE_SIZE = 18; // 360x360 canvas
  const GAME_SPEED = 115; // ms per tick - comfortable speed for counter customers

  // Mutable refs for game loop
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const scoreRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const milestone20HitRef = useRef<boolean>(false);
  const milestone40HitRef = useRef<boolean>(false);

  // Spawn food not on snake body
  const spawnFood = useCallback(() => {
    let newFood: Point;
    let collidesWithSnake: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      collidesWithSnake = snakeRef.current.some(
        (part) => part.x === newFood.x && part.y === newFood.y
      );
    } while (collidesWithSnake);
    foodRef.current = newFood;
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const cur = directionRef.current;
    if (newDir === 'UP' && cur !== 'DOWN') nextDirectionRef.current = 'UP';
    if (newDir === 'DOWN' && cur !== 'UP') nextDirectionRef.current = 'DOWN';
    if (newDir === 'LEFT' && cur !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && cur !== 'LEFT') nextDirectionRef.current = 'RIGHT';
  }, []);

  const handleStartGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    scoreRef.current = 0;
    milestone20HitRef.current = false;
    milestone40HitRef.current = false;
    setScore(0);
    setRewardTier('Chưa có thưởng');
    setToastMessage(null);
    spawnFood();
    setGameState('running');
  };

  const handleGameOver = useCallback(() => {
    setGameState('ended');
    const finalScore = scoreRef.current;
    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} - ${now.toLocaleDateString(
      'vi-VN'
    )}`;
    setCompletionTime(timeFormatted);

    // Calculate reward tier
    let tierText = 'Chưa đạt mốc nhận voucher';
    if (finalScore >= 40) {
      tierText = config.tier2Reward; // 02 vouchers
      setVoucherCode(generateVoucherCode());
    } else if (finalScore >= 20) {
      tierText = config.tier1Reward; // 01 voucher
      setVoucherCode(generateVoucherCode());
    }
    setRewardTier(tierText);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('snake_high_score', String(finalScore));
    }
  }, [config.tier1Reward, config.tier2Reward, highScore]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') changeDirection('UP');
      if (e.key === 'ArrowDown') changeDirection('DOWN');
      if (e.key === 'ArrowLeft') changeDirection('LEFT');
      if (e.key === 'ArrowRight') changeDirection('RIGHT');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'running') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timerRef.current = setInterval(() => {
      directionRef.current = nextDirectionRef.current;
      const head = { ...snakeRef.current[0] };

      if (directionRef.current === 'UP') head.y -= 1;
      if (directionRef.current === 'DOWN') head.y += 1;
      if (directionRef.current === 'LEFT') head.x -= 1;
      if (directionRef.current === 'RIGHT') head.x += 1;

      // Wall collision check
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return;
      }

      // Self collision check
      for (let i = 0; i < snakeRef.current.length; i++) {
        if (head.x === snakeRef.current[i].x && head.y === snakeRef.current[i].y) {
          handleGameOver();
          return;
        }
      }

      // Move snake
      snakeRef.current.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        scoreRef.current += 1;
        const newScore = scoreRef.current;
        setScore(newScore);

        // Milestone notification triggers
        if (newScore === 20 && !milestone20HitRef.current) {
          milestone20HitRef.current = true;
          setToastMessage('🎉 Chúc mừng Quý khách đã đạt 20 điểm! Nhận được 01 voucher xăng 2 lít.');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          } catch {}
          setTimeout(() => setToastMessage(null), 4000);
        } else if (newScore === 40 && !milestone40HitRef.current) {
          milestone40HitRef.current = true;
          setToastMessage('🔥 Xuất sắc! Quý khách đạt 40 điểm! Nhận được 02 voucher xăng (2L/voucher).');
          try {
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          } catch {}
          setTimeout(() => setToastMessage(null), 4500);
        }

        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // Render
      // Background grid
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid line accents
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(canvas.width, i * TILE_SIZE);
        ctx.stroke();
      }

      // Draw Food (Reward coin)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * TILE_SIZE + TILE_SIZE / 2,
        foodRef.current.y * TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE / 2.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Snake
      snakeRef.current.forEach((part, index) => {
        if (index === 0) {
          // Head (VietinBank Blue)
          ctx.fillStyle = '#005baa';
          ctx.fillRect(
            part.x * TILE_SIZE + 1,
            part.y * TILE_SIZE + 1,
            TILE_SIZE - 2,
            TILE_SIZE - 2
          );

          // Head accent (Red indicator)
          ctx.fillStyle = '#ED1C24';
          ctx.fillRect(
            part.x * TILE_SIZE + 3,
            part.y * TILE_SIZE + 3,
            TILE_SIZE - 6,
            TILE_SIZE - 6
          );
        } else {
          // Body segments
          ctx.fillStyle = index % 2 === 0 ? '#38bdf8' : '#0284c7';
          ctx.fillRect(
            part.x * TILE_SIZE + 1,
            part.y * TILE_SIZE + 1,
            TILE_SIZE - 2,
            TILE_SIZE - 2
          );
        }
      });
    }, GAME_SPEED);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, handleGameOver, spawnFood]);

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Game Card Container */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#ED1C24] uppercase tracking-wider block">
              {config.gameType}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {config.name}
            </h2>
            <p className="text-xs text-slate-400">
              {config.subtitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Kỷ lục cao nhất</span>
            <span className="text-base font-bold font-mono text-amber-400">
              {highScore} điểm
            </span>
          </div>
        </div>

        {/* Current Score Bar */}
        <div className="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Điểm hiện tại:</span>
            <strong className="text-base font-mono text-emerald-400 font-bold">
              {score}
            </strong>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span>Mốc thưởng:</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              score >= 40 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
              score >= 20 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40' :
              'bg-slate-700 text-slate-400'
            }`}>
              {score >= 40 ? '02 Voucher (4 Lít)' : score >= 20 ? '01 Voucher (2 Lít)' : 'Cần 20đ để nhận quà'}
            </span>
          </div>
        </div>

        {/* Floating Toast Notification when milestone hit */}
        {toastMessage && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 shadow-lg flex items-center justify-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Canvas Playing Area */}
        <div className="relative p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] rounded-2xl border-2 border-slate-800 shadow-inner bg-slate-900 block"
          />

          {/* Idle Start Screen */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 z-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#003B70] to-[#005baa] flex items-center justify-center shadow-lg mb-4 text-white">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>

              <h3 className="text-xl font-black text-white mb-2">
                {config.name}
              </h3>

              <div className="text-left bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs space-y-1.5 max-w-xs text-slate-300">
                {config.instructions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartGame}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#ED1C24] hover:bg-red-600 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-transform active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>BẮT ĐẦU CHƠI</span>
              </button>
            </div>
          )}

          {/* Game Over "Phiếu xác nhận quà tặng" Screen */}
          {gameState === 'ended' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 sm:p-6 z-20 overflow-y-auto">
              {/* Receipt Ticket */}
              <div className="bg-white text-slate-900 rounded-2xl p-5 w-full max-w-sm shadow-2xl border-2 border-slate-200 text-left relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#003B70] via-[#ED1C24] to-[#005baa]" />
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      VietinBank Kiosk Gift Ticket
                    </span>
                    <h4 className="text-sm font-black text-[#003B70]">
                      PHIẾU XÁC NHẬN QUÀ TẶNG
                    </h4>
                  </div>
                  <Ticket className="w-6 h-6 text-[#ED1C24]" />
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Điểm cuối cùng:</span>
                    <strong className="text-base font-bold font-mono text-slate-900">{score} điểm</strong>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mức quà đạt được:</span>
                    <strong className={`font-bold ${score >= 20 ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {score >= 40
                        ? '02 Voucher xăng 2L'
                        : score >= 20
                        ? '01 Voucher xăng 2L'
                        : 'Chưa đủ mốc'}
                    </strong>
                  </div>

                  {voucherCode && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Mã voucher:</span>
                      <strong className="font-mono font-bold text-[#003B70]">{voucherCode}</strong>
                    </div>
                  )}

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Thời gian hoàn thành:</span>
                    <span className="font-mono text-slate-600 text-[11px]">{completionTime}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium leading-relaxed mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{config.guideToClaim}</span>
                </div>

                <button
                  onClick={handleStartGame}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#003B70] hover:bg-[#005baa] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại lượt mới</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Touch Directional Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-medium">
            Phím điều hướng cảm ứng
          </span>
          <div className="grid grid-cols-3 gap-2 w-48">
            <div />
            <button
              onClick={() => changeDirection('UP')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              aria-label="Lên trên"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
            <div />

            <button
              onClick={() => changeDirection('LEFT')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              aria-label="Sang trái"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => changeDirection('DOWN')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              aria-label="Xuống dưới"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <button
              onClick={() => changeDirection('RIGHT')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-blue-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
              aria-label="Sang phải"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
