import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Palette, Save, Music, VolumeX, Volume2, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Point {
  x: number;
  y: number;
}

type BrushType = 'glow' | 'pastel' | 'dotted' | 'watercolor';

export const DrawToCalmGame: React.FC = () => {
  const { setCurrentScreen, addGameSession } = useApp();
  const { classes } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBrush, setCurrentBrush] = useState<BrushType>('glow');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const brushes = [
    { id: 'glow' as BrushType, name: 'Glow', emoji: '✨', color: '#a855f7' },
    { id: 'pastel' as BrushType, name: 'Pastel', emoji: '🌸', color: '#f472b6' },
    { id: 'dotted' as BrushType, name: 'Dotted', emoji: '🔵', color: '#3b82f6' },
    { id: 'watercolor' as BrushType, name: 'Watercolor', emoji: '🎨', color: '#10b981' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Set initial canvas background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getEventPos(e);
    draw(pos, pos);
  };

  const draw = (currentPos: Point, lastPos: Point) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    switch (currentBrush) {
      case 'glow':
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 8;
        break;
      case 'pastel':
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 12;
        ctx.globalAlpha = 0.7;
        break;
      case 'dotted':
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 6;
        ctx.setLineDash([5, 10]);
        break;
      case 'watercolor':
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 20;
        ctx.globalAlpha = 0.3;
        break;
    }

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    // Reset styles
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const pos = getEventPos(e);
    draw(pos, pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getEventPos(e);
    draw(pos, pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const saveToJournal = () => {
    // In a real app, this would save the canvas as an image to the journal
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  const handleExit = () => {
    const duration = Date.now() - gameStartTime;
    addGameSession({
      game: 'Draw to Calm',
      playedAt: new Date(),
      duration: Math.floor(duration / 1000)
    });
    setCurrentScreen('mini-games');
  };

  return (
    <div className={`min-h-screen ${classes.background} relative z-10 overflow-hidden`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #f472b6 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #a855f7 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #f472b6 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Header */}
      <div className="relative z-20 p-4">
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExit}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <ArrowLeft size={20} className={classes.text} />
          </motion.button>
          
          <div className="text-center">
            <h1 className={`text-xl font-light ${classes.text}`}>Draw to Calm</h1>
            <p className={`${classes.text} opacity-70 text-sm`}>Draw how you feel...</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            {musicEnabled ? 
              <Volume2 size={20} className={classes.text} /> : 
              <VolumeX size={20} className={classes.text} />
            }
          </motion.button>
        </div>

        {/* Brush Selector */}
        <div className="flex justify-center space-x-2 mb-4">
          {brushes.map((brush) => (
            <motion.button
              key={brush.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentBrush(brush.id)}
              className={`p-3 rounded-full shadow-lg transition-all ${
                currentBrush === brush.id
                  ? 'bg-white ring-2 ring-purple-400'
                  : classes.card
              }`}
            >
              <span className="text-lg">{brush.emoji}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative z-10 mx-4 mb-4">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-white rounded-2xl shadow-lg cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={handleTouchMove}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Controls */}
      <div className="relative z-20 px-4 pb-6">
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCanvas}
            className={`px-6 py-3 ${classes.card} rounded-xl shadow-lg flex items-center space-x-2`}
          >
            <RotateCcw size={18} className={classes.text} />
            <span className={`${classes.text} font-medium`}>Clear</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveToJournal}
            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl shadow-lg flex items-center space-x-2"
          >
            <Save size={18} />
            <span className="font-medium">Save to Journal</span>
          </motion.button>
        </div>
      </div>

      {/* Save Message */}
      <AnimatePresence>
        {showSaveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className={`${classes.card} px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/20`}>
              <p className={`text-lg font-medium ${classes.text} text-center`}>
                ✨ Saved to Journal!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};