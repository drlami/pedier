# Master Management Pathway (MMP) Standards

This document defines the mandatory structure and quality standards for clinical protocols to be classified as "Master Pathways" within the PediER Aid system. These standards ensure that every protocol serves as an exhaustive, reliable, and professional reference for senior doctors.

## 1. Core Mandates

### A. Professional Definitions
Every protocol MUST begin its `description` field with a brief, formal medical definition of the disease or condition.
- **Bad:** "Exhaustive directive for pneumonia."
- **Good:** "Community-Acquired Pneumonia is an infection of the lung parenchyma characterized by inflammation and consolidation of the alveoli. This exhaustive directive covers..."

### B. Abbreviation-Free Terminology
To prevent clinical errors and maintain a professional standard, abbreviations are strictly PROHIBITED in Physician Directives and Nursing Monitoring.
- **Prohibited:** Cr, UO, BP, HR, RR, IWL, ATN, K+, Na+, VBG, LP, CT.
- **Mandatory:** Creatinine, Urine Output, Blood Pressure, Heart Rate, Respiratory Rate, Insensible Water Loss, Acute Tubular Necrosis, Potassium, Sodium, Venous Blood Gas, Lumbar Puncture, Computed Tomography.

### C. The "Consultant Snapshot"
The `mmpData.snapshot` must provide a high-level "consultant mindset" summary, focusing on the primary management goals, critical risks, and the overall clinical philosophy for that specific condition.

## 2. Structural Requirements

### Phase 1: Physician Directives [DR]
Must be comprehensive and actionable, including:
- Mandatory baseline laboratory investigations.
- Specific imaging criteria.
- Immediate stabilization orders.
- No-delay safety rules (e.g., "Start antibiotics within 1 hour").
- **Antimicrobial Strategy:** Whenever antibiotics are prescribed, the directive MUST explicitly state whether the recommended regimen is **Monotherapy (Single)**, **Dual Therapy**, or **Triple Therapy**, based on current clinical recommendations (e.g., "PREFERRED REGIMEN: DUAL THERAPY to cover Staphylococcus aureus and toxin production").

### Phase 2: Nursing & Monitoring [NS]
Must provide specific, time-bound instructions:
- Frequency of vital signs.
- Specific physical exam checks (e.g., "Check for flank tenderness daily").
- Strict intake and output charting parameters.
- Target clinical markers (e.g., "Maintain Urine Output > 1.0 mL/kg/hour").

### Phase 3: Senior Triggers [!]
Clearly define escalation points where a senior doctor or specialist must be consulted:
- Failure of medical management.
- Biochemical failure (e.g., "Rising pCO2 on Blood Gas").
- Clinical "Red Flags".

## 3. Integrated Calculators
When a protocol requires complex titration or scoring (e.g., Fluid Titration in Renal Failure, PRAM Score in Asthma), an integrated, collapsible calculator MUST be implemented to reduce cognitive load and calculation errors.

## 4. Evidence-Based References
Every protocol must link to at least two trusted international guidelines (e.g., KDIGO, GINA, NICE, AAP, RCH Melbourne).

---
*Note: The `ward-aki.ts` file serves as the technical "Gold Standard" implementation for these rules.*
