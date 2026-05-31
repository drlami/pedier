import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Hepatitis A
 * Focus: Supportive care, coagulopathy monitoring, isolation.
 */
export const wardHepatitisAProtocol: DiseaseProtocol = {
  id: 'ward-hepatitis-a',
  name: 'Hepatitis A: Ward Management',
  system: 'Gastrointestinal',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Management of acute HAV infection: Monitoring for rare fulminant failure and ensuring public health compliance.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Acute viral hepatitis approach"
  },
  questions: [],

  mmpData: {
    stages: [
      {
        label: "Diagnosis & Isolation",
        shortLabel: "Diagnosis & Isolation",
        color: "blue",
        cards: [
          {
            title: "Confirmatory Testing",
            instructions: [
              "1. Anti-HAV IgM: Positive confirms acute infection.",
              "2. Liver Profile: Expect ALT/AST > 1000 U/L in acute phase.",
              "3. Public Health: MANDATORY notification to local health authorities."
            ]
          },
          {
            title: "Infection Control",
            isCritical: true,
            instructions: [
              "1. Contact Precautions: Required for at least 1 week after onset of jaundice.",
              "2. Hand Hygiene: Strict enforcement (fecal-oral transmission)."
            ]
          }
        ]
      },
      {
        label: "Monitoring for Fulminant Failure",
        shortLabel: "Monitoring for Fulminant Failure",
        color: "red",
        cards: [
          {
            title: "The 'Failure' Watch",
            isCritical: true,
            instructions: [
              "Hepatitis A is usually self-limiting, but < 1% develop Acute Liver Failure.",
              "1. PT/INR: Check every 24-48 hours. If INR > 1.5, escalate care.",
              "2. Mental Status: Watch for irritability or lethargy (Encephalopathy).",
              "3. Glucose: Watch for hypoglycemia."
            ]
          }
        ]
      },
      {
        label: "Supportive Care",
        shortLabel: "Supportive Care",
        color: "amber",
        cards: [
          {
            title: "Symptom Management",
            instructions: [
              "1. Activity: Rest as tolerated; no forced bed rest.",
              "2. Nutrition: High calorie, small frequent meals. Low fat may be better tolerated if nauseated.",
              "3. Medications: AVOID hepatotoxic drugs (e.g., Paracetamol, NSAIDs) during acute phase."
            ]
          }
        ]
      },
      {
        label: "Recovery & Prophylaxis",
        shortLabel: "Recovery & Prophylaxis",
        color: "emerald",
        cards: [
          {
            title: "Post-Exposure Prophylaxis (PEP)",
            instructions: [
              "1. Household Contacts: Should receive Hepatitis A Vaccine (or IG if < 1yr or immunocompromised) within 2 weeks of exposure.",
              "2. Follow-up: Repeat LFTs in 2-4 weeks to ensure normalization."
            ]
          }
        ]
      }
    ]
  },

  calculateSeverity: () => ({ level: 'mild', details: [] }),
  getManagement: () => [],
  getDisposition: () => [],
  getRedFlags: () => [],
  getDrugDoses: () => [],
  getReferences: () => [
    { title: "CDC: Hepatitis A Questions and Answers for Health Professionals", url: "https://www.cdc.gov/hepatitis/hav/havfaq.htm" },
    { title: "Red Book (AAP): Hepatitis A", url: "https://publications.aap.org/redbook" }
  ],
};
