export interface Applicant {
  id: string;
  name: string;
  income: number; // Annual income in dollars
  familySize: number; // Number of family members
  hasDisability: boolean;
  distanceToWork: number; // Distance to work in miles
  fairnessScore?: number;
}

/**
 * Calculates a fairness score for housing allocation
 * Lower income, larger family, disability, and shorter commute increase the score
 * @param applicant - The applicant data
 * @returns Fairness score (higher score = higher priority)
 */
export function calculateFairnessScore(applicant: Applicant): number {
  let score = 0;

  // Income component (inverse relationship - lower income gets higher score)
  // Normalize income to 0-100 scale, then invert
  const maxIncome = 100000; // Assume max income of $100k for normalization
  const incomeScore = Math.max(0, 100 - (applicant.income / maxIncome) * 100);
  score += incomeScore * 0.4; // 40% weight

  // Family size component (linear relationship - larger family gets higher score)
  const familySizeScore = Math.min(applicant.familySize * 15, 60); // Cap at 60 points
  score += familySizeScore * 0.25; // 25% weight

  // Disability status component
  const disabilityScore = applicant.hasDisability ? 30 : 0;
  score += disabilityScore * 0.2; // 20% weight

  // Distance to work component (inverse relationship - shorter distance gets higher score)
  const maxDistance = 50; // Assume max distance of 50 miles
  const distanceScore = Math.max(0, 100 - (applicant.distanceToWork / maxDistance) * 100);
  score += distanceScore * 0.15; // 15% weight

  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Allocates housing units to applicants based on fairness scores
 * @param applicants - List of all applicants
 * @param availableUnits - Number of available housing units
 * @returns List of allocated applicants sorted by score (highest first)
 */
export function allocateHousing(applicants: Applicant[], availableUnits: number): Applicant[] {
  // Calculate fairness scores for all applicants
  const applicantsWithScores = applicants.map(applicant => ({
    ...applicant,
    fairnessScore: calculateFairnessScore(applicant)
  }));

  // Sort by fairness score (highest first)
  const sortedApplicants = applicantsWithScores.sort((a, b) => 
    (b.fairnessScore || 0) - (a.fairnessScore || 0)
  );

  // Return top applicants equal to available units
  return sortedApplicants.slice(0, availableUnits);
}

/**
 * Generates sample applicant data for testing
 * @param count - Number of sample applicants to generate
 * @returns Array of sample applicants
 */
export function generateSampleApplicants(count: number): Applicant[] {
  const names = [
    'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson',
    'Maria Garcia', 'James Brown', 'Jennifer Miller', 'Robert Taylor',
    'Lisa Anderson', 'Christopher Lee', 'Amanda White', 'Daniel Harris',
    'Jessica Martinez', 'Matthew Clark', 'Ashley Lewis', 'Joshua Walker'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `APP-${(index + 1).toString().padStart(3, '0')}`,
    name: names[index % names.length] || `Applicant ${index + 1}`,
    income: Math.floor(Math.random() * 80000) + 20000, // $20k - $100k
    familySize: Math.floor(Math.random() * 6) + 1, // 1-6 family members
    hasDisability: Math.random() < 0.2, // 20% chance of disability
    distanceToWork: Math.floor(Math.random() * 45) + 1 // 1-45 miles
  }));
}