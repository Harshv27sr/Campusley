// src/services/userService.js
import api from './api'

export const userService = {
  // My own profile (authenticated)
  async getMyProfile() {
    const res = await api.get('/users/me/profile')
    return res.data
  },

  // Any user's public profile by ID
  async getUserProfile(userId) {
    const res = await api.get(`/users/${userId}/profile`)
    return res.data
  },

  // Update logged-in user's profile
  async updateProfile(data) {
    const res = await api.put('/users/profile', data)
    return res.data
  },

  async uploadAvatar(formData) {
    const res = await api.put('/auth/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const res = await api.put('/users/password', { currentPassword, newPassword })
    return res.data
  },

  // Bookmarks
  async getBookmarks() {
    const res = await api.get('/users/bookmarks')
    return res.data
  },

  async toggleBookmark(noteId) {
    const res = await api.post(`/users/bookmarks/${noteId}`)
    return res.data
  },

  // Notifications
  async getNotifications() {
    const res = await api.get('/users/notifications')
    return res.data
  },

  async markAllNotificationsRead() {
    const res = await api.put('/users/notifications/read-all')
    return res.data
  },

  // Top contributors (public)
  async getTopContributors() {
    const res = await api.get('/users/top-contributors')
    return res.data
  },
}

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats')
    return res.data
  },

  async getUsers(search = '') {
    const res = await api.get('/admin/users', { params: { search } })
    return res.data
  },

  async verifyUser(userId, status) {
    const res = await api.put(`/admin/users/${userId}/verify`, { status })
    return res.data
  },

  async deleteUser(userId) {
    const res = await api.delete(`/admin/users/${userId}`)
    return res.data
  },

  async getNotes() {
    const res = await api.get('/admin/notes')
    return res.data
  },

  async deleteNote(noteId) {
    const res = await api.delete(`/admin/notes/${noteId}`)
    return res.data
  },
}
