export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  family?: string;
  benefekCode: string;
  budget?: {
    min: number;
    max: number;
  };
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  // Kept for display/search parity with the original researcher app.
  category: string;
  manufacturer?: string;
  strength?: string;
  dosageForm?: string;
  budgetRange?: string;
  expiryDate?: string;
  tags?: Record<string, string[]>;
  rationale?: string;
  imageUrl: string;
  price: number;
}

// Temporary bypass code for the researcher flow (requested).
export const BENEFEK_CODE = "12345";

export const dummyUser: User = {
  id: "user-123",
  name: "Folajimi Aluko",
  email: "folajimi@research.org",
  gender: "Male",
  family: "Aluko",
  benefekCode: BENEFEK_CODE,
  budget: {
    min: 5000,
    max: 15000,
  },
};

// Packs aligned to the Benfek pack cards in `hls-new-fe`.
export const packCategories = [
  { id: "economic", name: "Economic pack" },
  { id: "doctors_choice", name: "Doctor's choice" },
  { id: "premium_offer", name: "premium offer pack" },
];

export const supplements: Supplement[] = [
  {
    id: "sup-1",
    name: "Vitamin D3",
    description: "Essential vitamin for immune function",
    category: "Vitamins",
    manufacturer: "NatureMade",
    dosageForm: "Capsule",
    budgetRange: "1000 - 5000",
    tags: { "hls_factors": ["Immunity", "Vitality"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=D3",
    price: 2500,
  },
  {
    id: "sup-2",
    name: "Omega-3",
    description: "Essential fatty acids for brain health",
    category: "Omega / Oils",
    manufacturer: "Now Foods",
    dosageForm: "Capsule",
    budgetRange: "5000 - 20000",
    tags: { "hls_factors": ["Longevity"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Omega-3",
    price: 3200,
  },
  {
    id: "sup-3",
    name: "Magnesium",
    description: "Essential mineral for energy production",
    category: "Minerals",
    manufacturer: "Solgar",
    dosageForm: "Tablet",
    budgetRange: "1000 - 5000",
    tags: { "hls_factors": ["Quick recovery", "Vitality"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Mg",
    price: 1800,
  },
  {
    id: "sup-4",
    name: "Probiotics",
    description: "Good bacteria for gut health",
    category: "Probiotics",
    manufacturer: "Garden of Life",
    dosageForm: "Capsule",
    budgetRange: "5000 - 20000",
    tags: { "medical.conditions": ["Ulcer"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Pro",
    price: 4500,
  },
  {
    id: "sup-5",
    name: "Zinc",
    description: "Essential mineral for immune function",
    category: "Minerals",
    manufacturer: "Swanson",
    dosageForm: "Tablet",
    budgetRange: "1000 - 5000",
    tags: { "hls_factors": ["Immunity"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Zn",
    price: 1200,
  },
  {
    id: "sup-6",
    name: "Iron",
    description: "Essential mineral for blood health",
    category: "Minerals",
    manufacturer: "Nature's Bounty",
    dosageForm: "Tablet",
    budgetRange: "1000 - 5000",
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Fe",
    price: 1500,
  },
  {
    id: "sup-7",
    name: "Vitamin C",
    description: "Essential vitamin for immune support",
    category: "Vitamins",
    manufacturer: "Sundown Naturals",
    dosageForm: "Chewable",
    budgetRange: "1000 - 5000",
    tags: { "hls_factors": ["Immunity", "Quick recovery"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Vit+C",
    price: 2000,
  },
  {
    id: "sup-8",
    name: "CoQ10",
    description: "Coenzyme for energy production",
    category: "Antioxidants",
    manufacturer: "Qunol",
    dosageForm: "Capsule",
    budgetRange: "5000 - 20000",
    tags: { "hls_factors": ["Vitality", "Age defiance"] },
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=CoQ10",
    price: 6000,
  },
  {
    id: "sup-9",
    name: "B Complex",
    description: "Group of essential B vitamins",
    category: "Vitamins",
    manufacturer: "Thorne",
    dosageForm: "Capsule",
    budgetRange: "5000 - 20000",
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Vit+B",
    price: 2800,
  },
  {
    id: "sup-10",
    name: "Vitamin A",
    description: "Essential vitamin for vision",
    category: "Vitamins",
    manufacturer: "Carlson",
    dosageForm: "Drops",
    budgetRange: "1000 - 5000",
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Vit+A",
    price: 1700,
  },
  {
    id: "sup-11",
    name: "Selenium",
    description: "Essential trace mineral",
    category: "Minerals",
    manufacturer: "Life Extension",
    dosageForm: "Tablet",
    budgetRange: "5000 - 20000",
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Se",
    price: 2300,
  },
  {
    id: "sup-12",
    name: "Fiber",
    description: "Dietary fiber for gut health",
    category: "Digestive Health",
    manufacturer: "Metamucil",
    dosageForm: "Powder",
    budgetRange: "5000 - 20000",
    imageUrl: "https://placehold.co/100x100/6E59A5/FFFFFF?text=Fiber",
    price: 3000,
  },
];

export const getSupplementsByCategory = (category: string) => {
  return supplements.filter((supplement) => supplement.category === category);
};

export const calculatePackBudget = (userBudget: { min: number; max: number }) => {
  if (!userBudget) return null;

  const economicMax = Math.round(userBudget.max);
  const doctorsMax = Math.round(userBudget.max * 1.25);
  const premiumMax = Math.round(userBudget.max * 1.5);

  return {
    economic: {
      min: Math.round(userBudget.min),
      max: economicMax,
    },
    doctors_choice: {
      min: economicMax,
      max: doctorsMax,
    },
    premium_offer: {
      min: doctorsMax,
      max: premiumMax,
    },
  } as const;
};

export const calculateTotalPrice = (items: Supplement[]) => {
  return items.reduce((total, supplement) => total + supplement.price, 0);
};
