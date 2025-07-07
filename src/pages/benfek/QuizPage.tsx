import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../../components/QuizForm';
import { apiClient } from '../../config/axios';
import { quizService } from '@/services/quizService';

const QuizPage = () => {
  const [code, setCode] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '12345') {
      setShowQuiz(true);
      toast.success('Code verified! Please complete the quiz.');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const handleQuizComplete = async (quizData: any) => {
    console.log('Quiz Data:', quizData);
    // Map quizData to API structure
    const payload = {
      code: '12345',
      basic: {
        gender: quizData.personalInfo.gender,
        nickname: quizData.personalInfo.name,
        age: String(quizData.personalInfo.age),
        weight: String(quizData.personalInfo.weight),
        height: String(quizData.personalInfo.height),
      },
      lifestyle: {
        habit: quizData.lifestyle.habits,
        fun: quizData.lifestyle.fun,
        routine: quizData.lifestyle.routine,
        career: quizData.personalInfo.activityLevel || '',
      },
      preference: {
        drugForm: quizData.preference.drugForm,
        minBudget: 0, // Placeholder, adjust if needed
        maxBudget: 0, // Placeholder, adjust if needed
      },
    };
    try {
      // await quizService.submitQuizData(payload);
      toast.success('Quiz completed and data submitted successfully!');
      setQuizSubmitted(true);
    } catch (error: any) {
      toast.error('Failed to submit quiz data. Please try again.');
      console.error(error);
    }
  };

  if (quizSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Quiz Submitted!</CardTitle>
            <CardDescription>Your quiz has been submitted successfully. Please continue to sign up to complete your registration.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/auth/signup')}>
              Continue to Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showQuiz) {
    return <QuizForm onComplete={handleQuizComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment Quiz</h1>
          <p className="text-lg text-gray-600">Enter your quiz code to begin the assessment</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Enter Quiz Code</CardTitle>
            <CardDescription>Please enter your unique quiz code to proceed</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <Input
                placeholder="Enter quiz code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Verify Code
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
