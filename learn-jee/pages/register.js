import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase, getSiteUrl } from '../lib/supabaseClient'

/**
 * Registration Page for Learn-Apt
 * 
 * Simplified registration that creates accounts in the shared Supabase project.
 * Registered users can access all iiskills.cloud services.
 */
export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    qualification: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    
    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (isNaN(formData.age) || formData.age < 10 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age between 10 and 100'
    }
    
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required'

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setErrors({})
    setSuccess('')

    try {
      const siteUrl = getSiteUrl()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/learn`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('Google sign-in error:', error)
        setErrors({ 
          submit: `Failed to sign in with Google: ${error.message}. Please try again or use email registration.` 
        })
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error)
      setErrors({ 
        submit: 'An unexpected error occurred with Google sign-in. Please try again or use email registration.' 
      })
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            age: parseInt(formData.age),
            qualification: formData.qualification
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered' })
        } else {
          setErrors({ submit: signUpError.message })
        }
        setIsLoading(false)
        return
      }

      setSuccess('Registration successful! Please check your email to confirm your account.')
      setIsLoading(false)

      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Register - Learn Winning</title>
        <meta name="description" content="Create your account for Learn Winning" />
        <meta name="description" content="Create your account for Learn Winning - Develop a winning mindset" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Create Your Account</h1>
          <p className="text-center text-charcoal mb-6">Join Learn JEE to start your journey</p>
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          {/* Google Sign-in Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg shadow transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with email</span>
              </div>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This account will work across all iiskills.cloud services. 
              Get free access to Chapter 1, Lesson 1 immediately upon registration!
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="age">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="10"
                    max="100"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your age"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="qualification">
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.qualification ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select qualification</option>
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                    <option value="PhD">PhD</option>
                    <option value="Professional Certification">Professional Certification</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Account Credentials</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-charcoal font-semibold mb-2" htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter password (min. 8 characters)"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-charcoal font-semibold mb-2" htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Re-enter your password"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold py-3 px-8 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="mt-4 text-charcoal">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Log in here
                </Link>
              </p>
              <p className="mt-2 text-sm text-charcoal">
                <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
    </>
  )
}
