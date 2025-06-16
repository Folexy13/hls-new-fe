
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';

const QuizPage = () => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState('');
  const [showNutrientForm, setShowNutrientForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCodeSubmit = () => {
    // Mock code validation
    if (code === 'HLS2024') {
      setShowCodeDialog(false);
      setShowNutrientForm(true);
      toast.success('Code verified! Please fill out the nutrient form.');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const handleNutrientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNutrientForm(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment Quiz</h1>
          <p className="text-lg text-gray-600">Take our comprehensive health quiz to get personalized recommendations</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Enter your quiz code to begin the assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">Start Quiz</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Quiz Code</DialogTitle>
                  <DialogDescription>Please enter your unique quiz code to proceed</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter quiz code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <Button onClick={handleCodeSubmit} className="w-full">
                    Verify Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Nutrient Form Modal */}
        <Dialog open={showNutrientForm} onOpenChange={setShowNutrientForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nutrient Assessment Form</DialogTitle>
              <DialogDescription>Please fill out your health and nutrient information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNutrientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" placeholder="Enter height" />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" placeholder="Enter weight" />
                </div>
                <div>
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very-active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="goal">Health Goal</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="general-health">General Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Complete Assessment
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assessment Complete!</DialogTitle>
              <DialogDescription>
                Your health assessment has been completed successfully. You can now proceed to create your account.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full">
              Continue to Sign Up
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuizPage;
