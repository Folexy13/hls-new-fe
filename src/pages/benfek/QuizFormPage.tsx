import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { quizService } from '@/services/quizService';
import { apiClient } from '@/config/axios';
import { tokenManager } from '@/utils/tokenManager';
import { getApiErrorMessage } from '@/utils/apiError';
import {
  Sparkles,
  Flower,
  Coins,
  Wind,
  Wine,
  IceCream,
  Zap,
  Heart,
  Dumbbell,
  Leaf,
  Shield,
  Scale,
  Droplet,
  Sun,
  Pill,
  FlaskConical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import logo from '../../images/logo.jpg';

type Coin = {
  id: string;
  x: number;
  y: number;
  value: number;
  label: string;
  icon: React.ReactNode;
  ttl: number;
  vx: number;
  vy: number;
  collected?: boolean;
  motion?: 'drift' | 'float' | 'diagonal' | 'sweep';
  motionDuration?: number;
  motionDelay?: number;
};

const GAME_DURATION_MS = 15000;
const SPAWN_INTERVAL_MS = 600;
const HIGH_VALUE_TTL = 400;
const ULTRA_VALUE_TTL = 320;
const LOW_VALUE_TTL = 800;
const MID_VALUE_TTL = 700;
const VERY_LOW_VALUE_TTL = 900;
const PRE_GAME_COUNTDOWN = 0;
const MIN_X_BOUND = 8;
const MAX_X_BOUND = 92;
const DEFAULT_MIN_Y_BOUND = 32;
const DEFAULT_MAX_Y_BOUND = 95;

const sizeForValue = (value: number) =>
  value >= 5 ? 78 : value >= 4 ? 88 : value >= 3 ? 96 : value >= 2 ? 104 : 112;

const radiusForValue = (value: number) => sizeForValue(value) / 20;

const coinColorForValue = (value: number) => {
  if (value >= 5) return { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-400' };
  if (value >= 4) return { bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-400' };
  if (value >= 3) return { bg: 'bg-amber-500', text: 'text-slate-900', border: 'border-amber-300' };
  if (value >= 2) return { bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-300' };
  return { bg: 'bg-slate-200', text: 'text-slate-900', border: 'border-slate-300' };
};

const floatUpKeyframes = `
@keyframes floatUp {
  0% { opacity: 0; transform: translate(-50%, 6px); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -18px); }
}`;

const unrelatedOptionsByStep: Record<number, { id: string; label: string; icon: React.ReactNode; value: number }[]> = {
  0: [
    { id: 'hls-logo', label: 'HLS', icon: <img src={logo} alt="HLS" className="h-7 w-7 rounded-full" />, value: 5 },
    { id: 'focus', label: 'Focus', icon: <Zap className="h-5 w-5" />, value: 3 },
    { id: 'balance', label: 'Balance', icon: <Leaf className="h-5 w-5" />, value: 1 },
  ],
  1: [
    { id: 'hls-logo', label: 'HLS', icon: <img src={logo} alt="HLS" className="h-7 w-7 rounded-full" />, value: 5 },
    { id: 'hls', label: 'HLS', icon: <Shield className="h-5 w-5" />, value: 2 },
    { id: 'energy', label: 'Energy', icon: <Sun className="h-5 w-5" />, value: 3 },
  ],
  2: [
    { id: 'hls-logo', label: 'HLS', icon: <img src={logo} alt="HLS" className="h-7 w-7 rounded-full" />, value: 5 },
    { id: 'restore', label: 'Restore', icon: <Sparkles className="h-5 w-5" />, value: 2 },
    { id: 'renew', label: 'Renew', icon: <Leaf className="h-5 w-5" />, value: 1 },
  ],
};

const basicIcons = [
  { id: 'strength', label: 'Strength', icon: <Dumbbell className="h-5 w-5" />, value: 3 },
  { id: 'balance', label: 'Balance', icon: <Scale className="h-5 w-5" />, value: 2 },
  { id: 'hydration', label: 'Hydration', icon: <Droplet className="h-5 w-5" />, value: 2 },
  { id: 'vitality', label: 'Vitality', icon: <Sun className="h-5 w-5" />, value: 4 },
];

const lifestyleIcons: Record<string, { label: string; icon: React.ReactNode; value: number }> = {
  smoking: { label: 'Smoking', icon: <Wind className="h-5 w-5" />, value: 1 },
  drinking: { label: 'Drinking', icon: <Wine className="h-5 w-5" />, value: 2 },
  icecream: { label: 'Ice Cream', icon: <IceCream className="h-5 w-5" />, value: 2 },
  meditation: { label: 'Meditation', icon: <Flower className="h-5 w-5" />, value: 5 },
  skincare: { label: 'Skincare', icon: <Sparkles className="h-5 w-5" />, value: 4 },
  fitness: { label: 'Fitness', icon: <Dumbbell className="h-5 w-5" />, value: 4 },
  wellness: { label: 'Wellness', icon: <Heart className="h-5 w-5" />, value: 3 },
};
const relatedIconMap: Record<string, { label: string; icon: React.ReactNode; value: number }[]> = {
  smoking: [
    { label: 'Lung Health', icon: <Wind className="h-5 w-5" />, value: 4 },
    { label: 'Detox', icon: <Shield className="h-5 w-5" />, value: 2 },
  ],
  drinking: [
    { label: 'Hydration', icon: <Droplet className="h-5 w-5" />, value: 3 },
    { label: 'Spirits', icon: <Wine className="h-5 w-5" />, value: 2 },
  ],
  'ice cream': [
    { label: 'Sugar', icon: <Sparkles className="h-5 w-5" />, value: 3 },
    { label: 'Treat', icon: <IceCream className="h-5 w-5" />, value: 2 },
  ],
  meditation: [
    { label: 'Calm', icon: <Flower className="h-5 w-5" />, value: 4 },
    { label: 'Balance', icon: <Leaf className="h-5 w-5" />, value: 2 },
  ],
  fitness: [
    { label: 'Strength', icon: <Dumbbell className="h-5 w-5" />, value: 4 },
    { label: 'Energy', icon: <Sun className="h-5 w-5" />, value: 2 },
  ],
  wellness: [
    { label: 'Heart', icon: <Heart className="h-5 w-5" />, value: 4 },
    { label: 'Vitality', icon: <Sun className="h-5 w-5" />, value: 2 },
  ],
  yoga: [
    { label: 'Flexibility', icon: <Scale className="h-5 w-5" />, value: 3 },
    { label: 'Calm', icon: <Leaf className="h-5 w-5" />, value: 2 },
  ],
  reading: [
    { label: 'Focus', icon: <Zap className="h-5 w-5" />, value: 3 },
    { label: 'Mind', icon: <Sparkles className="h-5 w-5" />, value: 2 },
  ],
  music: [
    { label: 'Mood', icon: <Sparkles className="h-5 w-5" />, value: 3 },
    { label: 'Calm', icon: <Leaf className="h-5 w-5" />, value: 2 },
  ],
  sports: [
    { label: 'Performance', icon: <Dumbbell className="h-5 w-5" />, value: 4 },
    { label: 'Recovery', icon: <Droplet className="h-5 w-5" />, value: 2 },
  ],
  tablet: [
    { label: 'Tablet', icon: <Pill className="h-5 w-5" />, value: 3 },
    { label: 'Supplement', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
  capsule: [
    { label: 'Capsule', icon: <Pill className="h-5 w-5" />, value: 3 },
    { label: 'Blend', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
  liquid: [
    { label: 'Liquid', icon: <Droplet className="h-5 w-5" />, value: 3 },
    { label: 'Mix', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
  powder: [
    { label: 'Powder', icon: <Sparkles className="h-5 w-5" />, value: 3 },
    { label: 'Blend', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
  gummy: [
    { label: 'Gummy', icon: <IceCream className="h-5 w-5" />, value: 3 },
    { label: 'Chew', icon: <Pill className="h-5 w-5" />, value: 2 },
  ],
  chewable: [
    { label: 'Chewable', icon: <IceCream className="h-5 w-5" />, value: 3 },
    { label: 'Tablet', icon: <Pill className="h-5 w-5" />, value: 2 },
  ],
  syrup: [
    { label: 'Syrup', icon: <Droplet className="h-5 w-5" />, value: 3 },
    { label: 'Mix', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
  drops: [
    { label: 'Drops', icon: <Droplet className="h-5 w-5" />, value: 3 },
    { label: 'Blend', icon: <FlaskConical className="h-5 w-5" />, value: 2 },
  ],
};
const habitOptions = [
  'Smoking',
  'Drinking',
  'Ice Cream',
  'Fast Food',
  'Sugary Drinks',
  'Late Nights',
  'Meditation',
  'Exercise',
  'Reading',
  'Yoga',
];
const funOptions = ['Reading', 'Music', 'Movies', 'Gaming', 'Travel', 'Dancing', 'Cooking', 'Sports', 'Art'];
const routineOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Weekdays', 'Weekends', 'Shift Work'];
const careerOptions = ['Student', 'Developer', 'Teacher', 'Healthcare', 'Business', 'Freelancer', 'Entrepreneur'];
const drugFormOptions = ['Tablet', 'Capsule', 'Liquid', 'Powder', 'Gummy', 'Chewable', 'Syrup', 'Drops'];
const budgetRangeOptions = [
  '1000 - 5000',
  '5000 - 20000',
  '20000 - 50000',
  '50000 - 100000',
  '100000 - 500000',
];

const QuizFormPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const includeGenderAge = Boolean(
    (location.state as { includeGenderAge?: boolean } | null)?.includeGenderAge
  );
  const [nutrientStep, setNutrientStep] = useState(0);
  const [showIdentityModal, setShowIdentityModal] = useState(true);
  useEffect(() => {
    if (includeGenderAge) {
      setShowIdentityModal(false);
    }
  }, [includeGenderAge]);
  const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [lifestyle, setLifestyle] = useState({ habit: [], fun: [], routine: [], career: '' });
  const [preference, setPreference] = useState({ drugForm: [], budgetRange: '' });
  const [showCustomHabit, setShowCustomHabit] = useState(false);
  const [customHabit, setCustomHabit] = useState('');
  const [showCustomFun, setShowCustomFun] = useState(false);
  const [customFun, setCustomFun] = useState('');
  const [showCustomRoutine, setShowCustomRoutine] = useState(false);
  const [customRoutine, setCustomRoutine] = useState('');
  const [showCustomCareer, setShowCustomCareer] = useState(false);
  const [customCareer, setCustomCareer] = useState('');
  const [openLifestyleSection, setOpenLifestyleSection] = useState<'habit' | 'fun' | 'routine' | 'career' | null>('habit');
  const [openPreferenceSection, setOpenPreferenceSection] = useState<'drugForm' | null>('drugForm');
  const [showCustomDrugForm, setShowCustomDrugForm] = useState(false);
  const [customDrugForm, setCustomDrugForm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalLogin, setFinalLogin] = useState({ email: '', phone: '', password: '', confirmPassword: '' });
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [collectedCoins, setCollectedCoins] = useState<Coin[]>([]);
  const [floatingScores, setFloatingScores] = useState<{ id: string; x: number; y: number; value: number }[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [nextStepAfterGame, setNextStepAfterGame] = useState<number | null>(null);
  const [finalGameCompleted, setFinalGameCompleted] = useState(false);
  const gameIntervalRef = useRef<number | null>(null);
  const [preGameCountdown, setPreGameCountdown] = useState(PRE_GAME_COUNTDOWN);
  const [gameElapsedMs, setGameElapsedMs] = useState(0);
  const preGameIntervalRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const spawnIndexRef = useRef(0);
  const trappedContainerRef = useRef<HTMLDivElement | null>(null);
  const [trappedZonePct, setTrappedZonePct] = useState(DEFAULT_MIN_Y_BOUND);
  const [maxSafeYPct, setMaxSafeYPct] = useState(DEFAULT_MAX_Y_BOUND);
  useEffect(() => {
    if (!showGame) return;
    const element = trappedContainerRef.current;
    if (!element) {
      setMaxSafeYPct(DEFAULT_MAX_Y_BOUND);
      return;
    }
    const compute = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const topPct = (rect.top / viewport) * 100;
      const maxPct = Math.max(DEFAULT_MIN_Y_BOUND + 16, Math.min(DEFAULT_MAX_Y_BOUND, topPct - 6));
      setTrappedZonePct(DEFAULT_MIN_Y_BOUND);
      setMaxSafeYPct(maxPct);
    };
    compute();
    const observer = new ResizeObserver(() => compute());
    observer.observe(element);
    window.addEventListener('resize', compute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, [showGame, collectedCoins.length]);

  const validatedQuizCode = sessionStorage.getItem('validatedQuizCode') || '';
  const validatedBenfekName = sessionStorage.getItem('validatedBenfekName') || '';
  const validatedBenfekPhone = sessionStorage.getItem('validatedBenfekPhone') || '';
  const validatedBenfekGender = sessionStorage.getItem('validatedBenfekGender') || '';
  const validatedBenfekAge = sessionStorage.getItem('validatedBenfekAge') || '';

  const beginGame = (nextStep: number | null) => {
    setNextStepAfterGame(nextStep);
    setShowGame(true);
    setGameScore(0);
    setCoins([]);
    setCollectedCoins([]);
    setGameDone(false);
    setGameRunning(false);
    setPreGameCountdown(PRE_GAME_COUNTDOWN);
    if (nextStep === null) {
      setFinalGameCompleted(false);
    }
  };

  const handleNutrientNext = () => {
    // if (nutrientStep === 0) {
    //   if (!basic.gender || !basic.age || !basic.weight || !basic.height) {
    //     toast.error('Please fill all required basic fields.');
    //     return;
    //   }
    // }
    // if (nutrientStep === 1) {
    //   if (!lifestyle.career) {
    //     toast.error('Please fill all required lifestyle fields.');
    //     return;
    //   }
    // }
    // if (nutrientStep === 2) {
    //   if (!preference.minBudget || !preference.maxBudget) {
    //     toast.error('Please fill all required preference fields.');
    //     return;
    //   }
    // }
    if (nutrientStep < 2) {
      if (nutrientStep === 0) {
        setNutrientStep(1);
        return;
      }
      beginGame(nutrientStep + 1);
    }
  };

  const handleNutrientBack = () => {
    if (nutrientStep > 0) {
      if (nutrientStep === 2) {
        setFinalGameCompleted(false);
      }
      setNutrientStep(nutrientStep - 1);
    }
  };

  const handleNutrientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalGameCompleted) {
      beginGame(null);
      return;
    }
    if (!validatedQuizCode) {
      toast.error('Missing quiz code. Please validate your code again.');
      navigate('/assessment');
      return;
    }

    const budgetRangeMax = (() => {
      const matches = preference.budgetRange.match(/\d+/g);
      if (!matches || matches.length === 0) return 0;
      return Number(matches[matches.length - 1]);
    })();

    const payload = {
      code: validatedQuizCode,
      basics: {
        // nickname: basic.nickname || undefined,
        weight: String(basic.weight),
        height: String(basic.height),
      },
      lifestyle: {
        habits: [...lifestyle.habit, ...lifestyle.routine].join(','),
        funActivities: lifestyle.fun.join(','),
        priority: lifestyle.career || 'general',
      },
      preferences: {
        drugForm: preference.drugForm.join(','),
        budget: budgetRangeMax,
      },
    };

    if (!payload.preferences.budget || payload.preferences.budget <= 0) {
      toast.error('Please enter a valid budget.');
      return;
    }

    try {
      setIsSubmitting(true);
      await quizService.submitQuizData(payload);
      toast.success('Assessment completed successfully.');
      navigate('/benfek/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit quiz data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentGameOptions = useMemo(() => {
    if (nutrientStep === 0) {
      return basicIcons;
    }
    if (nutrientStep === 1) {
      const picked = [...lifestyle.habit, ...lifestyle.fun, ...lifestyle.routine, lifestyle.career]
        .join(',')
        .toLowerCase()
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      const mapped = picked
        .map((key) => lifestyleIcons[key])
        .filter(Boolean)
        .map((item) => ({ id: item.label.toLowerCase(), ...item }));
      return mapped.length > 0
        ? mapped
        : [
            lifestyleIcons.meditation,
            lifestyleIcons.skincare,
            lifestyleIcons.fitness,
          ].map((item) => ({ id: item.label.toLowerCase(), ...item }));
    }

    if (nutrientStep === 2) {
      const mapped = preference.drugForm.map((form) => {
        const normalized = form.toLowerCase();
        const icon =
          normalized.includes('capsule') || normalized.includes('tablet') ? <Pill className="h-5 w-5" /> :
          normalized.includes('syrup') || normalized.includes('liquid') ? <Droplet className="h-5 w-5" /> :
          <FlaskConical className="h-5 w-5" />;
        return {
          id: form,
          label: form,
          icon,
          value: normalized.includes('powder') ? 3 : 2,
        };
      });
      return mapped.length > 0
        ? mapped
        : [
            { id: 'supplements', label: 'Supplements', icon: <Pill className="h-5 w-5" />, value: 2 },
            { id: 'mixes', label: 'Mixes', icon: <FlaskConical className="h-5 w-5" />, value: 3 },
          ];
    }

    return [
      lifestyleIcons.wellness,
      lifestyleIcons.fitness,
      lifestyleIcons.meditation,
    ].map((item) => ({ id: item.label.toLowerCase(), ...item }));
  }, [nutrientStep, lifestyle, preference]);

  const previewCoins = useMemo(() => {
    const getRelatedIcons = (label: string) => {
      const key = label.toLowerCase();
      if (relatedIconMap[key]) return relatedIconMap[key];
      const match = Object.entries(relatedIconMap).find(([mapKey]) => key.includes(mapKey));
      if (match) return match[1];
      return [
        { label: `${label} Boost`, icon: <Heart className="h-5 w-5" />, value: 3 },
        { label: `${label} Support`, icon: <Leaf className="h-5 w-5" />, value: 2 },
      ];
    };

    const related = currentGameOptions.flatMap((option, index) =>
      getRelatedIcons(option.label).map((item, idx) => ({
        id: `${option.id}-rel-${index}-${idx}`,
        label: item.label,
        icon: item.icon,
        value: item.value,
      }))
    );

    return [...currentGameOptions, ...related];
  }, [currentGameOptions]);

  const minDistanceForValue = (value: number) => {
    if (value >= 5) return 28;
    if (value >= 4) return 24;
    if (value >= 3) return 22;
    return 20;
  };

  const startGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    setGameRunning(true);
    setGameDone(false);
    setGameElapsedMs(0);
    const gameStart = Date.now();

    const spawn = () => {
      setCoins((prev) => {
        if (prev.length >= 3) {
          return prev;
        }
        const unrelatedOptions = unrelatedOptionsByStep[nutrientStep] || [];
        const pool = [
          ...currentGameOptions.map((opt) => ({
            ...opt,
            weight: opt.value >= 5 ? 0.15 : opt.value >= 4 ? 0.3 : 1,
          })),
          ...unrelatedOptions.map((opt) => ({
            ...opt,
            weight: opt.value >= 5 ? 0.15 : opt.value >= 4 ? 0.3 : 1,
          })),
        ];
        const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
        let roll = Math.random() * totalWeight;
        const chosen = pool.find((item) => {
          roll -= item.weight;
          return roll <= 0;
        }) || pool[0];

        const value = chosen.value;
        const ttl =
          value >= 5
            ? ULTRA_VALUE_TTL
            : value >= 4
              ? HIGH_VALUE_TTL
              : value <= 2
                ? VERY_LOW_VALUE_TTL
                : MID_VALUE_TTL;
        const motions: Coin['motion'][] = ['drift', 'float', 'diagonal', 'sweep'];
        const motion = motions[Math.floor(Math.random() * motions.length)];
        const motionDuration =
          motion === 'sweep'
            ? value >= 4
              ? 2.0
              : value <= 2
                ? 1.8
                : 2.6
            : value >= 5
              ? 1.1
              : value >= 4
                ? 1.4
                : value <= 2
                  ? 1.6
                  : 2.2;
        const topSpawn = Math.min(70, trappedZonePct + 6);
        const midSpawn = Math.min(76, trappedZonePct + 26);
        const bottomSpawn = Math.max(topSpawn + 12, Math.min(maxSafeYPct - 6, DEFAULT_MAX_Y_BOUND));
        const spawnGrid = [
          { x: 12, y: topSpawn },
          { x: 32, y: topSpawn },
          { x: 52, y: topSpawn },
          { x: 72, y: topSpawn },
          { x: 12, y: midSpawn },
          { x: 32, y: midSpawn },
          { x: 52, y: midSpawn },
          { x: 72, y: midSpawn },
          { x: 12, y: bottomSpawn },
          { x: 32, y: bottomSpawn },
          { x: 52, y: bottomSpawn },
          { x: 72, y: bottomSpawn },
        ];
        const nextPosition = () => {
          const position = spawnGrid[spawnIndexRef.current % spawnGrid.length];
          spawnIndexRef.current += 1;
          const jitterX = (Math.random() - 0.5) * 6;
          const jitterY = (Math.random() - 0.5) * 6;
          const randomX = Math.random() * 85 + 5;
          const randomY = Math.random() * 30 + Math.min(70, trappedZonePct + 6);
          const baseX = value >= 4 ? randomX : position.x + jitterX;
          const baseY = value >= 4 ? randomY : position.y + jitterY;
          return {
            x: Math.min(92, Math.max(8, baseX)),
            y: Math.min(maxSafeYPct - 4, Math.max(trappedZonePct + 2, baseY)),
          };
        };

        const minDistance = minDistanceForValue(value);
        const viewportW = window.innerWidth || 1000;
        const viewportH = window.innerHeight || 1000;
        let chosenPosition = nextPosition();
        let attempts = 0;
        while (attempts < 12) {
          const hasOverlap = prev.some((coin) => {
            if (coin.collected) return false;
            const dx = ((coin.x - chosenPosition.x) / 100) * viewportW;
            const dy = ((coin.y - chosenPosition.y) / 100) * viewportH;
            const distance = Math.hypot(dx, dy);
            const minDistPx =
              (sizeForValue(value) + sizeForValue(coin.value)) / 2 +
              Math.max(minDistance, minDistanceForValue(coin.value));
            return distance < minDistPx;
          });
          if (!hasOverlap) break;
          chosenPosition = nextPosition();
          attempts += 1;
        }

        if (attempts >= 12) {
          return prev;
        }

        const baseSpeed = value >= 4 ? 22 : value <= 2 ? 12 : 16;
        let vx = 0;
        let vy = 0;
        if (value <= 2) {
          const direction = Math.random() < 0.5 ? -1 : 1;
          vx = direction * (baseSpeed + 18);
          vy = (Math.random() - 0.5) * 6;
        } else {
          const angle = Math.random() * Math.PI * 2;
          vx = Math.cos(angle) * baseSpeed;
          vy = Math.sin(angle) * baseSpeed;
        }

        const newCoin: Coin = {
          id: `${Date.now()}-${Math.random()}`,
          x: chosenPosition.x,
          y: chosenPosition.y,
          value,
          label: chosen.label,
          icon: chosen.icon,
          ttl,
          vx,
          vy,
          motion,
          motionDuration,
          motionDelay: Math.random() * 0.2,
        };

        setTimeout(() => {
          setCoins((current) => current.filter((coin) => coin.id !== newCoin.id));
        }, ttl);

        return [...prev, newCoin];
      });
    };

    spawn();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - gameStart;
      setGameElapsedMs(elapsed);
      if (elapsed >= GAME_DURATION_MS) {
        clearInterval(interval);
        gameIntervalRef.current = null;
        setGameRunning(false);
        setGameDone(true);
      } else {
        spawn();
      }
    }, SPAWN_INTERVAL_MS);
    gameIntervalRef.current = interval;
  };

  useEffect(() => {
    if (preGameIntervalRef.current) {
      clearInterval(preGameIntervalRef.current);
      preGameIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!gameRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastFrameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastFrameRef.current == null) {
        lastFrameRef.current = timestamp;
      }
      const deltaMs = Math.min(50, timestamp - lastFrameRef.current);
      const dt = deltaMs / 1000;
      lastFrameRef.current = timestamp;

      setCoins((prev) => {
        if (prev.length === 0) return prev;
        const updated = prev.map((coin) => ({ ...coin }));

        const viewportW = window.innerWidth || 1000;
        const viewportH = window.innerHeight || 1000;

        updated.forEach((coin) => {
          if (coin.collected) return;
          const radiusPx = sizeForValue(coin.value) / 2;
          const radiusXPct = (radiusPx / viewportW) * 100;
          const radiusYPct = (radiusPx / viewportH) * 100;
          coin.x += coin.vx * dt;
          coin.y += coin.vy * dt;

          if (coin.x - radiusXPct < MIN_X_BOUND) {
            coin.x = MIN_X_BOUND + radiusXPct;
            coin.vx = Math.abs(coin.vx);
          } else if (coin.x + radiusXPct > MAX_X_BOUND) {
            coin.x = MAX_X_BOUND - radiusXPct;
            coin.vx = -Math.abs(coin.vx);
          }

          if (coin.y - radiusYPct < trappedZonePct) {
            coin.y = trappedZonePct + radiusYPct;
            coin.vy = Math.abs(coin.vy);
          } else if (coin.y + radiusYPct > maxSafeYPct) {
            coin.y = maxSafeYPct - radiusYPct;
            coin.vy = -Math.abs(coin.vy);
          }
        });

        for (let pass = 0; pass < 2; pass += 1) {
          for (let i = 0; i < updated.length; i += 1) {
            const a = updated[i];
            if (a.collected) continue;
              const ra = sizeForValue(a.value) / 2;
              for (let j = i + 1; j < updated.length; j += 1) {
                const b = updated[j];
                if (b.collected) continue;
              const rb = sizeForValue(b.value) / 2;
              const ax = (a.x / 100) * viewportW;
              const ay = (a.y / 100) * viewportH;
              const bx = (b.x / 100) * viewportW;
              const by = (b.y / 100) * viewportH;
              const dx = bx - ax;
              const dy = by - ay;
              const dist = Math.hypot(dx, dy);
              const minDist = ra + rb;
              if (dist > 0 && dist < minDist) {
                const nx = dx / dist;
                const ny = dy / dist;
                const overlap = minDist - dist + 1;
                a.x -= (nx * (overlap / 2) / viewportW) * 100;
                a.y -= (ny * (overlap / 2) / viewportH) * 100;
                b.x += (nx * (overlap / 2) / viewportW) * 100;
                b.y += (ny * (overlap / 2) / viewportH) * 100;

                const dvx = b.vx - a.vx;
                const dvy = b.vy - a.vy;
                const impact = dvx * nx + dvy * ny;
                if (impact < 0) {
                  a.vx += nx * impact * 1.1;
                  a.vy += ny * impact * 1.1;
                  b.vx -= nx * impact * 1.1;
                  b.vy -= ny * impact * 1.1;
                }
              }
            }
          }
        }

        return updated;
      });

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      lastFrameRef.current = null;
    };
  }, [gameRunning]);

  const handleCoinClick = (coinId: string, value: number) => {
    setCoins((prev) =>
      prev.map((coin) =>
        coin.id === coinId ? { ...coin, collected: true } : coin
      )
    );
    setGameScore((prev) => prev + value);
    setCollectedCoins((prev) => {
      const tapped = coins.find((coin) => coin.id === coinId);
      return tapped ? [...prev, tapped] : prev;
    });
    const tappedCoin = coins.find((coin) => coin.id === coinId);
    if (tappedCoin) {
      const floatId = `${coinId}-float-${Date.now()}`;
      const adjustedY = Math.max(40, tappedCoin.y + 6);
      setFloatingScores((prev) => [
        ...prev,
        { id: floatId, x: tappedCoin.x, y: adjustedY, value },
      ]);
      window.setTimeout(() => {
        setFloatingScores((prev) => prev.filter((item) => item.id !== floatId));
      }, 900);
    }
    setTimeout(() => {
      setCoins((prev) => prev.filter((coin) => coin.id !== coinId));
    }, 300);
  };

  const handleContinueAfterGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    if (preGameIntervalRef.current) {
      clearInterval(preGameIntervalRef.current);
      preGameIntervalRef.current = null;
    }
    setTotalScore((prev) => prev + gameScore);
    if (nextStepAfterGame !== null) {
      setNutrientStep(nextStepAfterGame);
    } else {
      setFinalGameCompleted(true);
      setNutrientStep(3);
    }
    setShowGame(false);
    setCoins([]);
    setCollectedCoins([]);
    setGameScore(0);
    setGameDone(false);
    setGameRunning(false);
    setNextStepAfterGame(null);
  };

  const handleFinalLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalLogin.email || !finalLogin.phone || !finalLogin.password || !finalLogin.confirmPassword) {
      toast.error('Please fill all fields.');
      return;
    }
    if (finalLogin.password !== finalLogin.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    const [firstName = 'Benfek', ...restName] = (validatedBenfekName || 'Benfek User').trim().split(/\s+/);
    const lastName = restName.join(' ') || 'User';

    try {
      setIsSubmitting(true);
      const registerResponse = await apiClient.post('/api/v2/auth/register-benfek-unreferred', {
        firstName,
        lastName,
        email: finalLogin.email,
        phone: finalLogin.phone,
        password: finalLogin.password,
        confirmPassword: finalLogin.confirmPassword,
      });

      const tokens = registerResponse.data?.data?.tokens;
      if (tokens?.accessToken && tokens?.refreshToken) {
        tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
      }

      await apiClient.post('/api/v2/benfek/game-points', {
        points: totalScore,
        quizCode: validatedQuizCode || undefined,
        email: finalLogin.email,
        phone: finalLogin.phone,
        metadata: {
          source: 'quiz-form',
          completedAt: new Date().toISOString(),
        },
      });

      toast.success('Login details and game points saved.');
      navigate('/benfek/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to save login details. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplayGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    setCoins([]);
    setCollectedCoins([]);
    setFloatingScores([]);
    setGameScore(0);
    setGameDone(false);
    setGameRunning(false);
    setPreGameCountdown(0);
    startGame();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {showIdentityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <Card className="w-full max-w-lg border border-slate-200 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome {validatedBenfekName || 'Benfek'}!
              </h2>
              <p className="text-sm text-gray-600 mt-3">
                Please confirm that your name is {validatedBenfekName || 'your name'}. You are{' '}
                {validatedBenfekGender || 'unspecified'}, and you are{' '}
                {validatedBenfekAge || 'N/A'} years old.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowIdentityModal(false)}
                  className="w-full sm:w-auto"
                >
                  Yes, it is me
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/assessment')}
                  className="w-full sm:w-auto"
                >
                  It is not me
                </Button>
              </div>
            </Card>
          </div>
        )}
        {/* <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome {validatedBenfekName || "Benfek"}</h1>
          <p className="text-sm text-gray-600 mt-2">
            Complete this assessment to personalize your recommendations.
          </p>
        </div> */}

        <Card
          className={`p-5 sm:p-6 border border-slate-200 ${
            showIdentityModal ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          {totalScore > 0 && (
            <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Total points so far: <span className="font-semibold">{totalScore} gz</span>
            </div>
          )}
          {nutrientStep === 3 ? (
            <form onSubmit={handleFinalLoginSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Congratulations!</h2>
                <p className="text-sm text-slate-600">
                  You earn a total of {totalScore} gz. Create your login details below to convert them into discounts for your purchases.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Email address</Label>
                  <Input
                    type="email"
                    value={finalLogin.email}
                    onChange={(e) => setFinalLogin((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <Label>WhatsApp Phone number</Label>
                  <Input
                    value={finalLogin.phone}
                    onChange={(e) => setFinalLogin((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="e.g. +2348000000000"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={finalLogin.password}
                    onChange={(e) => setFinalLogin((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    value={finalLogin.confirmPassword}
                    onChange={(e) => setFinalLogin((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleNutrientSubmit} className="space-y-6">
            {nutrientStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includeGenderAge && (
                    <>
                      <div>
                        <Label>Gender</Label>
                        <Select value={basic.gender} onValueChange={(v) => setBasic(b => ({ ...b, gender: v }))}>
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Age</Label>
                        <Input
                          type="number"
                          value={basic.age}
                          onChange={e => setBasic(b => ({ ...b, age: e.target.value }))}
                          placeholder="Enter your age"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={basic.weight} onChange={e => setBasic(b => ({ ...b, weight: e.target.value }))} placeholder="Enter weight" />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input type="number" value={basic.height} onChange={e => setBasic(b => ({ ...b, height: e.target.value }))} placeholder="Enter height" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" onClick={handleNutrientNext}>Next</Button>
                </div>
              </div>
            )}

            {nutrientStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Lifestyle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLifestyleSection((prev) => (prev === 'habit' ? null : 'habit'))
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900"
                    >
                      Habit (select all that apply)
                      {openLifestyleSection === 'habit' ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    {openLifestyleSection === 'habit' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {habitOptions.map((option) => {
                          const selected = lifestyle.habit.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setLifestyle((prev) => ({
                                  ...prev,
                                  habit: selected
                                    ? prev.habit.filter((item) => item !== option)
                                    : [...prev.habit, option],
                                }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                selected
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setShowCustomHabit(true)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          Add more
                        </button>
                      </div>
                    )}
                    {openLifestyleSection === 'habit' && showCustomHabit && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={customHabit}
                          onChange={(e) => setCustomHabit(e.target.value)}
                          placeholder="Enter habit"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const value = customHabit.trim();
                            if (!value) return;
                            setLifestyle((prev) => ({
                              ...prev,
                              habit: prev.habit.includes(value) ? prev.habit : [...prev.habit, value],
                            }));
                            setCustomHabit('');
                            setShowCustomHabit(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLifestyleSection((prev) => (prev === 'fun' ? null : 'fun'))
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900"
                    >
                      Fun (select all that apply)
                      {openLifestyleSection === 'fun' ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    {openLifestyleSection === 'fun' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {funOptions.map((option) => {
                          const selected = lifestyle.fun.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setLifestyle((prev) => ({
                                  ...prev,
                                  fun: selected
                                    ? prev.fun.filter((item) => item !== option)
                                    : [...prev.fun, option],
                                }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                selected
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setShowCustomFun(true)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          Add more
                        </button>
                      </div>
                    )}
                    {openLifestyleSection === 'fun' && showCustomFun && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={customFun}
                          onChange={(e) => setCustomFun(e.target.value)}
                          placeholder="Enter fun activity"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const value = customFun.trim();
                            if (!value) return;
                            setLifestyle((prev) => ({
                              ...prev,
                              fun: prev.fun.includes(value) ? prev.fun : [...prev.fun, value],
                            }));
                            setCustomFun('');
                            setShowCustomFun(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLifestyleSection((prev) => (prev === 'routine' ? null : 'routine'))
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900"
                    >
                      Routine (select all that apply)
                      {openLifestyleSection === 'routine' ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    {openLifestyleSection === 'routine' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {routineOptions.map((option) => {
                          const selected = lifestyle.routine.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setLifestyle((prev) => ({
                                  ...prev,
                                  routine: selected
                                    ? prev.routine.filter((item) => item !== option)
                                    : [...prev.routine, option],
                                }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                selected
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setShowCustomRoutine(true)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          Add more
                        </button>
                      </div>
                    )}
                    {openLifestyleSection === 'routine' && showCustomRoutine && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={customRoutine}
                          onChange={(e) => setCustomRoutine(e.target.value)}
                          placeholder="Enter routine"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const value = customRoutine.trim();
                            if (!value) return;
                            setLifestyle((prev) => ({
                              ...prev,
                              routine: prev.routine.includes(value)
                                ? prev.routine
                                : [...prev.routine, value],
                            }));
                            setCustomRoutine('');
                            setShowCustomRoutine(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenLifestyleSection((prev) => (prev === 'career' ? null : 'career'))
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900"
                    >
                      Career
                      {openLifestyleSection === 'career' ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    {openLifestyleSection === 'career' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {careerOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setLifestyle((prev) => ({ ...prev, career: option }))}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                              lifestyle.career === option
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setShowCustomCareer(true)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          Add more
                        </button>
                      </div>
                    )}
                    {openLifestyleSection === 'career' && showCustomCareer && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={customCareer}
                          onChange={(e) => setCustomCareer(e.target.value)}
                          placeholder="Enter career"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const value = customCareer.trim();
                            if (!value) return;
                            setLifestyle((prev) => ({ ...prev, career: value }));
                            setCustomCareer('');
                            setShowCustomCareer(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={handleNutrientBack}>Back</Button>
                  <Button type="button" onClick={handleNutrientNext}>Next</Button>
                </div>
              </div>
            )}

            {nutrientStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenPreferenceSection((prev) => (prev === 'drugForm' ? null : 'drugForm'))
                      }
                      className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900"
                    >
                      Drug Form (select all that apply)
                      {openPreferenceSection === 'drugForm' ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                    {openPreferenceSection === 'drugForm' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {drugFormOptions.map((option) => {
                          const selected = preference.drugForm.includes(option);
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setPreference((prev) => ({
                                  ...prev,
                                  drugForm: selected
                                    ? prev.drugForm.filter((item) => item !== option)
                                    : [...prev.drugForm, option],
                                }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                selected
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setShowCustomDrugForm(true)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          Add more
                        </button>
                      </div>
                    )}
                    {openPreferenceSection === 'drugForm' && showCustomDrugForm && (
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={customDrugForm}
                          onChange={(e) => setCustomDrugForm(e.target.value)}
                          placeholder="Enter drug form"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const value = customDrugForm.trim();
                            if (!value) return;
                            setPreference((prev) => ({
                              ...prev,
                              drugForm: prev.drugForm.includes(value)
                                ? prev.drugForm
                                : [...prev.drugForm, value],
                            }));
                            setCustomDrugForm('');
                            setShowCustomDrugForm(false);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <Select
                      value={preference.budgetRange}
                      onValueChange={(value) => setPreference((prev) => ({ ...prev, budgetRange: value }))}
                    >
                      <SelectTrigger className="font-bold">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRangeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={handleNutrientBack}>Back</Button>
                  {finalGameCompleted ? (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  ) : (
                    <Button type="button" onClick={() => beginGame(null)}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
          )}
        </Card>
      </div>

      {showGame && (
        <div className="mt-16 fixed inset-0 z-40 bg-gradient-to-br from-emerald-900 via-slate-900 to-amber-900">
          <style>{floatUpKeyframes}</style>
          {!gameRunning && !gameDone && (
            <div className="absolute inset-0 flex items-start justify-center">
              <div className="w-full max-w-2xl px-4 mt-[10px] min-h-[60vh] pt-1 flex flex-col gap-10 pointer-events-auto">
                <div className="mb-5 rounded-2xl bg-white/85 px-4 py-3 text-center text-xs font-semibold text-slate-700 shadow-md backdrop-blur">
                  Select the coins with icons which you think are closely related to your selected lifestyle option, the closer the match you pick, the higher the points.
                  Note that the coins you select are what is going to be available in the game.
                </div>
                <div className="flex flex-wrap gap-[10px] w-full grid-cols-3 sm:grid-cols-4 justify-center">
                  {previewCoins.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-center"
                    >
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${coinColorForValue(opt.value).border} ${coinColorForValue(opt.value).bg} shadow-md`}>
                        <div className={`flex flex-col items-center ${coinColorForValue(opt.value).text} [&>svg]:h-7 [&>svg]:w-7 [&>img]:h-7 [&>img]:w-7`}>
                          {opt.icon}
                          <span className="text-[10px] font-semibold">{opt.value} gz</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className=" inset-0 z-40 flex items-end justify-center pb-16 pointer-events-none">
                  <div className="flex flex-col items-center gap-5 pointer-events-auto">
                    <Button
                      type="button"
                      onClick={startGame}
                      className="px-8 py-4 text-lg rounded-full disabled:opacity-60"
                    >
                      START
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {(gameRunning || gameDone) && (
          <div className="flex h-full flex-col justify-between gap-4 p-4 border border-white/30">
            <div className="border border-white/30 rounded-xl px-4 py-3">
              <div className="h-2 w-full rounded-full bg-white/30 overflow-hidden">
                <div
                  className="h-full bg-red-400 transition-[width] duration-200"
                  style={{
                    width: `${Math.min(100, (gameElapsedMs / GAME_DURATION_MS) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-1 text-[10px] text-white/70 text-center">
                {Math.ceil(Math.max(0, (GAME_DURATION_MS - gameElapsedMs) / 1000))}s left
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden border border-white/30 rounded-xl">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(251,191,36,0.2),_transparent_60%)]" />
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_40%,rgba(255,255,255,0)_60%)]" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] [background-size:26px_26px]" />
                <div className="absolute top-6 left-6 rounded-full bg-white/80 px-4 py-2 shadow-md text-sm font-semibold text-slate-700">
                  Score: {gameScore} gz
                </div>
              </div>

              <div className="absolute top-0 left-0 right-0 z-20 h-28 pointer-events-none bg-gradient-to-b from-emerald-900/90 via-slate-900/70 to-transparent" />
            {coins.map((coin) => {
              const size = sizeForValue(coin.value) * 0.7;
              const color = coinColorForValue(coin.value);
              return (
              <button
                key={coin.id}
                onClick={() => handleCoinClick(coin.id, coin.value)}
                className={`absolute z-10 flex items-center justify-center rounded-full border ${color.border} ${color.bg} shadow-lg transition-all ${
                  coin.collected ? 'scale-0 opacity-0' : 'hover:scale-105'
                }`}
                style={{
                  left: `${coin.x}%`,
                  top: `${coin.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: 'popIn 0.25s ease-out',
                }}
              >
                <div className={`flex flex-col items-center ${color.text} [&>svg]:h-8 [&>svg]:w-8 [&>img]:h-8 [&>img]:w-8`}>
                  {coin.icon}
                  <span className="text-[12px] font-semibold">{coin.value} gz</span>
                </div>
              </button>
            );
            })}
            {floatingScores.map((score) => (
              <div
                key={score.id}
                className="absolute z-30 text-emerald-200 text-sm font-semibold pointer-events-none animate-[floatUp_0.9s_ease-out]"
                style={{ left: `${score.x}%`, top: `${score.y}%` }}
              >
                +{score.value} gz
              </div>
            ))}

            {gameDone && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Card className="w-full max-w-md p-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Great job!</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    You earned {gameScore} gz coins in this round.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Total so far: {totalScore + gameScore} gz
                  </p>
                  <div className="mt-6 flex w-full gap-3">
                    <Button variant="outline" onClick={handleReplayGame} className="flex-1">
                      Replay
                    </Button>
                    <Button onClick={handleContinueAfterGame} className="flex-1">
                      Continue
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>

          <div
            ref={trappedContainerRef}
            className="h-auto border border-white/30 rounded-xl bg-white/10 backdrop-blur-sm p-4"
          >
            <div className="text-xs font-semibold text-white/80 mb-3">Selected coins</div>
            <div className="flex flex-wrap items-center justify-start gap-2">
              {collectedCoins.map((coin, index) => (
                <div
                  key={`${coin.id}-${index}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-emerald-100"
                >
                  <div className="text-emerald-600 [&>svg]:h-5 [&>svg]:w-5 [&>img]:h-6 [&>img]:w-6">{coin.icon}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(var(--tx), var(--ty)); }
          100% { transform: translate(0, 0); }
        }
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(var(--dy)); }
          100% { transform: translateY(0); }
        }
        @keyframes diagonalMove {
          0% { transform: translate(0, 0); }
          50% { transform: translate(var(--dx), var(--dy)); }
          100% { transform: translate(0, 0); }
        }
        @keyframes sweepAcross {
          0% { transform: translate(0, 0); }
          100% { transform: translate(120vw, -20vh); }
        }
      `}</style>
    </div>
  );
};

export default QuizFormPage;
