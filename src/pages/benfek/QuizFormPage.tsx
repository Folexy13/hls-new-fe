import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { quizService } from '@/services/quizService';
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
  collected?: boolean;
  motion?: 'drift' | 'float' | 'diagonal' | 'sweep';
  motionDuration?: number;
  motionDelay?: number;
};

const GAME_DURATION_MS = 25000;
const SPAWN_INTERVAL_MS = 600;
const HIGH_VALUE_TTL = 1200;
const ULTRA_VALUE_TTL = 900;
const LOW_VALUE_TTL = 2800;
const MID_VALUE_TTL = 3200;
const VERY_LOW_VALUE_TTL = 3800;
const PRE_GAME_COUNTDOWN = 10;

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
  '5001 - 20000',
  '20001 - 50000',
  '50001 - 100000',
  '100001 - 500000',
];

const QuizFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [nutrientStep, setNutrientStep] = useState(0);
  const [showIdentityModal, setShowIdentityModal] = useState(true);
  // const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [basic, setBasic] = useState({ weight: '', height: '' });
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
  const [showGame, setShowGame] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [collectedCoins, setCollectedCoins] = useState<Coin[]>([]);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameDone, setGameDone] = useState(false);
  const [nextStepAfterGame, setNextStepAfterGame] = useState<number | null>(null);
  const [finalGameCompleted, setFinalGameCompleted] = useState(false);
  const gameIntervalRef = useRef<number | null>(null);
  const [preGameCountdown, setPreGameCountdown] = useState(PRE_GAME_COUNTDOWN);
  const preGameIntervalRef = useRef<number | null>(null);
  const spawnIndexRef = useRef(0);

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

  const minDistanceForValue = (value: number) => {
    if (value >= 5) return 20;
    if (value >= 4) return 18;
    if (value >= 3) return 16;
    return 14;
  };

  const startGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    setGameRunning(true);
    setGameDone(false);
    const gameStart = Date.now();

    const spawn = () => {
      setCoins((prev) => {
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
        const spawnGrid = [
          { x: 12, y: 28 },
          { x: 32, y: 28 },
          { x: 52, y: 28 },
          { x: 72, y: 28 },
          { x: 12, y: 48 },
          { x: 32, y: 48 },
          { x: 52, y: 48 },
          { x: 72, y: 48 },
          { x: 12, y: 68 },
          { x: 32, y: 68 },
          { x: 52, y: 68 },
          { x: 72, y: 68 },
        ];
        const nextPosition = () => {
          const position = spawnGrid[spawnIndexRef.current % spawnGrid.length];
          spawnIndexRef.current += 1;
          const jitterX = (Math.random() - 0.5) * 6;
          const jitterY = (Math.random() - 0.5) * 6;
          const randomX = Math.random() * 85 + 5;
          const randomY = Math.random() * 60 + 25;
          const baseX = value >= 4 ? randomX : position.x + jitterX;
          const baseY = value >= 4 ? randomY : position.y + jitterY;
          return {
            x: Math.min(92, Math.max(8, baseX)),
            y: Math.min(82, Math.max(24, baseY)),
          };
        };

        const minDistance = minDistanceForValue(value);
        let chosenPosition = nextPosition();
        let attempts = 0;
        while (attempts < 12) {
          const hasOverlap = prev.some((coin) => {
            if (coin.collected) return false;
            const dx = coin.x - chosenPosition.x;
            const dy = coin.y - chosenPosition.y;
            const distance = Math.hypot(dx, dy);
            return distance < Math.max(minDistance, minDistanceForValue(coin.value));
          });
          if (!hasOverlap) break;
          chosenPosition = nextPosition();
          attempts += 1;
        }

        if (attempts >= 12) {
          return prev;
        }

        const newCoin: Coin = {
          id: `${Date.now()}-${Math.random()}`,
          x: chosenPosition.x,
          y: chosenPosition.y,
          value,
          label: chosen.label,
          icon: chosen.icon,
          ttl,
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
      if (Date.now() - gameStart >= GAME_DURATION_MS) {
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
    if (!showGame || gameRunning || gameDone) {
      if (preGameIntervalRef.current) {
        clearInterval(preGameIntervalRef.current);
        preGameIntervalRef.current = null;
      }
      return;
    }

    if (preGameIntervalRef.current) {
      clearInterval(preGameIntervalRef.current);
    }

    preGameIntervalRef.current = window.setInterval(() => {
      setPreGameCountdown((prev) => {
        if (prev <= 1) {
          if (preGameIntervalRef.current) {
            clearInterval(preGameIntervalRef.current);
            preGameIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (preGameIntervalRef.current) {
        clearInterval(preGameIntervalRef.current);
        preGameIntervalRef.current = null;
      }
    };
  }, [gameRunning, gameDone, showGame]);

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
    }
    setShowGame(false);
    setCoins([]);
    setCollectedCoins([]);
    setGameScore(0);
    setGameDone(false);
    setGameRunning(false);
    setNextStepAfterGame(null);
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
          <form onSubmit={handleNutrientSubmit} className="space-y-6">
            {nutrientStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div>
                    <Label>Gender</Label>
                    <Select value={basic.gender} onValueChange={(v) => setBasic(b => ({ ...b, gender: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nickname (optional)</Label>
                    <Input value={basic.nickname} onChange={e => setBasic(b => ({ ...b, nickname: e.target.value }))} placeholder="Nickname" />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input type="number" value={basic.age} onChange={e => setBasic(b => ({ ...b, age: e.target.value }))} placeholder="Enter your age" />
                  </div> */}
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
        </Card>
      </div>

      {showGame && (
        <div className="fixed inset-0 z-40 bg-gradient-to-br from-emerald-900 via-slate-900 to-amber-900">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(251,191,36,0.2),_transparent_60%)]" />
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_40%,rgba(255,255,255,0)_60%)]" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] [background-size:26px_26px]" />
            <div className="absolute top-6 left-6 rounded-full bg-white/80 px-4 py-2 shadow-md text-sm font-semibold text-slate-700">
              Score: {gameScore} gz
            </div>
            {collectedCoins.length > 0 && (
              <div className="absolute top-20 left-6 right-6 z-30 flex flex-wrap items-center justify-start gap-2">
                {collectedCoins.map((coin, index) => (
                  <div
                    key={`${coin.id}-${index}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md border border-emerald-100"
                  >
                    <div className="text-emerald-600 [&>svg]:h-5 [&>svg]:w-5 [&>img]:h-6 [&>img]:w-6">{coin.icon}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!gameRunning && !gameDone && (
            <div className="absolute inset-0 z-40 flex items-end justify-center pb-16 pointer-events-none">
              <div className="flex flex-col items-center gap-5 pointer-events-auto">
                {preGameCountdown > 0 && (
                  <div className="rounded-full border border-emerald-100 bg-white/90 px-6 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
                    Game starts in {preGameCountdown} seconds
                  </div>
                )}
                <Button
                  type="button"
                  onClick={startGame}
                  disabled={preGameCountdown > 0}
                  className="px-8 py-4 text-lg rounded-full disabled:opacity-60"
                >
                  START
                </Button>
              </div>
            </div>
          )}

          <div className="relative w-full h-full overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-20 h-28 pointer-events-none bg-gradient-to-b from-emerald-900/90 via-slate-900/70 to-transparent" />
            {!gameRunning && !gameDone && preGameCountdown > 0 && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="grid w-[90%] max-w-2xl grid-cols-3 gap-6 sm:grid-cols-4">
                  {[...currentGameOptions, ...(unrelatedOptionsByStep[nutrientStep] || [])]
                    .slice(0, 8)
                    .map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center justify-center"
                      >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-emerald-100 bg-white/90 shadow-md">
                          <div className="flex flex-col items-center text-emerald-600 [&>svg]:h-8 [&>svg]:w-8 [&>img]:h-10 [&>img]:w-10">
                            {opt.icon}
                            <span className="text-[10px] font-semibold">{opt.value} gz</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {coins.map((coin) => {
              const size =
                coin.value >= 5 ? 96 : coin.value >= 4 ? 112 : coin.value >= 3 ? 124 : coin.value >= 2 ? 136 : 148;
              const motionName =
                coin.motion === 'float'
                  ? 'floatY'
                  : coin.motion === 'diagonal'
                    ? 'diagonalMove'
                    : coin.motion === 'sweep'
                      ? 'sweepAcross'
                      : 'drift';
              return (
              <button
                key={coin.id}
                onClick={() => handleCoinClick(coin.id, coin.value)}
                className={`absolute flex items-center justify-center rounded-full border border-emerald-100 bg-white/90 shadow-lg transition-all ${
                  coin.collected ? 'scale-0 opacity-0' : 'hover:scale-105'
                }`}
                style={{
                  left: `${coin.x}%`,
                  top: `${coin.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `popIn 0.25s ease-out, ${motionName} ${coin.motionDuration || 2.6}s ease-in-out ${coin.motionDelay || 0}s infinite`,
                  ['--tx' as string]: `${(Math.random() - 0.5) * 120}px`,
                  ['--ty' as string]: `${(Math.random() - 0.5) * 120}px`,
                  ['--dx' as string]: `${(Math.random() - 0.5) * 160}px`,
                  ['--dy' as string]: `${(Math.random() - 0.5) * 160}px`,
                }}
              >
                <div className="flex flex-col items-center text-emerald-600 [&>svg]:h-8 [&>svg]:w-8 [&>img]:h-10 [&>img]:w-10">
                  {coin.icon}
                  <span className="text-[10px] font-semibold">{coin.value} gz</span>
                </div>
              </button>
            );
            })}
          </div>

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
                <Button onClick={handleContinueAfterGame} className="mt-6 w-full">
                  Continue
                </Button>
              </Card>
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
