// src/services/bookmarkService.js
import api from './api'

export const bookmarkService = {
  async getBookmarks() {
    const res = await api.get('/bookmarks')
    return res.data
  },

  async addBookmark(noteId) {
    const res = await api.post('/bookmarks', { noteId })
    return res.data
  },

  async removeBookmark(noteId) {
    const res = await api.delete(`/bookmarks/${noteId}`)
    return res.data
  },

  async isBookmarked(noteId) {
    const res = await api.get(`/bookmarks/check/${noteId}`)
    return res.data
  },
}
