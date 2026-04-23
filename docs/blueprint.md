# **App Name**: PediER Aid

## Core Features:

- Interactive Assessment Forms: Provide structured, disease-specific input forms (e.g., age, O2 sat, symptoms) for quick and accurate data collection on mobile-first layouts.
- Deterministic Recommendation Engine: Utilize a rule-based AI tool that processes assessment inputs using predefined algorithms to generate severity classifications, management plans, admission/discharge criteria, red flags, and drug doses.
- Real-time Output Display: Instantly display generated classifications and recommendations directly on the assessment page using concise text and clear severity indicators like a reusable 'SeverityBadge' component.
- Disease Content Management System: Implement a backend structure to store and manage all disease definitions, questions, answer options, severity rules, recommendation blocks, red flags, and references, preparing for future Firebase (Firestore) integration.
- Disease Library & Search: Offer a homepage with a search bar, a browsable library of disease cards, and sections for recent and favorite assessments for fast navigation.
- Content Administration Portal: Develop a simple administrative interface to allow authorized users to edit and update the structured disease-specific content, questions, and associated rule logic without direct code modification.
- Printable Clinical Summary: Generate a clean, print-friendly document summarizing the patient assessment inputs and the clinical recommendations provided by the tool for documentation.

## Style Guidelines:

- Primary color: A professional and reassuring deep blue (`#2473D1`). This hue evokes clarity and trust, suitable for a medical application, contrasting effectively with the light background.
- Background color: A very subtle, almost white, cool tint (`#EBF4FA`). This heavily desaturated blue hue provides a clean and crisp light background as requested, minimizing eye strain.
- Accent color: A vibrant yet calm aqua-green (`#3DDBC7`). Analogous to the primary, it adds a fresh, distinctive highlight for interactive elements and key information without being overly bright or distracting in a clinical setting.
- Body and headline font: 'Inter' (sans-serif) for its modern, neutral, and highly readable design, ensuring clear presentation of concise, high-yield medical information across all devices.
- Use a set of clear, concise, and professional medical and UI icons to convey information quickly and enhance navigation without unnecessary visual clutter.
- Implement a mobile-first, responsive design with clean card-based layouts for diseases and results, ensuring fast navigation and intuitive access to structured forms and outputs.
- Incorporate only essential and subtle animations, focusing on functional feedback such as form input states or transitions, to maintain a fast and professional user experience without unnecessary distractions.