// src/services/aiService.js
import api from './api'

export const aiService = {
  async summarize(topic, type) {
    const res = await api.post('/ai/summarize', { topic, type })
    return res.data
  },

  async chat(message, persona) {
    const res = await api.post('/ai/chat', { message, persona })
    return res.data
  },

  async generateQuiz(topic, questionsCount) {
    const res = await api.post('/ai/quiz', { topic, questionsCount })
    return res.data
  }
}
