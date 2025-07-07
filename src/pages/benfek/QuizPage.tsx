import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QuizPage = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Redirect to homepage where the quiz modal is implemented
    navigate('/');
    // The homepage will handle showing the quiz modal
    window.sessionStorage.setItem('showQuizModal', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment Quiz</h1>
          <p className="text-lg text-gray-600">Complete our health assessment to get personalized supplement recommendations</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Start Your Health Assessment</CardTitle>
            <CardDescription>
              This quiz will help us understand your health needs and create a personalized supplement plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                The assessment takes about 5 minutes to complete and covers:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Basic personal information</li>
                <li>Lifestyle habits and preferences</li>
                <li>Health goals and concerns</li>
                <li>Supplement preferences</li>
              </ul>
              <Button onClick={handleStartQuiz} className="w-full mt-4">
                Begin Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
