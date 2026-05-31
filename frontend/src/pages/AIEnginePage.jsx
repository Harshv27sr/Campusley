// src/pages/AIEnginePage.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, MessageSquare, FileQuestion, Sparkles, Send, 
  HelpCircle, CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight,
  BookOpen, Lightbulb, Lock, FileText, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { aiService } from '../services/aiService'

export default function AIEnginePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('summary') // summary, chat, quiz
  
  // 1. Note Summarizer State
  const [summaryInput, setSummaryInput] = useState('')
  const [summaryType, setSummaryType] = useState('summary') // summary, concepts, formulas
  const [summaryResult, setSummaryResult] = useState('')
  const [summarizing, setSummarizing] = useState(false)
  const [summaryProvider, setSummaryProvider] = useState('')

  // 2. Chat Tutor State
  const [chatInput, setChatInput] = useState('')
  const [chatPersona, setChatPersona] = useState('socratic') // socratic, examiner, coach
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: `Hello ${user?.name || 'student'}! I am your AI Academic Tutor. Choose a coaching persona above and let's explore any study concept together. What are we studying today?`, persona: 'socratic' }
  ])
  const [chatting, setChatting] = useState(false)
  const chatBottomRef = useRef(null)

  // 3. Quiz State
  const [quizTopic, setQuizTopic] = useState('Calculus')
  const [questionsCount, setQuestionsCount] = useState(3)
  const [quizList, setQuizList] = useState([])
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [quizProvider, setQuizProvider] = useState('')
  
  // Interactive Quiz Play State
  const [quizActive, setQuizActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  // Auto-scroll chat window
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Summarize Handler (Gemini)
  const handleSummarize = async (e) => {
    e.preventDefault()
    if (!summaryInput.trim()) {
      toast.error('Please input a topic or paste text to summarize.')
      return
    }

    setSummarizing(true)
    try {
      const res = await aiService.summarize(summaryInput.trim(), summaryType)
      setSummaryResult(res.text)
      setSummaryProvider(res.provider)
      toast.success('Study analysis compiled successfully! 📄')
    } catch (err) {
      toast.error('Summarizing failed. Please try again.')
    } finally {
      setSummarizing(false)
    }
  }

  // Chat Handler (OpenAI)
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatHistory(p => [...p, { role: 'user', text: userMessage }])
    setChatting(true)

    try {
      const res = await aiService.chat(userMessage, chatPersona)
      setChatHistory(p => [...p, { role: 'assistant', text: res.text, provider: res.provider, persona: chatPersona }])
    } catch (err) {
      toast.error('AI Tutor failed to respond.')
    } finally {
      setChatting(false)
    }
  }

  // Quiz Generation Handler (Claude)
  const handleGenerateQuiz = async (e) => {
    e.preventDefault()
    if (!quizTopic.trim()) {
      toast.error('Please specify a study topic for the quiz.')
      return
    }

    setGeneratingQuiz(true)
    setQuizActive(false)
    setQuizFinished(false)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setScore(0)
    setAnsweredCount(0)

    try {
      const res = await aiService.generateQuiz(quizTopic.trim(), questionsCount)
      if (res.quiz && res.quiz.length > 0) {
        setQuizList(res.quiz)
        setQuizProvider(res.provider)
        setQuizActive(true)
        toast.success(`MCQ Quiz Generated! Let's play 🎮`)
      } else {
        toast.error('Quiz layout failed. Try another topic.')
      }
    } catch (err) {
      toast.error('Quiz creation failed.')
    } finally {
      setGeneratingQuiz(false)
    }
  }

  // Handle Play Option Selection
  const handleOptionClick = (option) => {
    if (selectedOption !== null) return // prevent double answering
    
    setSelectedOption(option)
    setAnsweredCount(p => p + 1)

    const currentQuestion = quizList[currentQuestionIndex]
    if (option === currentQuestion.answer) {
      setScore(p => p + 1)
      toast.success('Correct Answer! 🎉')
    } else {
      toast.error('Incorrect Answer.')
    }
  }

  const handleNextQuestion = () => {
    setSelectedOption(null)
    if (currentQuestionIndex + 1 < quizList.length) {
      setCurrentQuestionIndex(p => p + 1)
    } else {
      setQuizFinished(true)
      setQuizActive(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -z-10" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 font-display">
              <Sparkles size={24} className="text-yellow-300 animate-pulse" />
              AI Study Companion Portal
            </h1>
            <p className="text-sm text-slate-400">
              Interactive professor engines powered dynamically by OpenAI, Gemini, and Claude.
            </p>
          </div>
          
          {/* Tabs Selector Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800/60 rounded-2xl self-start md:self-auto shadow-inner">
            {[
              { id: 'summary', icon: Brain, label: 'Note Summarizer' },
              { id: 'chat', icon: MessageSquare, label: 'Socratic Tutor' },
              { id: 'quiz', icon: FileQuestion, label: 'MCQ Quiz Games' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                  activeTab === t.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <t.icon size={15} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Panels */}
        <div className="min-h-[460px]">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: AI Note Summarizer (Gemini) */}
            {activeTab === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid md:grid-cols-5 gap-6"
              >
                {/* Inputs Control Panel */}
                <form onSubmit={handleSummarize} className="md:col-span-2 bg-slate-900/30 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-xs text-blue-400 font-bold uppercase tracking-wider">
                      <Brain size={14} /> Google Gemini Core
                    </span>
                    <h3 className="text-md font-bold text-white">Revise Study Content</h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold">Enter study topic or paste note text:</label>
                    <textarea
                      value={summaryInput}
                      onChange={(e) => setSummaryInput(e.target.value)}
                      placeholder="e.g. Photosynthesis processes, Quantum superposition, or paste your lengthy hand-written exam notes here..."
                      className="w-full h-44 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder:text-slate-500 dark:text-slate-400 text-sm p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold">Target Output Layout:</label>
                    <select
                      value={summaryType}
                      onChange={(e) => setSummaryType(e.target.value)}
                      className="w-full rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm p-3 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                    >
                      <option value="summary">Detailed Study Summary</option>
                      <option value="concepts">Core Concepts & Bullet Points</option>
                      <option value="formulas">Formulas Cheatsheet</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full justify-center shadow-lg font-bold"
                    loading={summarizing}
                    iconLeft={<Sparkles size={16} />}
                  >
                    Summarize Notes
                  </Button>
                </form>

                {/* Markdown Output Display Panel */}
                <div className="md:col-span-3 bg-slate-900/20 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-sm font-bold text-slate-300">Summarized Insights</span>
                      {summaryProvider && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm animate-pulse">
                          ⚡ {summaryProvider}
                        </span>
                      )}
                    </div>

                    {summaryResult ? (
                      <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base space-y-4 max-h-[360px] overflow-y-auto pr-1">
                        {summaryResult.split('\n').map((line, idx) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={idx} className="text-lg font-extrabold text-white mt-4 border-b border-slate-800 pb-1">{line.replace('# ', '')}</h1>
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={idx} className="text-md font-bold text-blue-300 mt-3">{line.replace('## ', '')}</h2>
                          }
                          if (line.startsWith('### ')) {
                            return <h3 key={idx} className="text-sm font-bold text-indigo-400 mt-2">{line.replace('### ', '')}</h3>
                          }
                          if (line.startsWith('- ')) {
                            return <li key={idx} className="ml-4 list-disc text-slate-300 py-0.5">{line.replace('- ', '')}</li>
                          }
                          if (line.startsWith('> ')) {
                            return <blockquote key={idx} className="border-l-4 border-yellow-500 bg-yellow-500/5 px-3 py-2 rounded text-slate-300 text-xs italic my-2">{line.replace('> ', '')}</blockquote>
                          }
                          return <p key={idx} className="leading-relaxed my-2">{line}</p>
                        })}
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 space-y-2">
                        <FileText size={48} className="text-slate-700 animate-pulse" />
                        <p className="text-sm font-semibold">Summarized text will render here.</p>
                        <p className="text-xs max-w-xs">Enter study materials on the left controller to generate detailed cheatsheets.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-800/80 pt-4 flex justify-between">
                    <span>LaTeX Math notation ready ($E=mc^2$)</span>
                    <span>Gemini Core Engine</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Socratic Study Tutor Chat (OpenAI) */}
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-4"
              >
                {/* Persona controls selector */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-xs text-purple-400 font-bold uppercase tracking-wider">
                      <MessageSquare size={14} /> OpenAI GPT-4o-mini
                    </span>
                    <h3 className="text-md font-extrabold text-white">Ask AI Academic Tutor</h3>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[
                      { id: 'socratic', label: '🎓 Socratic Tutor' },
                      { id: 'examiner', label: '📋 Board Examiner' },
                      { id: 'coach', label: '⚡ Coach analogy' }
                    ].map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setChatPersona(p.id)
                          toast.success(`Tutor persona set to ${p.label}`)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          chatPersona === p.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.label.split(' ')[0]} <span className="hidden sm:inline">{p.label.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversational Screen */}
                <div className="h-80 overflow-y-auto space-y-4 p-2 bg-slate-950/40 rounded-2xl border border-slate-900/80 pr-3 scrollbar-thin">
                  {chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${chat.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <Avatar
                        name={chat.role === 'user' ? user?.name : 'AI Tutor'}
                        className={`flex-shrink-0 ${chat.role === 'user' ? 'bg-indigo-600' : 'bg-purple-600'}`}
                        size="sm"
                      />
                      <div className="space-y-1">
                        <div
                          className={`rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm
                            ${chat.role === 'user' 
                              ? 'bg-indigo-600 text-white rounded-tr-none' 
                              : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'}`}
                        >
                          {chat.role === 'assistant' && chat.text.includes('###') ? (
                            <div className="space-y-2 prose prose-invert max-w-none text-xs sm:text-sm">
                              {chat.text.split('\n').map((line, lIdx) => {
                                if (line.startsWith('### ')) {
                                  return <h4 key={lIdx} className="font-extrabold text-white border-b border-slate-800 pb-1 mt-2 text-sm uppercase tracking-wide">{line.replace('### ', '')}</h4>
                                }
                                if (line.startsWith('- ')) {
                                  return <li key={lIdx} className="ml-3 list-disc text-slate-300">{line.replace('- ', '')}</li>
                                }
                                return <p key={lIdx} className="my-1">{line}</p>
                              })}
                            </div>
                          ) : (
                            <p className="whitespace-pre-line text-xs sm:text-sm">{chat.text}</p>
                          )}
                        </div>
                        {chat.provider && (
                          <div className="text-[9px] text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
                            <span>{chat.provider}</span>
                            <span className="capitalize">{chat.persona} persona</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatting && (
                    <div className="flex gap-3 max-w-[80%] animate-pulse">
                      <Avatar name="AI" className="bg-purple-600 flex-shrink-0" size="sm" />
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Input Prompt Box */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask tutor questions (e.g. Explain quantum computing in plain English...)"
                    className="flex-1 input-field bg-slate-950/80 border-slate-800/80 text-white"
                    required
                    disabled={chatting}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className="!py-3 font-semibold"
                    disabled={chatting}
                    iconRight={<Send size={15} />}
                  >
                    Ask
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Tab 3: MCQ Quiz Generator & Runner (Claude) */}
            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/30 border border-slate-800 rounded-3xl p-5 space-y-6"
              >
                {/* Generation Form (Active when quiz is not running) */}
                {!quizActive && !quizFinished && (
                  <form onSubmit={handleGenerateQuiz} className="max-w-md mx-auto py-10 space-y-5 text-center">
                    <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <FileQuestion size={32} />
                    </div>
                    
                    <div className="space-y-1">
                      <span className="flex items-center justify-center gap-1 text-xs text-orange-400 font-extrabold uppercase tracking-wide">
                        <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                        Claude 3.5 Sonnet Engine
                      </span>
                      <h2 className="text-xl font-extrabold text-white font-display">Generate MCQ Interactive Quiz</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        Create custom MCQ quizzes on any syllabus subject, evaluate answers, and review full derivations instantly!
                      </p>
                    </div>

                    <div className="space-y-3.5 text-left bg-slate-950/40 p-4 border border-slate-900 rounded-2xl">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold">Study Subject or Exam Chapter:</label>
                        <input
                          type="text"
                          value={quizTopic}
                          onChange={(e) => setQuizTopic(e.target.value)}
                          placeholder="e.g. Calculus, Photosynthesis, Electromagnetism"
                          className="w-full input-field bg-slate-950 border-slate-850"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold">Questions Count:</label>
                        <select
                          value={questionsCount}
                          onChange={(e) => setQuestionsCount(parseInt(e.target.value))}
                          className="w-full rounded-xl bg-slate-950 border border-slate-850 text-slate-300 text-sm p-3 focus:outline-none focus:border-blue-500 transition-all font-semibold"
                        >
                          <option value="3">3 practice questions</option>
                          <option value="5">5 practice questions</option>
                          <option value="10">10 practice questions</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      className="w-full justify-center shadow-lg font-bold"
                      loading={generatingQuiz}
                      iconLeft={<Sparkles size={18} />}
                    >
                      Generate MCQ Quiz
                    </Button>
                  </form>
                )}

                {/* Active Quiz Question Runner */}
                {quizActive && quizList.length > 0 && (
                  <div className="space-y-5">
                    {/* Quiz Progress Header */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                          📚 Dynamic Quiz: {quizTopic}
                        </h4>
                        <p className="text-xs text-slate-400 font-medium">
                          Question {currentQuestionIndex + 1} of {quizList.length}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm animate-pulse">
                        ⚡ {quizProvider}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden w-full border border-slate-900 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quizList.length) * 100}%` }}
                      />
                    </div>

                    {/* Question Card */}
                    <div className="space-y-4">
                      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                        <p className="text-md sm:text-lg font-bold text-white leading-relaxed">
                          Q: {quizList[currentQuestionIndex].question}
                        </p>
                      </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quizList[currentQuestionIndex].options.map((option, idx) => {
                          const isCorrect = option === quizList[currentQuestionIndex].answer
                          const isSelected = selectedOption === option
                          const showCorrect = selectedOption !== null && isCorrect
                          const showWrong = selectedOption !== null && isSelected && !isCorrect

                          return (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option)}
                              className={`rounded-2xl p-4 text-left font-semibold text-sm transition-all border flex items-center justify-between gap-3
                                ${selectedOption === null 
                                  ? 'bg-slate-900 border-slate-800 hover:border-orange-500 hover:bg-slate-800/60 text-slate-200 cursor-pointer' 
                                  : showCorrect 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5' 
                                    : showWrong 
                                      ? 'bg-rose-500/10 border-rose-500 text-rose-400' 
                                      : 'bg-slate-950/60 border-slate-900 text-slate-500 dark:text-slate-400 opacity-60'}`}
                              disabled={selectedOption !== null}
                            >
                              <span>{option}</span>
                              {selectedOption !== null && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                              {selectedOption !== null && isSelected && !isCorrect && <XCircle size={16} className="text-rose-400 flex-shrink-0" />}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Feedback Explanation Sheet */}
                    <AnimatePresence>
                      {selectedOption !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-slate-950/80 border border-slate-900 rounded-2xl p-5 space-y-2 shadow-inner"
                        >
                          <h5 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb size={13} /> Explanation & Derivation
                          </h5>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {quizList[currentQuestionIndex].explanation}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Step controls */}
                    {selectedOption !== null && (
                      <Button
                        type="button"
                        variant="gradient"
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto justify-center self-end"
                        iconRight={currentQuestionIndex + 1 < quizList.length ? <ChevronRight size={18} /> : <CheckCircle2 size={18} />}
                      >
                        {currentQuestionIndex + 1 < quizList.length ? 'Next Question' : 'Finish & View Score'}
                      </Button>
                    )}
                  </div>
                )}

                {/* Final Score Dashboard */}
                {quizFinished && (
                  <div className="max-w-md mx-auto text-center py-10 space-y-6">
                    <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                      <Trophy size={40} />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold text-white font-display">MCQ Quiz Finished!</h2>
                      <p className="text-sm text-slate-400">
                        Excellent effort! You have completed the practice test on {quizTopic}.
                      </p>
                    </div>

                    {/* Score Bubble */}
                    <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-6 inline-block min-w-[200px] shadow-inner">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-bold">Your Score</span>
                      <span className="text-4xl font-extrabold text-white block mt-1">
                        {score} <span className="text-2xl text-slate-500 dark:text-slate-400">/ {quizList.length}</span>
                      </span>
                      <span className="text-xs text-emerald-400 font-bold block mt-2">
                        {((score / quizList.length) * 100).toFixed(0)}% Accuracy
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setQuizFinished(false)
                          setQuizActive(false)
                          setQuizList([])
                        }}
                        className="flex-1 justify-center bg-slate-950 text-slate-300 font-bold"
                        iconLeft={<RefreshCw size={14} />}
                      >
                        Create New Quiz
                      </Button>
                      <Button
                        type="button"
                        variant="gradient"
                        onClick={() => {
                          setQuizFinished(false)
                          setQuizActive(true)
                          setCurrentQuestionIndex(0)
                          setSelectedOption(null)
                          setScore(0)
                          setAnsweredCount(0)
                        }}
                        className="flex-1 justify-center font-bold"
                        iconLeft={<RefreshCw size={14} />}
                      >
                        Retry Same Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </DashboardLayout>
  )
}
