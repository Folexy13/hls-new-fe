export const HEALTH_FIELD_OPTIONS = {
  allergies: ['Peanuts', 'Dust', 'Seafood', 'Dairy', 'Eggs', 'Penicillin', 'Pollen'],
  scares: ['Hypertension episode', 'Asthma attack', 'Fainting spell', 'High blood sugar', 'Seizure episode'],
  familyCondition: ['Diabetes', 'Hypertension', 'Asthma', 'Sickle cell', 'Heart disease'],
  medications: ['Vitamin D', 'Omega-3', 'Paracetamol', 'Metformin', 'Lisinopril'],
  currentConditions: ['Asthma', 'Hypertension', 'Diabetes', 'Ulcer', 'Arthritis'],
  lifestyle: ['Smoking', 'Drinking', 'Exercise', 'Yoga', 'Reading', 'Better Sleep', 'Stress Balance', 'Energy Cultivation'],
  preferences: ['Tablet', 'Capsule', 'Liquid', 'Powder', 'Gummy', 'Chewable', 'Syrup', 'Drops'],
} as const;

export const emptyContentTags = {
  allergies: [],
  scares: [],
  familyCondition: [],
  medications: [],
  currentConditions: [],
  lifestyle: [],
  preferences: [],
};
