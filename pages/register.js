import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { genderOptions, educationLevels, countries, indianStates } from '../utils/data'
// Import Supabase client for user registration
import { supabase } from '../lib/supabaseClient'

/**
 * Registration Page Component with Supabase Auth
 * 
 * This page allows new users to create an account using Supabase authentication.
 * User profile information is stored in Supabase user metadata.
 */
export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    education: '',
    location: '',
    state: '',
    district: '',
    country: 'india',
    specifyCountry: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [availableDistricts, setAvailableDistricts] = useState([])
  // Loading state for Supabase registration
  const [isLoading, setIsLoading] = useState(false)
  // Loading and error state for Google OAuth
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  // Update available districts when state changes
  useEffect(() => {
    if (formData.state && formData.country === 'india') {
      const selectedState = indianStates.find(s => s.value === formData.state)
      if (selectedState) {
        setAvailableDistricts(selectedState.districts)
        // Reset district if it's not in the new state's districts
        if (formData.district && !selectedState.districts.includes(formData.district)) {
          setFormData(prev => ({ ...prev, district: '' }))
        }
      }
    } else {
      setAvailableDistricts([])
      setFormData(prev => ({ ...prev, district: '' }))
    }
  }, [formData.state, formData.country])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.gender) newErrors.gender = 'Please select your gender'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!formData.education) newErrors.education = 'Please select your education level'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    
    // Country-specific validation
    if (formData.country === 'india') {
      if (!formData.state) newErrors.state = 'Please select your state'
      if (!formData.district) newErrors.district = 'Please select your district'
    } else if (formData.country === 'others') {
      if (!formData.specifyCountry.trim()) newErrors.specifyCountry = 'Please specify your country'
    }

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

    // Age validation (must be at least 13 years old)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (age < 13 || (age === 13 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be at least 13 years old to register'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle Google OAuth sign-in
   * 
   * This function initiates the Google OAuth flow using Supabase.
   * On success, user will be redirected back to the app authenticated.
   * On failure, displays an error message to the user.
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setErrors({})
    setSuccess('')

    try {
      // Use environment variable for site URL to prevent host header injection
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/dashboard`,
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
      // If successful, user will be redirected to Google's consent page
      // No need to set loading to false as page will redirect
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error)
      setErrors({ 
        submit: 'An unexpected error occurred with Google sign-in. Please try again or use email registration.' 
      })
      setIsGoogleLoading(false)
    }
  }

  /**
   * Handle form submission with Supabase Auth
   * 
   * Steps:
   * 1. Validate form data
   * 2. Register user with Supabase Auth (email + password)
   * 3. Store profile data in user metadata
   * 4. Show success message and redirect to login
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Register new user with Supabase Auth
      // This creates an account and sends a confirmation email
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Store user profile data in metadata
          // This data will be accessible through the user object
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            gender: formData.gender,
            date_of_birth: formData.dateOfBirth,
            education: formData.education,
            location: formData.location,
            state: formData.state,
            district: formData.district,
            country: formData.country,
            specify_country: formData.specifyCountry
          }
        }
      })

      if (signUpError) {
        // Handle Supabase registration errors
        if (signUpError.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered' })
        } else {
          setErrors({ submit: signUpError.message })
        }
        setIsLoading(false)
        return
      }

      // Registration successful!
      setSuccess('Registration successful! Please check your email to confirm your account.')
      setIsLoading(false)

      // Store email for prefilling on login page
      sessionStorage.setItem('prefilledEmail', formData.email)

      // Redirect to login after 3 seconds
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
        <title>Register - iiskills.cloud</title>
        <meta name="description" content="Create your iiskills.cloud account - Indian Institute of Professional Skills Development" />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-neutral py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-2 text-center">Create Your Account</h1>
          <p className="text-center text-charcoal mb-6">Join the Indian Institute of Professional Skills Development</p>
          
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
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
                  <p className="text-amber-600 text-xs mt-1">⚠️ This name will appear on your certificates and cannot be changed later</p>
                </div>

                {/* Last Name */}
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
                  <p className="text-amber-600 text-xs mt-1">⚠️ This name will appear on your certificates and cannot be changed later</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="dateOfBirth">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={(() => {
                      const today = new Date()
                      return today.toISOString().split('T')[0]
                    })()}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
              </div>
            </div>

            {/* Education and Location Section */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Education & Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="education">
                    Education Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.education ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select education level</option>
                    {educationLevels.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your location"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-charcoal font-semibold mb-2" htmlFor="country">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {countries.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* State (only for India) */}
                {formData.country === 'india' && (
                  <div>
                    <label className="block text-charcoal font-semibold mb-2" htmlFor="state">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select state</option>
                      {indianStates.map(state => (
                        <option key={state.value} value={state.value}>{state.name}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                )}

                {/* District (only for India and when state is selected) */}
                {formData.country === 'india' && formData.state && (
                  <div>
                    <label className="block text-charcoal font-semibold mb-2" htmlFor="district">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select district</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  </div>
                )}

                {/* Specify Country (only for others) */}
                {formData.country === 'others' && (
                  <div>
                    <label className="block text-charcoal font-semibold mb-2" htmlFor="specifyCountry">
                      Specify Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="specifyCountry"
                      name="specifyCountry"
                      value={formData.specifyCountry}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${errors.specifyCountry ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your country name"
                    />
                    {errors.specifyCountry && <p className="text-red-500 text-sm mt-1">{errors.specifyCountry}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Account Credentials Section */}
            <div>
              <h2 className="text-xl font-semibold text-charcoal mb-4">Account Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="md:col-span-2">
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

                {/* Password */}
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

                {/* Confirm Password */}
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

            {/* Submit Button */}
            <div className="flex flex-col items-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto bg-primary text-white font-bold py-3 px-8 rounded hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
              <p className="mt-4 text-charcoal">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}