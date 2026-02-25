/**
 * Course Display Order Configuration
 * 
 * Defines the canonical order for displaying courses in the courses listing page.
 * Free courses are displayed first, followed by paid courses.
 * 
 * This configuration ensures consistency across the application and makes
 * it easy to update the order when courses are added, removed, or renamed.
 */

export const COURSE_DISPLAY_ORDER = [
  // Free courses (displayed first)
  "Learn Chemistry",
  "Learn Geography", 
  "Learn Maths",      // Also matches "Learn Mathematics"
  "Learn Physics",
  "Learn Aptitude",
  
  // Paid courses (displayed after free)
  "Learn PR",
  "Learn AI",
  "Learn Management",
  "Learn Developer",
];

/**
 * Get the display order index for a course
 * @param {string} courseName - The course name (may include suffixes like "– Free")
 * @returns {number} - The order index, or -1 if not in the list
 */
export function getCourseOrderIndex(courseName) {
  // Clean course name by removing suffixes
  const cleanName = courseName
    .replace(/\s*[–-]\s*(Free|From the book)$/i, "")
    .trim();
  
  return COURSE_DISPLAY_ORDER.indexOf(cleanName);
}

/**
 * Sort courses according to the display order
 * Free courses come first, then paid, maintaining the specified order
 * @param {Array} courses - Array of course objects with name and isFree properties
 * @returns {Array} - Sorted array of courses
 */
export function sortCoursesByDisplayOrder(courses) {
  return [...courses].sort((a, b) => {
    const indexA = getCourseOrderIndex(a.name);
    const indexB = getCourseOrderIndex(b.name);
    
    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one is in the list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the list, sort free courses before paid
    if (a.isFree !== b.isFree) {
      return a.isFree ? -1 : 1;
    }
    
    // Otherwise maintain original order
    return 0;
  });
}

/**
 * Course count configuration
 * Update these when courses are added or removed
 */
export const COURSE_COUNTS = {
  total: 9,
  free: 5,
  paid: 4,
};

/**
 * Get display text for course availability
 * @returns {string} - Course availability text
 */
export function getCourseAvailabilityText() {
  return `Courses available now: ${COURSE_COUNTS.total} | ${numberToWords(COURSE_COUNTS.free)} Free | ${numberToWords(COURSE_COUNTS.paid)} Paid`;
}

function numberToWords(num) {
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  return words[num] || num.toString();
}
