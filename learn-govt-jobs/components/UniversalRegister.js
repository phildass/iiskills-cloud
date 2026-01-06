import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

// Static data for registration form
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'transgender', label: 'Transgender' },
  { value: 'prefer-not-to-say', label: "I don't want to say" }
]

const educationLevels = [
  { value: 'studying', label: 'Studying' },
  { value: 'matriculation', label: 'Matriculation' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'post-graduate', label: 'Post Graduate' },
  { value: 'other', label: 'Other' }
]

const countries = [
  { value: 'india', label: 'India' },
  { value: 'others', label: 'Others' }
]

// Simplified Indian states list for registration
const indianStates = [
  { name: 'Andhra Pradesh', value: 'andhra-pradesh', districts: [] },
  { name: 'Bihar', value: 'bihar', districts: [] },
  { name: 'Delhi', value: 'delhi', districts: [] },
  { name: 'Gujarat', value: 'gujarat', districts: [] },
  { name: 'Karnataka', value: 'karnataka', districts: [] },
  { name: 'Kerala', value: 'kerala', districts: [] },
  { name: 'Maharashtra', value: 'maharashtra', districts: [] },
  { name: 'Tamil Nadu', value: 'tamil-nadu', districts: [] },
  { name: 'Uttar Pradesh', value: 'uttar-pradesh', districts: [] },
  { name: 'West Bengal', value: 'west-bengal', districts: [] }
]

/**
 * Universal Registration Component
 * 
 * This component provides a standardized registration form that can be used
 * across all iiskills.cloud apps and subdomains. It supports both:
 * - Full registration (with all fields)
 * - Simplified registration (minimal fields)
 * 
 * All registrations write to the same Supabase user pool, enabling
 * single sign-on across all apps.
 * 
 * Features:
 * - Configurable field requirements
 * - Email/password registration
 * - Google OAuth registration
 * - Automatic session creation
 * - Cross-subdomain authentication support
 * 
 * Usage:
 * <UniversalRegister 
 *   simplified={false} 
 *   redirectAfterRegister="/dashboard"
 *   appName="iiskills.cloud"
 * />
 */
export default function UniversalRegister({ 
  simplified = false, 
  redirectAfterRegister = '/login',
  appName = 'iiskills.cloud',
  showGoogleAuth = true
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    education: '',
    qualification: '',
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
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  // Update available districts when state changes
  useEffect(() => {
    if (!simplified && formData.state && formData.country === 'india') {
      const selectedState = indianStates.find(s => s.value === formData.state)
      if (selectedState) {
        setAvailableDistricts(selectedState.districts)
        if (formData.district && !selectedState.districts.includes(formData.district)) {
          setFormData(prev => ({ ...prev, district: '' }))
        }
      }
    } else {
      setAvailableDistricts([])
      setFormData(prev => ({ ...prev, district: '' }))
    }
  }, [formData.state, formData.country, simplified])

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

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'

    if (!simplified) {
      // Full form validation
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
    } else {
      // Simplified form - age and qualification
      if (formData.age) {
        if (isNaN(formData.age) || formData.age < 10 || formData.age > 100) {
          newErrors.age = 'Please enter a valid age between 10 and 100'
        }
      }
      if (formData.qualification && formData.qualification.trim()) {
        // Valid qualification provided
      }
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare user metadata based on form type
      const userMetadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        full_name: `${formData.firstName} ${formData.lastName}`,
      }

      if (!simplified) {
        // Full form metadata
        userMetadata.gender = formData.gender
        userMetadata.date_of_birth = formData.dateOfBirth
        userMetadata.education = formData.education
        userMetadata.location = formData.location
        userMetadata.state = formData.state
        userMetadata.district = formData.district
        userMetadata.country = formData.country
        if (formData.country === 'others') {
          userMetadata.specify_country = formData.specifyCountry
        }
      } else {
        // Simplified form metadata
        if (formData.age) {
          userMetadata.age = parseInt(formData.age)
        }
        if (formData.qualification) {
          userMetadata.qualification = formData.qualification
        }
      }

      // Create user account in shared Supabase instance
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userMetadata,
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setErrors({ email: 'This email is already registered. Please login instead.' })
        } else {
          setErrors({ submit: signUpError.message })
        }
        setIsLoading(false)
        return
      }

      if (authData.user) {
        setSuccess(
          'Registration successful! You can now access all iiskills.cloud apps with this account. ' +
          'Please check your email to confirm your account, then proceed to login.'
        )
        
        // Store registration success flag
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('registrationSuccess', 'true')
        }
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push(redirectAfterRegister)
        }, 2000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${redirectAfterRegister}` 
        : undefined

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      })

      if (error) {
        setErrors({ submit: error.message })
        setIsGoogleLoading(false)
      }
      // If successful, user will be redirected by OAuth flow
    } catch (error) {
      console.error('Google sign up error:', error)
      setErrors({ submit: 'Failed to sign up with Google. Please try again.' })
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register once, access all {appName} apps and services
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {showGoogleAuth && (
          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
            </button>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with email</span>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          {!simplified ? (
            // Full registration form fields
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Education */}
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  Education Level *
                </label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.education ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Select Education Level</option>
                  {educationLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location/City *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>

              {formData.country === 'india' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state.value} value={state.value}>{state.name}</option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>

                  {/* District */}
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      District *
                    </label>
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className={`mt-1 block w-full px-3 py-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
                  </div>
                </div>
              )}

              {formData.country === 'others' && (
                <div>
                  <label htmlFor="specifyCountry" className="block text-sm font-medium text-gray-700">
                    Specify Country *
                  </label>
                  <input
                    id="specifyCountry"
                    name="specifyCountry"
                    type="text"
                    value={formData.specifyCountry}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    className={`mt-1 block w-full px-3 py-2 border ${errors.specifyCountry ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.specifyCountry && <p className="mt-1 text-sm text-red-600">{errors.specifyCountry}</p>}
                </div>
              )}
            </>
          ) : (
            // Simplified registration form fields
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="10"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
              </div>

              {/* Qualification */}
              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualification
                </label>
                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, MBA"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>✓ Universal Access:</strong> This account works across all iiskills.cloud apps including 
              main site, Learn-Apt, Learn-JEE, Learn-NEET, and all other learning modules.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
