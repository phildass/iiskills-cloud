import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { genderOptions, educationLevels, countries, indianStates } from '../utils/data'

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setSuccess('')
    
    if (!validateForm()) {
      return
    }

    // Save to localStorage (mock backend)
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if email already exists
      if (users.some(user => user.email === formData.email)) {
        setErrors({ email: 'This email is already registered' })
        return
      }

      // Add new user
      // NOTE: This is a MOCK implementation for demonstration only
      // In a real application, passwords MUST be hashed (e.g., bcrypt) before storage
      // and authentication should use a secure backend API
      const newUser = {
        id: Date.now(),
        ...formData,
        password: formData.password, // WARNING: Plain text password - for demo only!
        registeredAt: new Date().toISOString()
      }
      delete newUser.confirmPassword // Don't store confirm password

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Set success message
      setSuccess('Registration successful! Redirecting to login...')

      // Store email for prefilling on login page
      sessionStorage.setItem('prefilledEmail', formData.email)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setErrors({ submit: 'An error occurred during registration. Please try again.' })
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