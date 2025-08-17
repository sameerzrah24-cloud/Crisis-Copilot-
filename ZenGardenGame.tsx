import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Flower, TreePine, Leaf } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../hooks/useTheme';

interface Plant {
  id: number;
  type: 'flower' | 'tree' | 'grass';
  x: number;
  y: number;
  size: number;
  color: string;
  quote?: string;
  growth: number;
}

const plantQuotes = [
  "Growth takes time",
  "You are blooming",
  "Peace grows within",
  "Breathe and be present",
  "You are rooted in strength",
  "Every moment is a fresh start",
  "You are exactly where you need to be",
  "Trust the process",
  "You are growing beautifully",
  "Find joy in small moments"
];

const plantTypes = [
  { type: 'flower' as const, emoji: '🌸', colors: ['#f472b6', '#ec4899', '#be185d'] },
  { type: 'tree' as const, emoji: '🌳', colors: ['#10b981', '#059669', '#047857'] },
  { type: 'grass' as const, emoji: '🌿', colors: ['#22c55e', '#16a34a', '#15803d'] }
];

export const ZenGardenGame: React.FC = () => {
  const { setCurrentScreen, addGameSession } = useApp();
  const { classes } = useTheme();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantType, setSelectedPlantType] = useState<'flower' | 'tree' | 'grass'>('flower');
  const [gameStartTime] = useState(Date.now());
  const [showQuote, setShowQuote] = useState<string | null>(null);
  const [draggedPlant, setDraggedPlant] = useState<number | null>(null);

  useEffect(() => {
    // Add some initial plants
    const initialPlants: Plant[] = [
      {
        id: 1,
        type: 'tree',
        x: 20,
        y: 30,
        size: 60,
        color: '#10b981',
        growth: 1,
        quote: plantQuotes[0]
      },
      {
        id: 2,
        type: 'flower',
        x: 70,
        y: 60,
        size: 40,
        color: '#f472b6',
        growth: 1,
        quote: plantQuotes[1]
      }
    ];
    setPlants(initialPlants);
  }, []);

  const addPlant = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const plantType = plantTypes.find(p => p.type === selectedPlantType);
    if (!plantType) return;

    const newPlant: Plant = {
      id: Date.now(),
      type: selectedPlantType,
      x,
      y,
      size: 20,
      color: plantType.colors[Math.floor(Math.random() * plantType.colors.length)],
      growth: 0,
      quote: plantQuotes[Math.floor(Math.random() * plantQuotes.length)]
    };

    setPlants(prev => [...prev, newPlant]);

    // Animate growth
    setTimeout(() => {
      setPlants(prev => prev.map(plant => 
        plant.id === newPlant.id 
          ? { ...plant, growth: 1, size: selectedPlantType === 'tree' ? 60 : selectedPlantType === 'flower' ? 40 : 30 }
          : plant
      ));
    }, 100);
  };

  const handlePlantClick = (plant: Plant) => {
    if (draggedPlant) return;
    setShowQuote(plant.quote || '');
    setTimeout(() => setShowQuote(null), 3000);
  };

  const handlePlantDragStart = (plantId: number) => {
    setDraggedPlant(plantId);
  };

  const handlePlantDrag = (plantId: number, e: React.MouseEvent) => {
    if (draggedPlant !== plantId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPlants(prev => prev.map(plant => 
      plant.id === plantId 
        ? { ...plant, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
        : plant
    ));
  };

  const handlePlantDragEnd = () => {
    setDraggedPlant(null);
  };

  const clearGarden = () => {
    setPlants([]);
  };

  const handleExit = () => {
    const duration = Date.now() - gameStartTime;
    addGameSession({
      game: 'Zen Garden',
      playedAt: new Date(),
      duration: Math.floor(duration / 1000)
    });
    setCurrentScreen('mini-games');
  };

  return (
    <div className={`min-h-screen ${classes.background} relative z-10 overflow-hidden`}>
      {/* Animated nature background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 30% 40%, #10b981 0%, transparent 50%)',
            'radial-gradient(circle at 70% 60%, #22c55e 0%, transparent 50%)',
            'radial-gradient(circle at 50% 30%, #059669 0%, transparent 50%)',
            'radial-gradient(circle at 30% 40%, #10b981 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating fireflies */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
          animate={{
            x: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, Math.random() * 200 - 100, 0],
            opacity: [0.3, 0.8, 0.4, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 10px #fef3c7',
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-20 p-6">
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
            <h1 className={`text-2xl font-light ${classes.text}`}>Zen Garden</h1>
            <p className={`${classes.text} opacity-70 text-sm`}>Grow your peaceful space</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearGarden}
            className={`p-3 ${classes.card} rounded-full shadow-lg`}
          >
            <RotateCcw size={20} className={classes.text} />
          </motion.button>
        </div>

        {/* Plant Type Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          {plantTypes.map((plantType) => (
            <motion.button
              key={plantType.type}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedPlantType(plantType.type)}
              className={`p-4 rounded-xl shadow-lg transition-all ${
                selectedPlantType === plantType.type
                  ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white'
                  : classes.card
              }`}
            >
              <span className="text-2xl">{plantType.emoji}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Garden Area */}
      <div 
        className="relative mx-6 mb-6 h-96 bg-gradient-to-b from-green-100 to-green-200 rounded-2xl shadow-lg overflow-hidden cursor-crosshair"
        onClick={addPlant}
        onMouseMove={(e) => draggedPlant && handlePlantDrag(draggedPlant, e)}
        onMouseUp={handlePlantDragEnd}
      >
        {/* Grass texture */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-4 bg-green-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
              }}
            />
          ))}
        </div>

        {/* Plants */}
        <AnimatePresence>
          {plants.map((plant) => (
            <motion.button
              key={plant.id}
              className="absolute cursor-pointer"
              style={{
                left: `${plant.x}%`,
                top: `${plant.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: plant.growth,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: plant.growth * 1.1 }}
              whileTap={{ scale: plant.growth * 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePlantClick(plant);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                handlePlantDragStart(plant.id);
              }}
              transition={{
                scale: { duration: 1, ease: 'easeOut' },
                opacity: { duration: 0.5 }
              }}
            >
              <div
                className="rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                style={{
                  width: plant.size,
                  height: plant.size,
                  backgroundColor: plant.color,
                  fontSize: plant.size * 0.4,
                }}
              >
                {plantTypes.find(p => p.type === plant.type)?.emoji}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Quote Display */}
      <AnimatePresence>
        {showQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className={`${classes.card} px-8 py-4 rounded-2xl shadow-2xl border-2 border-green-200`}>
              <p className={`text-lg font-medium ${classes.text} text-center`}>
                🌱 {showQuote}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className={`${classes.card} px-6 py-3 rounded-full shadow-lg backdrop-blur-sm`}>
          <p className={`${classes.text} text-sm text-center`}>
            Tap to plant • Click plants for quotes • Drag to move
          </p>
        </div>
      </div>
    </div>
  );
};