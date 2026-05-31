// src/utils/helpers.js
import { formatDistanceToNow, format } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  return format(new Date(date), 'MMM dd, yyyy')
}

export const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const slugify = (text) => {
  return text?.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') || ''
}

export const truncate = (text, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

export const getFileIcon = (fileType) => {
  const icons = {
    pdf: '📄',
    docx: '📝',
    doc: '📝',
    ppt: '📊',
    pptx: '📊',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
  }
  return icons[fileType?.toLowerCase()] || '📁'
}

export const getFileColor = (fileType) => {
  const colors = {
    pdf: 'bg-red-100 text-red-700',
    docx: 'bg-blue-100 text-blue-700',
    doc: 'bg-blue-100 text-blue-700',
    ppt: 'bg-orange-100 text-orange-700',
    pptx: 'bg-orange-100 text-orange-700',
    jpg: 'bg-green-100 text-green-700',
    jpeg: 'bg-green-100 text-green-700',
    png: 'bg-green-100 text-green-700',
  }
  return colors[fileType?.toLowerCase()] || 'bg-gray-100 text-gray-700'
}

export const generateStars = (rating) => {
  return Math.round(rating * 2) / 2
}
