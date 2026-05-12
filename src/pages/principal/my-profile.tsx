import React, { useEffect, useMemo, useRef, useState } from 'react';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '@/store/useStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Bell, Check, ChevronsUpDown, CreditCard, Lock, Upload, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { principalService } from '@/services/principalService';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config/env';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useLocation } from 'react-router-dom';
import { apiClient } from '@/config/axios';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { getApiErrorMessage } from '@/utils/apiError';

type MyProfilePageProps = {
  defaultTab?: 'profile' | 'settings';
};

const healthcareProfessionOptions = [
  'HLS AP',
  'Acupuncturist',
  'Anesthesiologist',
  'Audiologist',
  'Biomedical Engineer',
  'Biomedical Scientist',
  'Cardiologist',
  'Chiropractor',
  'Clinical Officer',
  'Clinical Psychologist',
  'Clinical Research Professional',
  'Community Health Extension Worker',
  'Community Health Officer',
  'Community Health Worker',
  'Dental Hygienist',
  'Dental Technician',
  'Dental Therapist',
  'Dentist',
  'Dermatologist',
  'Dietetic Technician',
  'Dietitian',
  'Emergency Medical Technician',
  'Environmental Health Officer',
  'Epidemiologist',
  'Exercise Physiologist',
  'Family Medicine Physician',
  'Genetic Counselor',
  'Health Administrator',
  'Health Coach',
  'Health Economist',
  'Health Educator',
  'Health Information Manager',
  'Healthcare Manager',
  'Herbal/Traditional Medicine Practitioner',
  'Hospital Administrator',
  'Infection Prevention and Control Practitioner',
  'Licensed Practical Nurse',
  'Medical Doctor',
  'Medical Laboratory Scientist',
  'Medical Laboratory Technician',
  'Medical Physicist',
  'Medical Records Officer',
  'Medical Sales Representative',
  'Mental Health Counselor',
  'Midwife',
  'Nurse',
  'Nurse Anesthetist',
  'Nurse Practitioner',
  'Nutritionist',
  'Occupational Health Practitioner',
  'Occupational Therapist',
  'Ophthalmic Medical Technician',
  'Ophthalmologist',
  'Optician',
  'Optometrist',
  'Orthodontist',
  'Orthopedic Surgeon',
  'Orthotist/Prosthetist',
  'Paramedic',
  'Pathologist',
  'Pediatrician',
  'Pharmaceutical Scientist',
  'Pharmacist',
  'Pharmacy Technician',
  'Physical Therapist',
  'Physician Assistant',
  'Physiotherapist',
  'Podiatrist',
  'Prosthodontist',
  'Psychiatric Technician',
  'Psychiatrist',
  'Psychologist',
  'Public Health Practitioner',
  'Radiation Therapist',
  'Radiographer',
  'Radiologist',
  'Radiologic Technologist',
  'Registered Nurse',
  'Researcher',
  'Respiratory Therapist',
  'Social Worker',
  'Sonographer',
  'Speech and Language Therapist',
  'Speech-Language Pathologist',
  'Surgeon',
  'Surgical Assistant',
  'Surgical Technologist',
  'Veterinarian',
];

const MyProfilePage: React.FC<MyProfilePageProps> = ({ defaultTab = 'profile' }) => {
  const location = useLocation();
  const { user, setUser } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(defaultTab);
  const [openSettingsSection, setOpenSettingsSection] = useState<string | undefined>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [professionOpen, setProfessionOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [accountResolveError, setAccountResolveError] = useState('');
  const [banks, setBanks] = useState<{name: string, code: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastAccountLookupRef = useRef('');

  const [paymentForm, setPaymentForm] = useState({
    preferredPaymentMethod: 'Paystack',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
    profession: '',
    currentPlaceOfWork: '',
    workCityAddress: '',
    licenseNumber: '',
    yearsOfExperience: '',
    referPharmacy: false,
    referredPharmacyName: '',
    referredPharmacyPhone: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const section = params.get('section');

    if (tab === 'profile' || tab === 'settings') {
      setActiveTab(tab);
    }

    if (section) {
      setOpenSettingsSection(section);
    }
  }, [location.search]);

  const hydrateProfile = (principal: any) => {
    setProfileForm({
      firstName: principal?.firstName || '',
      lastName: principal?.lastName || '',
      email: principal?.email || '',
      phone: principal?.phone || '',
      profileImageUrl: principal?.profileImageUrl || '',
      profession: principal?.profession || '',
      currentPlaceOfWork: principal?.currentPlaceOfWork || '',
      workCityAddress: principal?.workCityAddress || '',
      licenseNumber: principal?.licenseNumber || '',
      yearsOfExperience: principal?.yearsOfExperience || '',
      referPharmacy: Boolean(principal?.referPharmacy),
      referredPharmacyName: principal?.referredPharmacyName || '',
      referredPharmacyPhone: principal?.referredPharmacyPhone || '',
    });
    setPaymentForm({
      preferredPaymentMethod: principal?.preferredPaymentMethod || 'Paystack',
      bankName: principal?.bankName || '',
      accountNumber: principal?.accountNumber || '',
      accountName: principal?.accountName || '',
    });
  };

  useEffect(() => {
    const loadPrincipal = async () => {
      try {
        const principal = await principalService.getMe();
        hydrateProfile(principal);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to load principal profile');
      } finally {
        setIsLoading(false);
      }
    };

    const loadBanks = async () => {
      try {
        const response = await apiClient.get('/api/v2/wallet/banks');
        if (response.data?.success && Array.isArray(response.data?.data?.banks)) {
          setBanks(response.data.data.banks);
        }
      } catch (error) {
        console.error('Failed to load banks', error);
      }
    };

    loadPrincipal();
    loadBanks();
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const resolveAccount = async () => {
      const { bankName, accountNumber } = paymentForm;
      const selectedBank = banks.find((bank) => bank.name === bankName);
      const lookupKey = `${selectedBank?.code || bankName}:${accountNumber}`;

      if (!bankName || accountNumber.trim().length !== 10) {
        setResolvingAccount(false);
        return;
      }

      if (paymentForm.accountName.trim() || lookupKey === lastAccountLookupRef.current) {
        return;
      }

      if (banks.length > 0 && !selectedBank) {
        setAccountResolveError('Please choose a valid bank from the list.');
        return;
      }

      if (bankName.trim().length > 2 && accountNumber.trim().length === 10 && selectedBank?.code) {
        lastAccountLookupRef.current = lookupKey;
        setResolvingAccount(true);
        setAccountResolveError('');
        try {
          const response = await apiClient.get(`/api/v2/wallet/resolve-account`, {
            params: { bankName, bankCode: selectedBank?.code, accountNumber }
          });
          if (isMounted && response.data?.success && response.data?.data?.accountName) {
            setPaymentForm(prev => ({ ...prev, accountName: response.data.data.accountName }));
          }
        } catch (error: any) {
          if (isMounted) {
            lastAccountLookupRef.current = '';
            setPaymentForm(prev => ({ ...prev, accountName: '' }));
            setAccountResolveError(getApiErrorMessage(error, 'We could not confirm the account name. Please check the bank and account number, then try again.'));
          }
        } finally {
          if (isMounted) setResolvingAccount(false);
        }
      }
    };

    const timeoutId = setTimeout(resolveAccount, 500); // 500ms debounce
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [banks, paymentForm.bankName, paymentForm.accountNumber, paymentForm.accountName]);

  const initials = useMemo(() => {
    const sourceName = `${profileForm.firstName} ${profileForm.lastName}`.trim() || (user as any)?.name || '';
    const parts = sourceName.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase() || 'DN';
  }, [profileForm.firstName, profileForm.lastName, user]);

  const professionOptions = useMemo(() => {
    const currentProfession = profileForm.profession.trim();
    const hasCurrentProfession = healthcareProfessionOptions.some(
      (profession) => profession.toLowerCase() === currentProfession.toLowerCase()
    );

    return currentProfession && !hasCurrentProfession
      ? [currentProfession, ...healthcareProfessionOptions]
      : healthcareProfessionOptions;
  }, [profileForm.profession]);

  const selectedBank = useMemo(
    () => banks.find((bank) => bank.name === paymentForm.bankName),
    [banks, paymentForm.bankName]
  );

  const saveProfile = async () => {
    try {
      setSavingSection('profile');
      const principal = await principalService.updateMe({
        ...profileForm,
        profileImageUrl: profileForm.profileImageUrl.trim() || undefined,
        referredPharmacyName: profileForm.referPharmacy ? profileForm.referredPharmacyName.trim() : '',
        referredPharmacyPhone: profileForm.referPharmacy ? profileForm.referredPharmacyPhone.trim() : '',
      });
      hydrateProfile(principal);
      setUser({
        id: String(principal.id),
        email: principal.email,
        name: `${principal.firstName} ${principal.lastName}`.trim(),
        role: principal.role,
        isAuthenticated: true,
      });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update principal profile');
    } finally {
      setSavingSection(null);
    }
  };

  const savePersonalInfo = async () => {
    try {
      setSavingSection('personal');
      const principal = await principalService.updateMe({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone.trim() || undefined,
      });
      hydrateProfile(principal);
      setUser({
        id: String(principal.id),
        email: principal.email,
        name: `${principal.firstName} ${principal.lastName}`.trim(),
        role: principal.role,
        isAuthenticated: true,
      });
      toast.success('Personal information updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update personal information');
    } finally {
      setSavingSection(null);
    }
  };

  const saveBankDetails = async () => {
    try {
      setSavingSection('bank-details');
      const principal = await principalService.updateMe({
        preferredPaymentMethod: 'Paystack',
        bankName: paymentForm.bankName,
        accountNumber: paymentForm.accountNumber,
        accountName: paymentForm.accountName,
      });
      hydrateProfile(principal);
      toast.success('Bank account details updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update bank details');
    } finally {
      setSavingSection(null);
    }
  };

  const updatePassword = async () => {
    if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Please ensure the new passwords match');
      return;
    }

    try {
      setSavingSection('password');
      await principalService.updateMe({ password: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setSavingSection(null);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'principal-profiles');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url || null;
    } catch (error) {
      console.error('Failed to upload principal image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadImageToCloudinary(file);
    if (!imageUrl) return;

    try {
      setSavingSection('image');
      const principal = await principalService.updateMe({ profileImageUrl: imageUrl });
      hydrateProfile(principal);
      toast.success('Profile image updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save profile image');
    } finally {
      setSavingSection(null);
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[70px]">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'profile' | 'settings')} className="w-full">
        <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 space-y-3">
            <BackToDashboardButton className="text-black/90 hover:text-black/80" />
            <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-2 pt-1">
          <TabsContent value="profile">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Update your personal and professional details.</p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveProfile();
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden text-slate-500 font-semibold">
                        {profileForm.profileImageUrl ? (
                          <img src={profileForm.profileImageUrl} alt="Principal profile" className="h-full w-full object-cover" />
                        ) : (
                          initials
                        )}
                      </div>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          disabled={isUploadingImage || savingSection === 'image'}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {(isUploadingImage || savingSection === 'image') && <LoadingSpinner className="mr-2" />}
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploadingImage || savingSection === 'image' ? 'Uploading...' : 'Change Image'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                      <Input
                        value={`${profileForm.firstName} ${profileForm.lastName}`.trim()}
                        onChange={(e) => {
                          const parts = e.target.value.split(/\s+/).filter(Boolean);
                          setProfileForm((prev) => ({
                            ...prev,
                            firstName: parts[0] || '',
                            lastName: parts.slice(1).join(' '),
                          }));
                        }}
                        placeholder="Enter principal name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                      <Popover open={professionOpen} onOpenChange={setProfessionOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={professionOpen}
                            className="h-10 w-full justify-between border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 shadow-sm hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                          >
                            <span className={cn('truncate', !profileForm.profession && 'text-slate-500')}>
                              {profileForm.profession || 'Search or select profession'}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search healthcare profession..." />
                            <CommandList className="max-h-72 overflow-y-auto">
                              <CommandEmpty>No profession found.</CommandEmpty>
                              <CommandGroup>
                                {professionOptions.map((profession) => (
                                  <CommandItem
                                    key={profession}
                                    value={profession}
                                    onSelect={() => {
                                      setProfileForm((prev) => ({ ...prev, profession }));
                                      setProfessionOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        profileForm.profession === profession ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <span>{profession}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Place of Work</label>
                      <Input value={profileForm.currentPlaceOfWork} onChange={(e) => setProfileForm((prev) => ({ ...prev, currentPlaceOfWork: e.target.value }))} placeholder="Enter current place of work" />
                    </div>

                    <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={profileForm.referPharmacy}
                          onChange={(e) => {
                            const referPharmacy = e.target.checked;
                            setProfileForm((prev) => ({
                              ...prev,
                              referPharmacy,
                              referredPharmacyName: referPharmacy ? prev.referredPharmacyName : '',
                              referredPharmacyPhone: referPharmacy ? prev.referredPharmacyPhone : '',
                            }));
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        Refer Pharmacy
                      </label>

                      {profileForm.referPharmacy && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Referred Pharmacy Name</label>
                            <Input
                              value={profileForm.referredPharmacyName}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, referredPharmacyName: e.target.value }))}
                              placeholder="Enter pharmacy name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Phone</label>
                            <Input
                              value={profileForm.referredPharmacyPhone}
                              onChange={(e) => setProfileForm((prev) => ({ ...prev, referredPharmacyPhone: e.target.value }))}
                              placeholder="Enter pharmacy phone"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Work City Address</label>
                      <Input value={profileForm.workCityAddress} onChange={(e) => setProfileForm((prev) => ({ ...prev, workCityAddress: e.target.value }))} placeholder="Enter work city address" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <Input value={profileForm.licenseNumber} onChange={(e) => setProfileForm((prev) => ({ ...prev, licenseNumber: e.target.value }))} placeholder="Enter license number" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      <Input value={profileForm.yearsOfExperience} onChange={(e) => setProfileForm((prev) => ({ ...prev, yearsOfExperience: e.target.value }))} placeholder="Enter years of experience" />
                    </div>

                    <Button type="submit" disabled={savingSection === 'profile'}>
                      {savingSection === 'profile' && <LoadingSpinner className="mr-2" />}
                      {savingSection === 'profile' ? 'Saving Profile...' : 'Save Profile'}
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <div className="p-6">
                <Accordion
                  type="single"
                  collapsible
                  value={openSettingsSection}
                  onValueChange={setOpenSettingsSection}
                  className="space-y-2"
                >
                  <AccordionItem value="personal" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        <form
                          className="space-y-4"
                          onSubmit={(e) => {
                            e.preventDefault();
                            savePersonalInfo();
                          }}
                        >
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                              <Input id="firstName" value={profileForm.firstName} onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))} />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                              <Input id="lastName" value={profileForm.lastName} onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))} />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <Input id="email" type="email" value={profileForm.email} onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))} />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input id="phone" value={profileForm.phone} onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Add phone number" />
                          </div>
                          <Button type="submit" disabled={savingSection === 'personal'}>
                            {savingSection === 'personal' && <LoadingSpinner className="mr-2" />}
                            {savingSection === 'personal' ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </form>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payments" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Methods</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <div className="space-y-3 rounded-md border p-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <Popover open={bankOpen} onOpenChange={setBankOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={bankOpen}
                                  className="h-10 w-full justify-between border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 shadow-sm hover:bg-white focus-visible:ring-0 focus-visible:ring-offset-0"
                                >
                                  <span className={cn('truncate', !paymentForm.bankName && 'text-slate-500')}>
                                    {paymentForm.bankName || 'Search or select bank'}
                                  </span>
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                  <CommandInput placeholder="Search bank name..." />
                                  <CommandList className="max-h-72 overflow-y-auto">
                                    <CommandEmpty>No bank found.</CommandEmpty>
                                    <CommandGroup>
                                      {banks.map((bank) => (
                                        <CommandItem
                                          key={bank.code}
                                          value={bank.name}
                                          onSelect={() => {
                                            setPaymentForm((prev) => ({ ...prev, bankName: bank.name, accountName: '' }));
                                            setAccountResolveError('');
                                            setBankOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              selectedBank?.code === bank.code ? 'opacity-100' : 'opacity-0'
                                            )}
                                          />
                                          <span>{bank.name}</span>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <Input
                              value={paymentForm.accountNumber}
                              onChange={(e) => {
                                const accountNumber = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                setPaymentForm((prev) => ({ ...prev, accountNumber, accountName: '' }));
                                setAccountResolveError('');
                              }}
                              placeholder="Enter 10-digit account number"
                            />
                          </div>
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                            <Input 
                              value={paymentForm.accountName} 
                              readOnly={true} 
                              onChange={(e) => setPaymentForm((prev) => ({ ...prev, accountName: e.target.value }))} 
                              placeholder={resolvingAccount ? "Resolving..." : ""} 
                              className="bg-gray-50 opacity-90 cursor-not-allowed" 
                            />
                            {resolvingAccount && (
                              <div className="absolute right-3 top-[34px]">
                                <LoadingSpinner className="h-4 w-4 text-blue-500" />
                              </div>
                            )}
                            {accountResolveError && (
                              <p className="mt-1 text-xs text-red-600">{accountResolveError}</p>
                            )}
                          </div>
                          <Button type="button" onClick={saveBankDetails} disabled={savingSection === 'bank-details' || resolvingAccount || !paymentForm.accountName} className="bg-emerald-600 text-white hover:bg-emerald-700">
                            {savingSection === 'bank-details' && <LoadingSpinner className="mr-2" />}
                            {savingSection === 'bank-details' ? 'Saving...' : 'Update Bank Account Details'}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="security" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Lock className="h-5 w-5" />
                        <span>Security</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          updatePassword();
                        }}
                      >
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <Input id="currentPassword" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} placeholder="Enter current password" />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <Input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} placeholder="Enter new password" />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirm new password" />
                        </div>
                        <Button type="submit" disabled={savingSection === 'password'}>
                          {savingSection === 'password' && <LoadingSpinner className="mr-2" />}
                          {savingSection === 'password' ? 'Updating...' : 'Update Password'}
                        </Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Email updates and reports
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Benfek registration alerts
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          <input type="checkbox" className="h-4 w-4" />
                          Product and order notifications
                        </label>
                        <Button type="button">Save Notification Preferences</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="complaints" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Make Complaints</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="complaintSubject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                          <Input id="complaintSubject" placeholder="Short summary" />
                        </div>
                        <div>
                          <label htmlFor="complaintMessage" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                          <Textarea id="complaintMessage" placeholder="Describe the issue..." />
                        </div>
                        <Button variant="outline" type="button">Submit Complaint</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MyProfilePage;
