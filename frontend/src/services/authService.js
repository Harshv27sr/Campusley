// src/services/authService.js
import api from './api'

export const authService = {
  async signup(data) {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const res = await api.post('/auth/signup', data, { headers })
    return res.data
  },

  async verifyAccount(status) {
    const res = await api.put('/auth/verify', { status })
    return res.data
  },

  async login(data) {
    const res = await api.post('/auth/login', data)
    if (res.data.token) {
      localStorage.setItem('campusley_token', res.data.token)
      localStorage.setItem('campusley_user', JSON.stringify(res.data.user))
    }
    return res.data
  },

  async logout() {
    await api.post('/auth/logout')
    localStorage.removeItem('campusley_token')
    localStorage.removeItem('campusley_user')
  },

  async getMe() {
    const res = await api.get('/auth/me')
    return res.data
  },

  async forgotPassword(identifier) {
    const res = await api.post('/auth/forgot-password', { identifier })
    return res.data
  },

  async verifyOTP(identifier, otp) {
    const res = await api.post('/auth/verify-otp', { identifier, otp })
    return res.data
  },

  async resetPassword(identifier, otp, password) {
    const res = await api.post('/auth/reset-password', { identifier, otp, password })
    return res.data
  },

  async googleAuth(token, mode = 'login') {
    const res = await api.post('/auth/google', { token, mode })
    if (res.data.token) {
      localStorage.setItem('campusley_token', res.data.token)
      localStorage.setItem('campusley_user', JSON.stringify(res.data.user))
    }
    return res.data
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('campusley_user')
    return userStr ? JSON.parse(userStr) : null
  },

  getToken() {
    return localStorage.getItem('campusley_token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('campusley_token')
  },
}
