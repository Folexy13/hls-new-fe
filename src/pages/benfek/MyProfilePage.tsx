import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { benfekService } from '@/services/benfekService';
import { useStore } from '@/store/useStore';
import { Eye, EyeOff, HeartPulse, Lock, Sparkles, UserRound } from 'lucide-react';
import { budgetRangeOptions } from '@/lib/researcher/taxonomy';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const drugFormOptions = ['Tablet', 'Capsule', 'Liquid', 'Powder', 'Gummy', 'Chewable', 'Syrup', 'Drops'];

const getBudgetRangeFromValue = (value?: number | null) => {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return '';
  const numericValue = Number(value);
  return (
    budgetRangeOptions.find((option) => {
      const matches = option.match(/\d+/g);
      if (!matches?.length) return false;
      const max = Number(matches[matches.length - 1]);
      return max === numericValue;
    }) || ''
  );
};

const maskQuizCode = (code?: string | null) => {
  if (!code) return 'Not linked yet';
  if (code.length <= 2) return '*'.repeat(code.length);
  return `${'*'.repeat(Math.max(0, code.length - 2))}${code.slice(-2)}`;
};

const MyProfilePage: React.FC = () => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [showQuizCode, setShowQuizCode] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    preferredPharmacyName: '',
    preferredPharmacyPhone: '',
    benfekName: '',
    benfekAge: '',
    benfekGender: '',
  });
  const [healthForm, setHealthForm] = useState({
    allergies: '',
    scares: '',
    familyCondition: '',
    medications: '',
    hasCurrentCondition: false,
  });
  const [quizForm, setQuizForm] = useState({
    basicNickname: '',
    basicWeight: '',
    basicHeight: '',
    lifestyleHabits: '',
    lifestyleFun: '',
    lifestylePriority: '',
    preferenceDrugForm: '',
    preferenceBudget: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const hydrateForms = (nextProfile: any) => {
    setProfile(nextProfile);
    setPersonalForm({
      firstName: nextProfile?.firstName || '',
      lastName: nextProfile?.lastName || '',
      email: nextProfile?.email || '',
      phone: nextProfile?.phone || '',
      whatsappNumber: nextProfile?.whatsappNumber || '',
      preferredPharmacyName: nextProfile?.preferredPharmacyName || '',
      preferredPharmacyPhone: nextProfile?.preferredPharmacyPhone || '',
      benfekName: nextProfile?.quizCode?.benfekName || nextProfile?.fullName || '',
      benfekAge: nextProfile?.quizCode?.benfekAge || '',
      benfekGender: nextProfile?.quizCode?.benfekGender || '',
    });
    setHealthForm({
      allergies: nextProfile?.quizCode?.health?.allergies || '',
      scares: nextProfile?.quizCode?.health?.scares || '',
      familyCondition: nextProfile?.quizCode?.health?.familyCondition || '',
      medications: nextProfile?.quizCode?.health?.medications || '',
      hasCurrentCondition: Boolean(nextProfile?.quizCode?.health?.hasCurrentCondition),
    });
    setQuizForm({
      basicNickname: nextProfile?.quizCode?.quiz?.basics?.nickname || '',
      basicWeight: nextProfile?.quizCode?.quiz?.basics?.weight || '',
      basicHeight: nextProfile?.quizCode?.quiz?.basics?.height || '',
      lifestyleHabits: nextProfile?.quizCode?.quiz?.lifestyle?.habits || '',
      lifestyleFun: nextProfile?.quizCode?.quiz?.lifestyle?.funActivities || '',
      lifestylePriority: nextProfile?.quizCode?.quiz?.lifestyle?.priority || '',
      preferenceDrugForm: nextProfile?.quizCode?.quiz?.preferences?.drugForm || '',
      preferenceBudget: getBudgetRangeFromValue(nextProfile?.quizCode?.quiz?.preferences?.budget),
    });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const nextProfile = await benfekService.getProfile();
        hydrateForms(nextProfile);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const heading = useMemo(
    () => profile?.quizCode?.benfekName || profile?.fullName || user?.name || 'My Profile',
    [profile, user]
  );

  const savePersonal = async () => {
    setSavingSection('personal');
    try {
      const nextProfile = await benfekService.updateProfile({
        ...personalForm,
      });
      hydrateForms(nextProfile);
      setUser({
        id: String(nextProfile.id),
        email: nextProfile.email,
        name: nextProfile.fullName,
        role: nextProfile.role,
        isAuthenticated: true,
      });
      toast.success('Personal details updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update personal details');
    } finally {
      setSavingSection(null);
    }
  };

  const saveHealth = async () => {
    setSavingSection('health');
    try {
      const nextProfile = await benfekService.updateProfile(healthForm);
      hydrateForms(nextProfile);
      toast.success('Health details updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update health details');
    } finally {
      setSavingSection(null);
    }
  };

  const saveQuiz = async () => {
    setSavingSection('quiz');
    try {
      const nextProfile = await benfekService.updateProfile({
        ...quizForm,
        preferenceBudget: quizForm.preferenceBudget
          ? Number(quizForm.preferenceBudget.match(/\d+/g)?.slice(-1)[0] || 0)
          : undefined,
      });
      hydrateForms(nextProfile);
      toast.success('Quiz preferences updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update quiz data');
    } finally {
      setSavingSection(null);
    }
  };

  const updatePassword = async () => {
    setSavingSection('password');
    try {
      await benfekService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 pt-6 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Benfek Profile</p>
          <h1 className="mt-2 text-3xl font-bold">{heading}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/85">
            Update your contact details, health information, and quiz selections from one place.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className="bg-white/15 text-white hover:bg-white/15">
              <span className="mr-2">Code: {showQuizCode ? profile?.quizCode?.code || 'Not linked yet' : maskQuizCode(profile?.quizCode?.code)}</span>
              {profile?.quizCode?.code && (
                <button
                  type="button"
                  onClick={() => setShowQuizCode((prev) => !prev)}
                  className="inline-flex items-center"
                  aria-label={showQuizCode ? 'Hide benfek code' : 'Show benfek code'}
                >
                  {showQuizCode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              )}
            </Badge>
            <Badge className="bg-white/15 text-white hover:bg-white/15">
              Principal: {profile?.quizCode?.principal?.firstName || 'Pending'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="quiz">Quiz Data</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5 text-emerald-600" /> Personal Details</CardTitle>
                <CardDescription>Keep your profile and WhatsApp contact up to date.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div><Label>First Name</Label><Input value={personalForm.firstName} onChange={(e) => setPersonalForm((s) => ({ ...s, firstName: e.target.value }))} disabled={loading} /></div>
                <div><Label>Last Name</Label><Input value={personalForm.lastName} onChange={(e) => setPersonalForm((s) => ({ ...s, lastName: e.target.value }))} disabled={loading} /></div>
                <div><Label>Email</Label><Input type="email" value={personalForm.email} onChange={(e) => setPersonalForm((s) => ({ ...s, email: e.target.value }))} disabled={loading} /></div>
                <div><Label>WhatsApp Number</Label><Input value={personalForm.whatsappNumber} onChange={(e) => setPersonalForm((s) => ({ ...s, whatsappNumber: e.target.value }))} disabled={loading} placeholder="Update your WhatsApp number" /></div>
                <div><Label>Phone Number</Label><Input value={personalForm.phone} onChange={(e) => setPersonalForm((s) => ({ ...s, phone: e.target.value }))} disabled={loading} /></div>
                <div><Label>Preferred Pharmacy</Label><Input value={personalForm.preferredPharmacyName} onChange={(e) => setPersonalForm((s) => ({ ...s, preferredPharmacyName: e.target.value }))} disabled={loading} placeholder="Enter your preferred pharmacy" /></div>
                <div><Label>Pharmacy Office Phone</Label><Input value={personalForm.preferredPharmacyPhone} onChange={(e) => setPersonalForm((s) => ({ ...s, preferredPharmacyPhone: e.target.value }))} disabled={loading} placeholder="Enter the pharmacy office phone" /></div>
                <div><Label>Display Name</Label><Input value={personalForm.benfekName} onChange={(e) => setPersonalForm((s) => ({ ...s, benfekName: e.target.value }))} disabled={loading} /></div>
                <div><Label>Age</Label><Input value={personalForm.benfekAge} onChange={(e) => setPersonalForm((s) => ({ ...s, benfekAge: e.target.value }))} disabled={loading} /></div>
                <div><Label>Gender</Label><Input value={personalForm.benfekGender} onChange={(e) => setPersonalForm((s) => ({ ...s, benfekGender: e.target.value }))} disabled={loading} /></div>
                <div className="sm:col-span-2">
                  <Button onClick={savePersonal} disabled={loading || savingSection === 'personal'}>
                    {savingSection === 'personal' && <LoadingSpinner className="mr-2" />}
                    {savingSection === 'personal' ? 'Saving...' : 'Save Personal Details'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-rose-500" /> Health Details</CardTitle>
                <CardDescription>Update the health details your researcher uses while recommending packs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Allergies</Label><Textarea value={healthForm.allergies} onChange={(e) => setHealthForm((s) => ({ ...s, allergies: e.target.value }))} disabled={loading} /></div>
                  <div><Label>Current Medications</Label><Textarea value={healthForm.medications} onChange={(e) => setHealthForm((s) => ({ ...s, medications: e.target.value }))} disabled={loading} /></div>
                  <div><Label>Scares / Health Concerns</Label><Textarea value={healthForm.scares} onChange={(e) => setHealthForm((s) => ({ ...s, scares: e.target.value }))} disabled={loading} /></div>
                  <div><Label>Family Condition</Label><Textarea value={healthForm.familyCondition} onChange={(e) => setHealthForm((s) => ({ ...s, familyCondition: e.target.value }))} disabled={loading} /></div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-900">Current Condition</p>
                    <p className="text-sm text-slate-500">Turn this on if you currently have an active health condition.</p>
                  </div>
                  <Switch checked={healthForm.hasCurrentCondition} onCheckedChange={(value) => setHealthForm((s) => ({ ...s, hasCurrentCondition: value }))} />
                </div>
                <Button onClick={saveHealth} disabled={loading || savingSection === 'health'}>
                  {savingSection === 'health' && <LoadingSpinner className="mr-2" />}
                  {savingSection === 'health' ? 'Saving...' : 'Save Health Details'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-500" /> Quiz Preferences</CardTitle>
                <CardDescription>Modify the choices you made during your Benfek quiz.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div><Label>Nickname</Label><Input value={quizForm.basicNickname} onChange={(e) => setQuizForm((s) => ({ ...s, basicNickname: e.target.value }))} disabled={loading} /></div>
                <div><Label>Weight</Label><Input value={quizForm.basicWeight} onChange={(e) => setQuizForm((s) => ({ ...s, basicWeight: e.target.value }))} disabled={loading} /></div>
                <div><Label>Height</Label><Input value={quizForm.basicHeight} onChange={(e) => setQuizForm((s) => ({ ...s, basicHeight: e.target.value }))} disabled={loading} /></div>
                <div>
                  <Label>Preferred Drug Form</Label>
                  <Select
                    value={quizForm.preferenceDrugForm}
                    onValueChange={(value) => setQuizForm((s) => ({ ...s, preferenceDrugForm: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred drug form" />
                    </SelectTrigger>
                    <SelectContent>
                      {drugFormOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2"><Label>Habits</Label><Textarea value={quizForm.lifestyleHabits} onChange={(e) => setQuizForm((s) => ({ ...s, lifestyleHabits: e.target.value }))} disabled={loading} /></div>
                <div className="sm:col-span-2"><Label>Fun Activities</Label><Textarea value={quizForm.lifestyleFun} onChange={(e) => setQuizForm((s) => ({ ...s, lifestyleFun: e.target.value }))} disabled={loading} /></div>
                <div className="sm:col-span-2"><Label>Priority</Label><Textarea value={quizForm.lifestylePriority} onChange={(e) => setQuizForm((s) => ({ ...s, lifestylePriority: e.target.value }))} disabled={loading} /></div>
                <div>
                  <Label>Budget</Label>
                  <Select
                    value={quizForm.preferenceBudget}
                    onValueChange={(value) => setQuizForm((s) => ({ ...s, preferenceBudget: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
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
                <div className="sm:col-span-2">
                  <Button onClick={saveQuiz} disabled={loading || savingSection === 'quiz'}>
                    {savingSection === 'quiz' && <LoadingSpinner className="mr-2" />}
                    {savingSection === 'quiz' ? 'Saving...' : 'Save Quiz Data'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="rounded-[24px] border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-slate-700" /> Security</CardTitle>
                <CardDescription>Reset your password here whenever you need to secure your account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:max-w-xl">
                <div><Label>Current Password</Label><Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((s) => ({ ...s, currentPassword: e.target.value }))} /></div>
                <div><Label>New Password</Label><Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((s) => ({ ...s, newPassword: e.target.value }))} /></div>
                <div><Label>Confirm New Password</Label><Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((s) => ({ ...s, confirmPassword: e.target.value }))} /></div>
                <Button onClick={updatePassword} disabled={savingSection === 'password'}>
                  {savingSection === 'password' && <LoadingSpinner className="mr-2" />}
                  {savingSection === 'password' ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyProfilePage;
