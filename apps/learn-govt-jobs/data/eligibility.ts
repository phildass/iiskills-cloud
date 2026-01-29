/**
 * Eligibility criteria for government jobs
 */

export interface AgeRange {
  min: number;
  max: number;
  relaxation?: {
    category: string;
    years: number;
  }[];
}

export interface Eligibility {
  education: string;
  age: AgeRange;
  experience?: string;
  physicalFitness?: boolean;
  nationality?: string;
  additionalCriteria?: string[];
}

/**
 * Common eligibility templates
 */
export const eligibilityTemplates = {
  clerk: {
    education: '12th pass',
    age: { min: 18, max: 30 },
    experience: 'Not required',
  },
  teacher: {
    education: 'B.Ed or equivalent',
    age: { min: 21, max: 35 },
    experience: 'Freshers can apply',
  },
  police: {
    education: '12th pass',
    age: { min: 18, max: 28 },
    physicalFitness: true,
  },
  ias: {
    education: "Bachelor's degree",
    age: { 
      min: 21, 
      max: 32,
      relaxation: [
        { category: 'OBC', years: 3 },
        { category: 'SC/ST', years: 5 }
      ]
    },
    nationality: 'Indian',
  },
} as const;

/**
 * Validate eligibility criteria
 */
export function validateEligibility(eligibility: Eligibility): boolean {
  return (
    typeof eligibility.education === 'string' &&
    typeof eligibility.age.min === 'number' &&
    typeof eligibility.age.max === 'number' &&
    eligibility.age.min < eligibility.age.max
  );
}

/**
 * Check if a candidate meets eligibility criteria
 */
export function checkEligibility(
  candidate: {
    age: number;
    education: string;
    category?: string;
  },
  eligibility: Eligibility
): { eligible: boolean; reasons?: string[] } {
  const reasons: string[] = [];

  // Check age
  let maxAge = eligibility.age.max;
  if (candidate.category && eligibility.age.relaxation) {
    const relaxation = eligibility.age.relaxation.find(
      r => r.category === candidate.category
    );
    if (relaxation) {
      maxAge += relaxation.years;
    }
  }

  if (candidate.age < eligibility.age.min) {
    reasons.push(`Minimum age requirement not met (${eligibility.age.min} years)`);
  }
  if (candidate.age > maxAge) {
    reasons.push(`Maximum age limit exceeded (${maxAge} years)`);
  }

  // Additional checks would go here (education, nationality, etc.)

  return {
    eligible: reasons.length === 0,
    reasons: reasons.length > 0 ? reasons : undefined,
  };
}
