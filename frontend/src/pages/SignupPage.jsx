import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, User, GraduationCap, ArrowRight, BookOpen, UploadCloud, ShieldCheck, FileText, X, Camera, RefreshCw } from 'lucide-react'
import Webcam from 'react-webcam'
import toast from 'react-hot-toast'
import { State, City } from 'country-state-city'
import { institutionData } from '../utils/institutionData'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import { Select } from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { BRANCHES, SEMESTERS, EDUCATION_LEVELS, BOARDS, CLASSES } from '../utils/constants'

export default function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup, googleLogin } = useAuth()
  const from = location.state?.from?.pathname || '/dashboard'
  
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    educationLevel: 'College', // College or School
    state: '', city: '',
    college: '', branch: '', semester: '',
    schoolName: '', board: '', className: '',
    idCard: null,
    liveSelfie: null
  })

  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [institutions, setInstitutions] = useState([])

  useEffect(() => {
    setStates(State.getStatesOfCountry('IN'))
  }, [])

  const handleStateChange = (e) => {
    const stateName = e.target.value
    setForm(p => ({ ...p, state: stateName, city: '', college: '', schoolName: '' }))
    const stateObj = states.find(s => s.name === stateName)
    if (stateObj) {
      setCities(City.getCitiesOfState('IN', stateObj.isoCode))
    } else {
      setCities([])
    }
    setInstitutions([])
  }

  const handleCityChange = (e) => {
    const cityName = e.target.value
    setForm(p => ({ ...p, city: cityName, college: '', schoolName: '' }))
    
    const level = form.educationLevel
    if (institutionData[form.state] && institutionData[form.state][cityName]) {
      setInstitutions(institutionData[form.state][cityName][level] || [])
    } else {
      setInstitutions([])
    }
  }

  const handleEduLevelChange = (e) => {
    const level = e.target.value
    setForm(p => ({ ...p, educationLevel: level, college: '', schoolName: '' }))
    
    if (institutionData[form.state] && institutionData[form.state][form.city]) {
      setInstitutions(institutionData[form.state][form.city][level] || [])
    } else {
      setInstitutions([])
    }
  }
  
  const webcamRef = useRef(null)
  const [liveSelfiePreview, setLiveSelfiePreview] = useState(null)
  
  const [idCardPreview, setIdCardPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await googleLogin()
      toast.success('Successfully signed up with Google! 🚀')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error('Google Sign-in failed.')
    } finally {
      setLoading(false)
    }
  }
  
  const fileInputRef = useRef(null)

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleNext = (e) => {
    e.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  const handleStep2Next = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.state) errs.state = 'State is required'
    if (!form.city) errs.city = 'City is required'

    if (form.educationLevel === 'College') {
      if (!form.college.trim()) errs.college = 'College/University name is required'
      if (!form.branch) errs.branch = 'Branch is required'
      if (!form.semester) errs.semester = 'Semester is required'
    } else {
      if (!form.schoolName.trim()) errs.schoolName = 'School name is required'
      if (!form.board) errs.board = 'Board is required'
      if (!form.className) errs.className = 'Class is required'
    }

    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(3)
  }

  // Handle file selection
  const handleFileChange = (file) => {
    if (!file) return

    // Limit to images/PDFs up to 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP, or PDF files are allowed.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.')
      return
    }

    setForm(p => ({ ...p, idCard: file }))

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdCardPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      // PDF or other
      setIdCardPreview('pdf')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => {
    setForm(p => ({ ...p, idCard: null }))
    setIdCardPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleStep3Next = (e) => {
    e.preventDefault()
    if (!form.idCard) {
      toast.error('School/College ID Card is required for student verification.')
      return
    }
    setStep(4)
  }

  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setLiveSelfiePreview(imageSrc)
    
    // Convert base64 to Blob to File
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
        setForm(p => ({ ...p, liveSelfie: file }))
      })
  }

  const retakeSelfie = () => {
    setLiveSelfiePreview(null)
    setForm(p => ({ ...p, liveSelfie: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)
    
    if (!form.liveSelfie) {
      toast.error('A live selfie is required to verify your identity.')
      return
    }

    setLoading(true)
    
    // Compile to FormData
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('password', form.password)
    formData.append('educationLevel', form.educationLevel)
    
    if (form.educationLevel === 'College') {
      formData.append('college', form.college)
      formData.append('branch', form.branch)
      formData.append('semester', form.semester)
    } else {
      formData.append('schoolName', form.schoolName)
      formData.append('board', form.board)
      formData.append('className', form.className)
    }
    
    formData.append('state', form.state)
    formData.append('city', form.city)
    formData.append('idCard', form.idCard)
    formData.append('liveSelfie', form.liveSelfie)

    try {
      await signup(formData)
      toast.success('Account created! Verification in progress... 📝')
      navigate(from, { replace: true })
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(errorMsg)
      setServerError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join Campusly 🚀" subtitle="Create your free student account in seconds">
      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${step >= s ? 'gradient-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
              {s}
            </div>
            {s < 4 && <div className={`flex-1 h-0.5 w-8 sm:w-12 transition-all ${step > s ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`} />}
          </div>
        ))}
        <div className="ml-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
          Step {step} of 4
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-3.5" autoComplete="off">
          {/* Dummy inputs to absorb browser autofill on load */}
          <input type="text" name="email" className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />
          <input type="password" name="password" className="sr-only" tabIndex={-1} aria-hidden="true" autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} />

          <Input label="Full Name" icon={User} placeholder="Rahul Sharma" value={form.name} onChange={set('name')} error={errors.name} required preventAutofill autoComplete="new-password" />
          <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} required preventAutofill autoComplete="new-password" />
          <Input label="Password" type="password" icon={Lock} placeholder="Min. 6 characters" value={form.password} onChange={set('password')} error={errors.password} required preventAutofill autoComplete="new-password" />
          <Input label="Confirm Password" type="password" icon={Lock} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} required preventAutofill autoComplete="new-password" />
          <Button type="submit" variant="gradient" size="lg" className="w-full mt-2" iconRight={<ArrowRight size={18} />}>
            Continue
          </Button>

          <div className="relative flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Next} className="space-y-3.5">
          <Select label="Education Level" value={form.educationLevel} onChange={handleEduLevelChange}>
            {EDUCATION_LEVELS.map(level => <option key={level} value={level}>{level} Student</option>)}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select label="State" value={form.state} onChange={handleStateChange} error={errors.state}>
              <option value="">Select State</option>
              {states.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
            </Select>
            <Select label="City" value={form.city} onChange={handleCityChange} error={errors.city} disabled={!form.state}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>
          </div>

          <datalist id="institutions-list">
            {institutions.map(inst => <option key={inst} value={inst} />)}
          </datalist>

          {form.educationLevel === 'College' ? (
            <>
              <Input
                label="College / University"
                icon={GraduationCap}
                placeholder="Type or select college"
                value={form.college}
                onChange={set('college')}
                error={errors.college}
                required
                list="institutions-list"
              />
              <Select label="Branch" value={form.branch} onChange={set('branch')} error={errors.branch}>
                <option value="">Select your branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Select label="Current Semester" value={form.semester} onChange={set('semester')} error={errors.semester}>
                <option value="">Select semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
              </Select>
            </>
          ) : (
            <>
              <Input
                label="School Name"
                icon={BookOpen}
                placeholder="Type or select school"
                value={form.schoolName}
                onChange={set('schoolName')}
                error={errors.schoolName}
                required
                list="institutions-list"
              />
              <Select label="Education Board" value={form.board} onChange={set('board')} error={errors.board}>
                <option value="">Select Board</option>
                {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
              <Select label="Current Class" value={form.className} onChange={set('className')} error={errors.className}>
                <option value="">Select Class</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </>
          )}

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" variant="gradient" size="lg" className="flex-1" iconRight={<ArrowRight size={18} />}>
              Continue
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleStep3Next} className="space-y-4">
          <div className="text-center mb-1">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
              <ShieldCheck className="text-blue-500" size={18} />
              Student Verification Required
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please upload your student ID card. Access is restricted to genuine students only.
            </p>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px]
              ${dragActive 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' 
                : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              name="idCard"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
              accept="image/*,.pdf"
              className="hidden"
            />

            {!form.idCard ? (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Drag & drop your ID card here, or <span className="text-blue-600 hover:underline">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Supports JPG, PNG, WEBP, or PDF up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-3 relative p-1" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-md transition-all z-10"
                >
                  <X size={14} />
                </button>

                {idCardPreview === 'pdf' ? (
                  <div className="w-full py-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                    <FileText className="text-rose-500 w-12 h-12 mb-2" />
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {form.idCard.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(form.idCard.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full max-h-[140px] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-black/5 flex items-center justify-center">
                      <img
                        src={idCardPreview}
                        alt="ID Card Preview"
                        className="object-contain w-full max-h-[140px] rounded-xl"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                        {form.idCard.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {(form.idCard.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" variant="gradient" size="lg" className="flex-1" iconRight={<ArrowRight size={18} />}>
              Continue
            </Button>
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Secure submission. Your ID card is encrypted and used solely for authenticating your status.
          </p>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-1">
            <h3 className="text-md font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1.5">
              <Camera className="text-blue-500" size={18} />
              Face ID Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please take a live selfie. This will be matched against your ID card photo.
            </p>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border-2 border-slate-200 dark:border-slate-800">
            {!liveSelfiePreview ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={liveSelfiePreview} alt="Selfie" className="w-full h-full object-cover" />
            )}
            
            <div className="absolute bottom-4 left-0 w-full flex justify-center">
              {!liveSelfiePreview ? (
                <button
                  type="button"
                  onClick={captureSelfie}
                  className="w-14 h-14 bg-white rounded-full border-4 border-slate-300 shadow-xl flex items-center justify-center hover:bg-slate-100 transition-all active:scale-95"
                >
                  <div className="w-10 h-10 border-2 border-slate-800 rounded-full" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={retakeSelfie}
                  className="px-4 py-2 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <RefreshCw size={16} /> Retake Photo
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button type="submit" variant="gradient" size="lg" className="flex-1" loading={loading} iconRight={<ArrowRight size={18} />}>
              Submit for Review
            </Button>
          </div>

          {serverError && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-red-500">Registration Failed</h4>
                  <p className="text-xs text-red-400 mt-1">{serverError}</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => {
                      setServerError(null)
                      setStep(3)
                    }}
                  >
                    <RefreshCw size={14} className="mr-2" />
                    Retake Photos & Resubmit
                  </Button>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Secure submission. Your ID card is encrypted and used solely for authenticating your status.
          </p>
        </form>
      )}
    </AuthLayout>
  )
}
