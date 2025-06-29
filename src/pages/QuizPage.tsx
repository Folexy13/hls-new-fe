
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../components/QuizForm';

const QuizPage = () => {
  const [code, setCode] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
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

  const handleQuizComplete = (quizData: any) => {
    console.log('Quiz completed with data:', quizData);
    toast.success('Quiz completed successfully!');
    // Navigate to signup page
    navigate('/auth/signup');
  };

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
