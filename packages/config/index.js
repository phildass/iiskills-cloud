/**
 * @iiskills/config — shared configuration presets
 *
 * Provides base configuration for security headers, course display order,
 * and content moderation used across all iiskills.cloud applications.
 */

const { getHeadersConfig } = require("./security-headers");
const {
  COURSE_DISPLAY_ORDER,
  getOrderedCourses,
  getCourseMetadata,
} = require("./courseDisplayOrder");

module.exports = {
  getHeadersConfig,
  COURSE_DISPLAY_ORDER,
  getOrderedCourses,
  getCourseMetadata,
};
