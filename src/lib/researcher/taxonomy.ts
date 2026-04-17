export type TagCategory =
  | "demographics.gender"
  | "demographics.age_band"
  | "anthropometrics.bmi_band"
  | "lifestyle.factors"
  | "hls_factors"
  | "medical.organs"
  | "medical.conditions"
  | "medical.current_medications"
  | "medical.allergies"
  | "medical.family_history"
  | "medical.scars"
  | "medical.notes";

export type TagDefinition = {
  id: TagCategory;
  label: string;
  kind: "preset" | "freeform";
  // For preset categories, values show up as suggestions in the UI.
  // Researchers can still add custom values (stored as freeform strings).
  values?: string[];
};

export const hlsFactorOptions = [
  "Immunity",
  "Vitality",
  "Quick recovery",
  "Wealth creation",
  "Longevity",
  "Age defiance",
] as const;

export const genderOptions = ["Male", "Female"] as const;

export const ageBandOptions = ["0-12", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"] as const;

export const bmiBandOptions = [
  "Underweight",
  "Normal",
  "Overweight",
  "Obese Class I",
  "Obese Class II",
  "Obese Class III",
] as const;

// Lifestyle options derived from Benfek quiz (`QuizFormPage.tsx`) lifestyle step options.
export const lifestyleFactorOptions = [
  "Smoking",
  "Drinking",
  "Ice Cream",
  "Fast Food",
  "Sugary Drinks",
  "Late Nights",
  "Meditation",
  "Exercise",
  "Reading",
  "Yoga",
  "Music",
  "Movies",
  "Gaming",
  "Travel",
  "Dancing",
  "Cooking",
  "Sports",
  "Art",
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Weekdays",
  "Weekends",
  "Shift Work",
  "Student",
  "Developer",
  "Teacher",
  "Healthcare",
  "Business",
  "Freelancer",
  "Entrepreneur",
] as const;

export const organOptions = [
  "Heart",
  "Brain",
  "Eyes",
  "Lungs",
  "Liver",
  "Kidneys",
  "Gut",
  "Skin",
  "Bones",
  "Muscles",
  "Blood",
  "Immune system",
  "Hormonal / endocrine",
] as const;

export const medicalConditionOptions = [
  "Hypertension",
  "Diabetes",
  "Glaucoma",
  "Asthma",
  "Ulcer",
  "Arthritis",
  "PCOS",
] as const;

export const currentMedicationOptions = [
  "Metformin",
  "Amlodipine",
  "Lisinopril",
  "Losartan",
  "Omeprazole",
  "Atorvastatin",
  "Insulin",
  "Paracetamol",
  "Ibuprofen",
] as const;

// Derived from Benfek quiz (`QuizFormPage.tsx`) + Principal add-benfek health form fields.
export const researcherTagDefinitions: TagDefinition[] = [
  {
    id: "demographics.gender",
    label: "Gender",
    kind: "preset",
    values: [...genderOptions],
  },
  {
    id: "demographics.age_band",
    label: "Age",
    kind: "preset",
    values: [...ageBandOptions],
  },
  {
    id: "anthropometrics.bmi_band",
    label: "Health condition",
    kind: "preset",
    values: [...bmiBandOptions],
  },
  {
    id: "lifestyle.factors",
    label: "Lifestyle factors",
    kind: "preset",
    values: [...lifestyleFactorOptions],
  },
  {
    id: "hls_factors",
    label: "HLS factors",
    kind: "preset",
    values: [...hlsFactorOptions],
  },
  {
    id: "medical.organs",
    label: "Organs",
    kind: "preset",
    values: [...organOptions],
  },
  {
    id: "medical.conditions",
    label: "Medical conditions",
    kind: "freeform",
    values: [...medicalConditionOptions],
  },
  {
    id: "medical.current_medications",
    label: "Current medications",
    kind: "freeform",
    values: [...currentMedicationOptions],
  },
  {
    id: "medical.allergies",
    label: "Allergies",
    kind: "freeform",
  },
  {
    id: "medical.family_history",
    label: "Family History",
    kind: "freeform",
  },
  {
    id: "medical.scars",
    label: "Scars / Surgery",
    kind: "freeform",
  },
  {
    id: "medical.notes",
    label: "Health Notes",
    kind: "freeform",
  },
];

export const dosageFormOptions = [
  "Tablet",
  "Capsule",
  "Liquid",
  "Powder",
  "Gummy",
  "Chewable",
  "Syrup",
  "Drops",
];

export const budgetRangeOptions = [
  "1000 - 5000",
  "5000 - 20000",
  "20000 - 50000",
  "50000 - 100000",
  "100000 - 500000",
];
