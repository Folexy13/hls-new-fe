import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { quizService } from '@/services/quizService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AddBenfekPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    allergies: '',
    scares: '',
    familyCondition: '',
    medications: '',
    hasCurrentCondition: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm({ ...form, hasCurrentCondition: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Please enter the benfek name');
      return;
    }
    
    if (!form.phone.trim()) {
      toast.error('Please enter the benfek phone number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await quizService.createQuizCode({
        benfekName: form.name,
        benfekPhone: form.phone,
        allergies: form.allergies || undefined,
        scares: form.scares || undefined,
        familyCondition: form.familyCondition || undefined,
        medications: form.medications || undefined,
        hasCurrentCondition: form.hasCurrentCondition,
      });
      
      setGeneratedCode(result.code);
      setShowSuccessDialog(true);
      toast.success('Quiz code generated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create quiz code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setForm({
      name: '',
      phone: '',
      allergies: '',
      scares: '',
      familyCondition: '',
      medications: '',
      hasCurrentCondition: false
    });
    setGeneratedCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/principal')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Add New Benfek</CardTitle>
            <CardDescription>
              Fill in the benfek's details to generate a unique quiz code for them
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Required Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                  Required Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-red-600">* Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter benfek's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-red-600">* Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
                  Health Information (Optional)
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={form.allergies}
                      onChange={handleChange}
                      placeholder="List any allergies (separate with commas)"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scares">Health Concerns</Label>
                    <Textarea
                      id="scares"
                      name="scares"
                      value={form.scares}
                      onChange={handleChange}
                      placeholder="What health issues concern them the most?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="familyCondition">Family Health History</Label>
                    <Textarea
                      id="familyCondition"
                      name="familyCondition"
                      value={form.familyCondition}
                      onChange={handleChange}
                      placeholder="Notable family health conditions"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea
                      id="medications"
                      name="medications"
                      value={form.medications}
                      onChange={handleChange}
                      placeholder="List current medications (separate with commas)"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="hasCurrentCondition" className="font-medium">
                        Has Current Health Condition?
                      </Label>
                      <p className="text-sm text-gray-500">
                        Does the benfek have any ongoing health conditions?
                      </p>
                    </div>
                    <Switch
                      id="hasCurrentCondition"
                      checked={form.hasCurrentCondition}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/principal')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Generate Quiz Code
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center">Quiz Code Generated!</DialogTitle>
            <DialogDescription className="text-center">
              Share this code with <strong>{form.name}</strong> so they can complete their health assessment and create their account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg">
              <span className="text-2xl font-mono font-bold tracking-widest text-gray-800">
                {generatedCode}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2"
              >
                {copied ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Instructions for the Benfek:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to the registration page</li>
                <li>Select "Benfek" as the account type</li>
                <li>Enter this quiz code when prompted</li>
                <li>Complete the health assessment</li>
                <li>Create their account</li>
              </ol>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseDialog}
              >
                Add Another
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate('/principal')}
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddBenfekPage;
