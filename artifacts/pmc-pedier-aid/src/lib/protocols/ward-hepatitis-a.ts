import type { DiseaseProtocol } from './types';

/**
 * Pediatric Ward: Hepatitis A
 * Focus: Supportive care, coagulopathy monitoring, isolation.
 */
export const wardHepatitisAProtocol: DiseaseProtocol = {
  id: 'ward-hepatitis-a',
  name: 'Hepatitis A: Ward Management',
  system: 'Gastrointestinal & Hepatology',
  unit: 'ward',
  category: 'general',
  lastUpdated: 'May 2026',
  description: 'Hepatitis A is an acute, usually self-limiting viral infection of the liver transmitted via the fecal-oral route. While most pediatric cases are mild or asymptomatic, management focuses on identifying the rare progression to fulminant hepatic failure, ensuring strict infection control, and managing household post-exposure prophylaxis.',
  image: {
    url: "https://images.unsplash.com/photo-1576091160550-2173dad99978?auto=format&fit=crop&q=80&w=600&h=400",
    hint: "Acute viral hepatitis approach"
  },
  questions: [],

  mmpData: {
    snapshot: "Management is primarily supportive, emphasizing: (1) Vigilant monitoring for Acute Liver Failure (rising INR or altered mental status), (2) Strict contact precautions and hand hygiene to prevent nosocomial spread, and (3) Avoidance of hepatotoxic medications. Public health notification is mandatory upon diagnosis.",
    stages: [
      {
        label: "Stage 1: Diagnosis & Infection Control",
        shortLabel: "Diagnosis",
        color: "blue",
        cards: [
          {
            title: "Initial Physician Orders [DR]",
            orders: [
              "Confirmatory Serology: Order Anti-Hepatitis A Virus (HAV) IgM (positive confirms acute infection).",
              "Liver Function Panel: Monitor Alanine Aminotransferase (ALT), Aspartate Aminotransferase (AST), Total and Direct Bilirubin, and Alkaline Phosphatase.",
              "Mandatory Notification: Report the case to local Public Health authorities immediately.",
              "Screening for Co-infections: Consider Hepatitis B and C serology if risk factors are present."
            ]
          },
          {
            title: "Nursing: Strict Monitoring [NS]",
            isCritical: true,
            nursing: [
              "Implement Strict Contact Precautions: Required for at least 1 week after the onset of jaundice.",
              "Enforce Hand Hygiene: Emphasize fecal-oral transmission risks to family and staff.",
              "Daily Weight: Monitor for fluid retention or weight loss due to poor intake.",
              "Documentation: Record the degree of jaundice, pruritus, and any changes in stool or urine color."
            ]
          }
        ]
      },
      {
        label: "Stage 2: Fulminant Failure Surveillance",
        shortLabel: "Monitoring",
        color: "red",
        cards: [
          {
            title: "The 'Failure' Watch [DR]",
            isCritical: true,
            orders: [
              "Coagulation Profile: Check Prothrombin Time (PT) and International Normalized Ratio (INR) every 24-48 hours. If INR is greater than 1.5, escalate to a high-dependency or intensive care setting.",
              "Glucose Monitoring: Check for hypoglycemia (every 8-12 hours or if symptomatic).",
              "Neurological Assessment: Evaluate for irritability, lethargy, or confusion (signs of Hepatic Encephalopathy)."
            ]
          }
        ]
      },
      {
        label: "Stage 3: Supportive Ward Care",
        shortLabel: "Support",
        color: "amber",
        cards: [
          {
            title: "Management Strategy",
            orders: [
              "Activity: Encourage rest as tolerated; forced bed rest is not necessary.",
              "Nutrition: High-calorie, small, frequent meals. A low-fat diet may be better tolerated during the nauseous phase.",
              "Medication Safety: Strictly avoid all hepatotoxic drugs (e.g., Paracetamol/Acetaminophen, Non-Steroidal Anti-Inflammatory Drugs) during the acute phase unless absolutely necessary and discussed with a specialist."
            ]
          }
        ]
      },
      {
        label: "Stage 4: Discharge & Prophylaxis",
        shortLabel: "Recovery",
        color: "emerald",
        cards: [
          {
            title: "Prevention & Follow-up",
            orders: [
              "Post-Exposure Prophylaxis (PEP): Household contacts should receive the Hepatitis A Vaccine (or Immune Globulin if younger than 1 year or immunocompromised) within 2 weeks of exposure.",
              "Follow-up Plan: Schedule repeat Liver Function Tests in 2-4 weeks to ensure normalization.",
              "Education: Advise on returning to school/daycare (usually 1 week after symptom onset and as tolerated)."
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
