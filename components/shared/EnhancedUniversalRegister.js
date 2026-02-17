"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@lib/supabaseClient";
import { indianStates } from "@utils/data";
import { getCurrentApp, getAuthRedirectUrl } from "@lib/appRegistry";
import { recordLoginApp, getBestAuthRedirect, initSessionManager } from "@lib/sessionManager";

/**
 * Enhanced Universal Registration Component
 * 
 * Per Product Requirements 14.2, this component provides comprehensive
 * registration with all required fields:
 * - Personal info (First Name, Last Name, Age)
 * - Stage (Student, Employed, Other)
 * - Parents' occupation
 * - Location details (Taluk, District, State, or Other for non-India)
 * - Phone Number
 * - Purpose (Just Browsing, Intend to take a course)
 * - CAPTCHA
 * - User status display
 */
export default function EnhancedUniversalRegister({
  redirectAfterRegister = "/login",
  appName = "iiskills.cloud",
  showGoogleAuth = true,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    stage: "",
    fatherOccupation: "",
    motherOccupation: "",
    taluk: "",
    district: "",
    state: "",
    country: "india",
    locationOther: "",
    phoneNumber: "",
    purpose: "",
    email: "",
    password: "",
    confirmPassword: "",
    captchaChecked: false,
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [userStatus, setUserStatus] = useState({
    paidUser: false,
    registeredUser: false,
    validEmail: false,
    registeredViaGoogle: false,
  });
  const router = useRouter();

  // Initialize session manager
  useEffect(() => {
    initSessionManager();
    const currentApp = getCurrentApp();
    if (currentApp) {
      recordLoginApp(currentApp.id);
    }
  }, []);

  // Update available districts when state changes
  useEffect(() => {
    if (formData.state && formData.country === "india") {
      const selectedState = indianStates.find((s) => s.value === formData.state);
      if (selectedState) {
        setAvailableDistricts(selectedState.districts);
        if (formData.district && !selectedState.districts.includes(formData.district)) {
          setFormData((prev) => ({ ...prev, district: "" }));
        }
      }
    } else {
      setAvailableDistricts([]);
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [formData.state, formData.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.stage) newErrors.stage = "Stage is required";
    if (!formData.fatherOccupation.trim()) newErrors.fatherOccupation = "Father's occupation is required";
    if (!formData.motherOccupation.trim()) newErrors.motherOccupation = "Mother's occupation is required";
    
    // Location validation
    if (formData.country === "india") {
      if (!formData.taluk.trim()) newErrors.taluk = "Taluk is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.state) newErrors.state = "State is required";
    } else {
      if (!formData.locationOther.trim()) newErrors.locationOther = "Location is required for non-India residents";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.captchaChecked) {
      newErrors.captcha = "Please confirm you are not a robot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register user with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: formData.age,
            stage: formData.stage,
            father_occupation: formData.fatherOccupation,
            mother_occupation: formData.motherOccupation,
            taluk: formData.taluk,
            district: formData.district,
            state: formData.state,
            country: formData.country,
            location_other: formData.locationOther,
            phone_number: formData.phoneNumber,
            purpose: formData.purpose,
            registered_via: "email",
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setErrors({ email: "This email is already registered. Please sign in instead." });
        } else {
          setErrors({ general: signUpError.message });
        }
        setIsLoading(false);
        return;
      }

      // Update user status
      setUserStatus({
        paidUser: false,
        registeredUser: true,
        validEmail: false, // Will be true after email verification
        registeredViaGoogle: false,
      });

      // Success message
      setSuccess(
        "Registration successful! Please check your email to verify your account. " +
        "An automated welcome email has been sent which will also verify your email address."
      );

      // Store registration success in session storage for login page
      sessionStorage.setItem("registrationSuccess", "true");

      // Redirect to login page after a delay
      setTimeout(() => {
        router.push(redirectAfterRegister);
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const bestRedirect = getBestAuthRedirect(router.query.redirect);
      const targetPath = bestRedirect?.path || redirectAfterRegister;
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${targetPath}`
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        setErrors({ general: error.message });
        setIsGoogleLoading(false);
      }
      // If successful, browser will redirect to Google
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({ general: "Failed to initiate Google login. Please try again." });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Recommendation Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            We request you to use your real name if you wish to take certification courses. 
            Though we have Google login, we suggest you register here for a more streamlined experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Register for {appName}
          </h1>

          {/* Error and Success Messages */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your first name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your last name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Age and Stage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="150"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your age"
                />
                {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                  Stage *
                </label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.stage ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select your stage</option>
                  <option value="student">Student</option>
                  <option value="employed">Employed</option>
                  <option value="other">Other</option>
                </select>
                {errors.stage && <p className="mt-1 text-xs text-red-600">{errors.stage}</p>}
              </div>
            </div>

            {/* Parents' Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Occupation *
                </label>
                <input
                  type="text"
                  id="fatherOccupation"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.fatherOccupation ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Father's occupation"
                />
                {errors.fatherOccupation && <p className="mt-1 text-xs text-red-600">{errors.fatherOccupation}</p>}
              </div>

              <div>
                <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Occupation *
                </label>
                <input
                  type="text"
                  id="motherOccupation"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.motherOccupation ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Mother's occupation"
                />
                {errors.motherOccupation && <p className="mt-1 text-xs text-red-600">{errors.motherOccupation}</p>}
              </div>
            </div>

            {/* Location Information */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="india">India</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.country === "india" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select state</option>
                    {indianStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } ${!formData.state ? "bg-gray-100" : ""}`}
                  >
                    <option value="">Select district</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {errors.district && <p className="mt-1 text-xs text-red-600">{errors.district}</p>}
                </div>

                <div>
                  <label htmlFor="taluk" className="block text-sm font-medium text-gray-700 mb-1">
                    Taluk *
                  </label>
                  <input
                    type="text"
                    id="taluk"
                    name="taluk"
                    value={formData.taluk}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.taluk ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Your taluk"
                  />
                  {errors.taluk && <p className="mt-1 text-xs text-red-600">{errors.taluk}</p>}
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="locationOther" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="locationOther"
                  name="locationOther"
                  value={formData.locationOther}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.locationOther ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="City, Country"
                />
                {errors.locationOther && <p className="mt-1 text-xs text-red-600">{errors.locationOther}</p>}
              </div>
            )}

            {/* Phone Number and Purpose */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+91 1234567890"
                />
                {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.purpose ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select purpose</option>
                  <option value="browsing">Just Browsing</option>
                  <option value="course">Intend to take a course</option>
                </select>
                {errors.purpose && <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>}
              </div>
            </div>

            {/* Account Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="captchaChecked"
                name="captchaChecked"
                checked={formData.captchaChecked}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="captchaChecked" className="ml-2 block text-sm text-gray-700">
                I'm not a robot *
              </label>
            </div>
            {errors.captcha && <p className="text-xs text-red-600">{errors.captcha}</p>}

            {/* User Status Display */}
            {(userStatus.registeredUser || userStatus.paidUser || userStatus.validEmail || userStatus.registeredViaGoogle) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">User Status:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  {userStatus.paidUser && <p>✓ Paid User</p>}
                  {userStatus.registeredUser && <p>✓ Registered User</p>}
                  {userStatus.validEmail && <p>✓ Valid Email (verified)</p>}
                  {userStatus.registeredViaGoogle && <p>✓ Registered Via Google</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Google Sign In */}
          {showGoogleAuth && (
            <>
              <div className="mt-6 text-center">
                <span className="text-gray-500 text-sm">or</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="mt-4 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? "Redirecting to Google..." : "Login with Google"}
              </button>
            </>
          )}

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
