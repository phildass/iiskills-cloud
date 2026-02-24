const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentRoot = path.join(__dirname, '..', 'courses');

function getCourseMetadata(courseId) {
  const metaPath = path.join(contentRoot, courseId, 'course.json');
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
}

function getModuleList(courseId) {
  const modulesPath = path.join(contentRoot, courseId, 'modules');
  if (!fs.existsSync(modulesPath)) return [];
  return fs.readdirSync(modulesPath).filter((f) => fs.statSync(path.join(modulesPath, f)).isDirectory());
}

function getLesson(courseId, moduleId, lessonFile) {
  const lessonPath = path.join(contentRoot, courseId, 'modules', moduleId, lessonFile);
  if (!fs.existsSync(lessonPath)) return null;
  const raw = fs.readFileSync(lessonPath, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

function getLessonsForModule(courseId, moduleId) {
  const modulePath = path.join(contentRoot, courseId, 'modules', moduleId);
  if (!fs.existsSync(modulePath)) return [];
  return fs.readdirSync(modulePath).filter((f) => f.endsWith('.md'));
}

module.exports = { getCourseMetadata, getModuleList, getLesson, getLessonsForModule };
