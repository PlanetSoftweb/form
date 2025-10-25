import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Zap, Box, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  isVisible: boolean;
}

const stages = [
  { icon: Sparkles, text: 'Analyzing prompt...', color: 'text-blue-500' },
  { icon: Zap, text: 'Generating form structure...', color: 'text-purple-500' },
  { icon: Box, text: 'Creating form fields...', color: 'text-indigo-500' },
  { icon: FileText, text: 'Optimizing layout...', color: 'text-violet-500' },
  { icon: CheckCircle2, text: 'Finalizing form...', color: 'text-green-500' },
];

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const SplitFlapChar = ({ char, delay = 0 }: { char: string; delay?: number }) => {
  const [currentChar, setCurrentChar] = useState('A');
  const [isFlipping, setIsFlipping] = useState(true);

  useEffect(() => {
    let iteration = 0;
    const targetIndex = char === ' ' ? -1 : letters.indexOf(char.toUpperCase());
    
    const interval = setInterval(() => {
      if (iteration <= targetIndex || targetIndex === -1) {
        if (targetIndex === -1) {
          setCurrentChar(' ');
          setIsFlipping(false);
          clearInterval(interval);
        } else {
          setCurrentChar(letters[iteration]);
          iteration++;
          if (iteration > targetIndex) {
            setIsFlipping(false);
            clearInterval(interval);
          }
        }
      }
    }, 50 + delay * 10);

    return () => clearInterval(interval);
  }, [char, delay]);

  return (
    <motion.span
      className={`inline-block min-w-[0.6em] text-center ${
        isFlipping ? 'text-blue-400' : 'text-white'
      }`}
      animate={{
        rotateX: isFlipping ? [0, 180, 0] : 0,
      }}
      transition={{
        duration: 0.3,
        repeat: isFlipping ? Infinity : 0,
      }}
    >
      {currentChar}
    </motion.span>
  );
};

const SplitFlapDisplay = ({ text }: { text: string }) => {
  return (
    <div className="font-mono text-3xl font-bold tracking-wider">
      {text.split('').map((char, i) => (
        <SplitFlapChar key={i} char={char} delay={i} />
      ))}
    </div>
  );
};

const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          initial={{
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
            y: [
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
              Math.random() * 400 - 200,
            ],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

const ProgressRing = ({ progress }: { progress: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 140 140">
      <circle
        cx="70"
        cy="70"
        r={radius}
        stroke="rgba(59, 130, 246, 0.1)"
        strokeWidth="8"
        fill="none"
      />
      <motion.circle
        cx="70"
        cy="70"
        r={radius}
        stroke="url(#gradient)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AirportLoadingAnimation = ({ isVisible }: Props) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.random() * 5;
        }
        return prev;
      });
    }, 300);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const CurrentIcon = stages[currentStage].icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      >
        <ParticleField />
        
        <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ProgressRing progress={progress} />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <CurrentIcon className={`w-12 h-12 ${stages[currentStage].color}`} />
            </motion.div>
          </motion.div>

          <div className="text-center space-y-4">
            <SplitFlapDisplay text="GENERATING" />
            
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-blue-200"
            >
              {stages[currentStage].text}
            </motion.div>

            <div className="flex space-x-1 justify-center mt-6">
              {stages.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full ${
                    index <= currentStage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gray-700'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: index <= currentStage ? 40 : 20 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>

            <motion.div
              className="text-sm text-blue-300 mt-4"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Powered by AI • {Math.round(progress)}% Complete
            </motion.div>
          </div>

          <div className="flex space-x-8 text-blue-300 text-xs">
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▓▒░ Processing...
            </motion.div>
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              ░▒▓ Optimizing...
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
