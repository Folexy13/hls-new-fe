import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  UserPlus, HeartPulse, CheckCircle, Upload, X,
  Info, AlertCircle, Mail, Check, ChevronDown, Plus
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/config/axios';
import { toast } from 'sonner';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Define form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  age: z.string().min(1, { message: 'Age is required.' }),
  gender: z.string().min(1, { message: 'Please select a gender.' }),
  weight: z.string().min(1, { message: 'Weight is required.' }),
  height: z.string().min(1, { message: 'Height is required.' }),
  allergies: z.array(z.string()).optional(),
  scares: z.array(z.string()).optional(),
  familyCondition: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  hasCurrentCondition: z.array(z.string()).optional(),
  // specialty: z.string().min(1, { message: 'Please select a specialty.' }),
  // licenseNumber: z.string().min(5, { message: 'License number must be at least 5 characters.' }),
  // address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  // city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  // state: z.string().min(2, { message: 'State must be at least 2 characters.' }),
  // bio: z.string().optional(),
  // commissionRate: z.string().min(1, { message: 'Please select a commission rate.' }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

const HEALTH_FIELD_OPTIONS = {
  allergies: ['Peanuts', 'Dust', 'Seafood', 'Dairy', 'Eggs', 'Penicillin', 'Pollen'],
  scares: ['Hypertension episode', 'Asthma attack', 'Fainting spell', 'High blood sugar', 'Seizure episode'],
  familyCondition: ['Diabetes', 'Hypertension', 'Asthma', 'Sickle cell', 'Heart disease'],
  medications: ['Vitamin D', 'Omega-3', 'Paracetamol', 'Metformin', 'Lisinopril'],
  hasCurrentCondition: ['Asthma', 'Hypertension', 'Diabetes', 'Ulcer', 'Arthritis'],
} as const;

type MultiSelectCreatableProps = {
  label: string;
  placeholder: string;
  description?: string;
  value: string[];
  options: readonly string[];
  onChange: (nextValue: string[]) => void;
};

const MultiSelectCreatableField: React.FC<MultiSelectCreatableProps> = ({
  label,
  placeholder,
  description,
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedSelected = value ?? [];
  const normalizedOptions = Array.from(new Set([...options, ...normalizedSelected])).sort((a, b) => a.localeCompare(b));
  const trimmedQuery = query.trim();
  const canCreate = trimmedQuery.length > 0 && !normalizedOptions.some((option) => option.toLowerCase() === trimmedQuery.toLowerCase());

  const toggleValue = (item: string) => {
    if (normalizedSelected.includes(item)) {
      onChange(normalizedSelected.filter((selectedItem) => selectedItem !== item));
      return;
    }

    onChange([...normalizedSelected, item]);
  };

  const createOption = () => {
    if (!canCreate) return;
    onChange([...normalizedSelected, trimmedQuery]);
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="min-h-10 w-full justify-between bg-gray-100 px-3 py-2 text-left font-normal text-slate-700 hover:bg-gray-100"
            aria-label={open ? `Close ${label} options` : `Open ${label} options`}
          >
            <span className="truncate">
              {normalizedSelected.length > 0 ? `${normalizedSelected.length} selected` : placeholder}
            </span>
            {open ? (
              <X className="h-4 w-4 shrink-0 opacity-70" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search or add ${label.toLowerCase()}`}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>
                {canCreate ? 'Press the create row below to add this option.' : 'No matching options.'}
              </CommandEmpty>
              <CommandGroup>
                {normalizedOptions
                  .filter((option) => option.toLowerCase().includes(trimmedQuery.toLowerCase()))
                  .map((option) => {
                    const isSelected = normalizedSelected.includes(option);

                    return (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => toggleValue(option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                      </CommandItem>
                    );
                  })}
                {canCreate && (
                  <CommandItem onSelect={createOption} className="gap-2 text-emerald-700">
                    <Plus className="h-4 w-4" />
                    <span>Create "{trimmedQuery}"</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {normalizedSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {normalizedSelected.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <span>{item}</span>
              <button
                type="button"
                className="rounded-full text-emerald-700/80 hover:text-emerald-900"
                onClick={() => toggleValue(item)}
                aria-label={`Remove ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {description && <FormDescription>{description}</FormDescription>}
    </div>
  );
};

const AddBenfekPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSentModal, setShowSentModal] = useState(false);
  const [manualStep, setManualStep] = useState(0);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      weight: '',
      height: '',
      allergies: [],
      scares: [],
      familyCondition: [],
      medications: [],
      hasCurrentCondition: [],
      // specialty: '',
      // licenseNumber: '',
      // address: '',
      // city: '',
      // state: '',
      // bio: '',
      // commissionRate: '',
      termsAccepted: false,
    },
  });
  const isDirty = form.formState.isDirty || !!uploadedFile;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const benfekName = `${values.firstName} ${values.lastName}`.trim();
      const conditionDetails = (values.hasCurrentCondition ?? []).filter(Boolean).join(', ');

      const payload = {
        // API expects these names
        benfekName,
        benfekEmail: values.email,
        benfekPhone: values.phone,
        benfekAge: values.age,
        benfekGender: values.gender,
        benfekWeight: values.weight,
        benfekHeight: values.height,
        allergies: values.allergies?.length ? values.allergies : undefined,
        familyCondition: values.familyCondition?.length ? values.familyCondition : undefined,
        medications: values.medications?.length ? values.medications : undefined,
        scares: values.scares?.length ? values.scares : undefined,
        currentConditions: values.hasCurrentCondition?.length ? values.hasCurrentCondition : undefined,
        hasCurrentCondition: conditionDetails.length > 0,
      };
      try {
        await apiClient.post('/api/v2/quiz-code/create', payload);
      } catch (err: any) {
        // Some backends expose a different route name. Try a sensible fallback.
        if (err?.response?.status === 404) {
          await apiClient.post('/api/v2/quiz-code/generate', payload);
        } else {
          throw err;
        }
      }

      setIsSuccess(true);
      setShowSentModal(true);
      sessionStorage.setItem('benfeksNeedsRefresh', '1');

      // Clear form immediately after a successful add
      form.reset();
      setManualStep(0);
      setUploadedFile(null);
    } catch (error: any) {
      console.error('Failed to create benfek:', error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to add benfek.';
      setFormError('Failed to add benfek.');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualNext = async () => {
    const isValid = await form.trigger(['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'weight', 'height']);
    if (isValid) {
      setManualStep(1);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Handle bulk upload submission
  const handleBulkUpload = () => {
    if (!uploadedFile) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setUploadedFile(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-24">
      <Dialog open={showSentModal} onOpenChange={setShowSentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quiz code sent</DialogTitle>
            <DialogDescription>
              Quiz code has been sent to the WhatsApp and email of the added benfek.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Page Header */}
      {/* <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <BackToDashboardButton isDirty={isDirty} className="mb-4 text-white/80 hover:text-white" />
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300 font-semibold">Create Quiz</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Add a Benfek</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
                Generate a unique quiz code and invite a benfek to complete their health assessment.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 border border-white/10">
              <div className="h-10 w-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ready to create</p>
                <p className="text-xs text-slate-300">Takes less than 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Fixed header background so scrolling content never shows between the back button and the tabs. */}
      <div className="fixed left-0 right-0 top-[65px] z-30 h-[78px] bg-gray-50" />

      <div className="fixed left-0 right-0 top-[65px] z-30 bg-transparent px-3 pt-2">
        <BackToDashboardButton
          isDirty={isDirty}
          className="text-black/90 hover:text-black/80"
        />
      </div>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 sm:pt-14 lg:px-8 lg:pt-14 sm:pb-8">
        {isSuccess ? (
          <Card className="max-w-3xl mx-auto">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Benfek Added Successfully
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                The benfek has been added to your network successfully. They will
                receive an email with instructions to set up their account.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button onClick={() => setIsSuccess(false)}>
                  Add Another Benfek
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/principal/benfeks', { state: { refresh: true } })}
                >
                  View All Benfeks
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">
            <div>
              <Tabs
                defaultValue="manual"
                value={activeTab}
                onValueChange={setActiveTab}
                className="max-w-3xl mx-auto"
              >
                <TabsList className="grid grid-cols-2 w-[92vw] bg-white shadow-sm border border-slate-200 fixed top-[104px] left-1/2 -translate-x-1/2 z-30">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                </TabsList>

                {/* Manual Entry Tab */}
                <TabsContent value="manual" className="mt-0">
                  <Card className="border border-slate-200 shadow-sm">
                    <div className="p-6 border-b bg-white">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {manualStep === 0 ? (
                          <>
                            <UserPlus className="h-5 w-5 mr-2 text-emerald-500" />
                            Basic Details
                          </>
                        ) : (
                          <>
                            <HeartPulse className="h-5 w-5 mr-2 text-emerald-500" />
                            Health Factors
                          </>
                        )}
                      </h3>
                      {manualStep === 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Add any current health condition and other health factors that may affect recommendations.
                        </p>
                      )}
                    </div>

                    <div className="p-4 sm:p-6 bg-white">
                      {formError && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {formError}
                        </div>
                      )}
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          {manualStep === 0 && (
                            <div>
                              {/* <h4 className="text-md font-medium text-gray-900 mb-4">
                                Basic Details
                              </h4> */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                              <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' placeholder="+234 123 456 7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' placeholder="e.g. 32" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-gray-100">
                                          <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' type="number" placeholder="e.g. 70" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                      <Input className='bg-gray-100' type="number" placeholder="e.g. 170" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              </div>
                              <div className="mt-6 flex justify-end">
                                <Button type="button" onClick={handleManualNext}>
                                  Next
                                </Button>
                              </div>
                            </div>
                          )}

                          {manualStep === 1 && (
                            <div>
                              <div className="mb-4">
                                <FormField
                                  control={form.control}
                                  name="hasCurrentCondition"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <MultiSelectCreatableField
                                          label="Current Health Condition"
                                          placeholder="Select or add current health conditions"
                                          options={HEALTH_FIELD_OPTIONS.hasCurrentCondition}
                                          value={field.value ?? []}
                                          onChange={field.onChange}
                                          description="Select every ongoing condition that applies, or create a new one."
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                              <FormField
                                control={form.control}
                                name="allergies"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <MultiSelectCreatableField
                                        label="Allergies"
                                        placeholder="Select or add allergies"
                                        options={HEALTH_FIELD_OPTIONS.allergies}
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="scares"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <MultiSelectCreatableField
                                        label="Health Scares"
                                        placeholder="Select or add health scares"
                                        options={HEALTH_FIELD_OPTIONS.scares}
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="familyCondition"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <MultiSelectCreatableField
                                        label="Family Condition"
                                        placeholder="Select or add family conditions"
                                        options={HEALTH_FIELD_OPTIONS.familyCondition}
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="medications"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <MultiSelectCreatableField
                                        label="Medications"
                                        placeholder="Select or add medications"
                                        options={HEALTH_FIELD_OPTIONS.medications}
                                        value={field.value ?? []}
                                        onChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              </div>
                            </div>
                          )}

                          {manualStep === 1 && (
                            <>
                              {/* Terms and Conditions */}
                              <FormField
                                control={form.control}
                                name="termsAccepted"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel>
                                        I confirm that I have permission to add this benfek to the network
                                      </FormLabel>
                                      <FormDescription>
                                        By checking this box, you confirm that you have obtained consent from the benfek to add them to your network.
                                      </FormDescription>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex items-center justify-between gap-3">
                                <Button type="button" variant="outline" onClick={() => setManualStep(0)}>
                                  Back
                                </Button>
                                <Button
                                  type="submit"
                                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting && <LoadingSpinner className="mr-2" />}
                                  {isSubmitting ? "Processing..." : "Add Benfek"}
                                </Button>
                              </div>
                            </>
                          )}
                        </form>
                      </Form>
                    </div>
                  </Card>
                </TabsContent>

                {/* Bulk Upload Tab */}
                <TabsContent value="bulk" className="mt-0">
                  <Card className="border border-slate-200 shadow-sm">
                    <div className="p-6 border-b bg-white">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Upload className="h-5 w-5 mr-2 text-emerald-500" />
                        Bulk Upload Benfeks
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a CSV file containing multiple benfeks to add them all at once.
                      </p>
                    </div>

                    <div className="p-4 sm:p-6 bg-white">
                      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-blue-800 font-medium">CSV Format Instructions</h4>
                          <p className="text-blue-700 text-sm mt-1">
                            Your CSV file should include the following columns:
                            firstName, lastName, email, phone, age, gender, specialty,
                            licenseNumber, address, city, state, commissionRate.
                          </p>
                        </div>
                      </div>

                      {!uploadedFile ? (
                        <div
                          className={`border-2 border-dashed rounded-md p-8 mb-6 text-center ${
                            dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
                          }`}
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                        >
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-700 font-medium">Drag and drop CSV here</p>
                          <input
                            type="file"
                            id="file-upload"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Browse Files
                          </Button>
                        </div>
                      ) : (
                        <div className="border rounded-md p-4 mb-6 flex items-center justify-between">
                          <div className="flex items-center">
                             <Upload className="h-5 w-5 text-gray-500 mr-3" />
                             <span>{uploadedFile.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      <Button
                        className="w-full"
                        onClick={handleBulkUpload}
                        disabled={!uploadedFile || isSubmitting}
                      >
                        {isSubmitting && <LoadingSpinner className="mr-2" />}
                        {isSubmitting ? "Processing..." : "Upload and Process"}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Card */}
            {/* <Card className="h-fit border border-slate-200 shadow-sm bg-white">
              <div className="p-6 border-b">
                <h3 className="text-base font-semibold text-gray-900">What happens next</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Quiz code generated</p>
                    <p className="text-xs text-gray-500">Share immediately with the benfek.</p>
                  </div>
                </div>
              </div>
            </Card> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBenfekPage;
