// src/services/notesService.js
import api from './api'

export const notesService = {
  async getNotes(params = {}) {
    const res = await api.get('/notes', { params })
    return res.data
  },

  async getNoteById(id) {
    const res = await api.get(`/notes/${id}`)
    return res.data
  },

  async uploadNote(formData) {
    const res = await api.post('/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async updateNote(id, data) {
    const res = await api.put(`/notes/${id}`, data)
    return res.data
  },

  async deleteNote(id) {
    const res = await api.delete(`/notes/${id}`)
    return res.data
  },

  async downloadNote(id) {
    const res = await api.post(`/notes/${id}/download`)
    return res.data
  },

  async likeNote(id) {
    const res = await api.post(`/notes/${id}/like`)
    return res.data
  },

  async rateNote(id, rating) {
    const res = await api.post(`/notes/${id}/rate`, { rating })
    return res.data
  },

  async commentNote(id, content) {
    const res = await api.post(`/notes/${id}/comment`, { content })
    return res.data
  },

  async getComments(id) {
    const res = await api.get(`/notes/${id}/comments`)
    return res.data
  },

  async reportNote(id, reason) {
    const res = await api.post(`/notes/${id}/report`, { reason })
    return res.data
  },

  async getTrendingNotes() {
    const res = await api.get('/notes/trending')
    return res.data
  },

  async getPreviousYearPapers(params = {}) {
    const res = await api.get('/notes/pyq', { params })
    return res.data
  },

  async searchNotes(query, filters = {}) {
    const res = await api.get('/notes/search', { params: { q: query, ...filters } })
    return res.data
  },
}
