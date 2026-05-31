// src/utils/constants.js

export const EDUCATION_LEVELS = ['College', 'School']

export const BOARDS = [
  'CBSE', 'ICSE', 'MP Board', 'UP Board', 'Bihar Board', 'Maharashtra Board', 'Rajasthan Board', 'Other'
]

export const CLASSES = [
  'Class 9th', 'Class 10th', 'Class 11th', 'Class 12th'
]

export const SCHOOL_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'Social Science',
  'English', 'Hindi', 'History', 'Geography', 'Civics', 'Economics',
  'Accountancy', 'Business Studies', 'Computer Science', 'Sanskrit', 'Other'
]

export const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Biotechnology', 'Data Science', 'Artificial Intelligence',
  'Cybersecurity', 'MBA', 'MCA', 'BBA', 'BBA', 'BCA', 'Other'
]

export const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Data Structures', 'Algorithms',
  'Operating Systems', 'Database Management', 'Computer Networks', 'Software Engineering',
  'Machine Learning', 'Artificial Intelligence', 'Web Development', 'Mobile Development',
  'Compiler Design', 'Computer Architecture', 'Digital Electronics', 'Control Systems',
  'Engineering Drawing', 'Business Communication', 'Economics', 'Other'
]

export const FILE_TYPES = ['PDF', 'DOCX', 'Image', 'PPT', 'Other']

export const NOTE_TYPES = [
  { value: 'notes', label: 'Study Notes' },
  { value: 'pyq', label: 'Previous Year Papers' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'practical', label: 'Practical File' },
  { value: 'important', label: 'Important Questions' },
  { value: 'syllabus', label: 'Syllabus' },
]

export const BADGES = [
  { id: 'top-contributor', name: 'Top Contributor', icon: '🏆', color: 'text-yellow-500' },
  { id: 'verified-uploader', name: 'Verified Uploader', icon: '✅', color: 'text-blue-500' },
  { id: 'campus-mentor', name: 'Campus Mentor', icon: '🎓', color: 'text-purple-500' },
  { id: 'topper-notes', name: 'Topper Notes', icon: '⭐', color: 'text-green-500' },
  { id: 'first-upload', name: 'First Upload', icon: '🚀', color: 'text-orange-500' },
  { id: 'helpful', name: 'Helpful', icon: '💡', color: 'text-cyan-500' },
]

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
