import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, isAdmin } from '../../lib/supabaseClient'

export default function Analytics() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adminAccess, setAdminAccess] = useState(false)
  const [timeRange, setTimeRange] = useState('30') // 7, 30, 90 days
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login?redirect=/admin/analytics')
      return
    }
    
    setUser(currentUser)
    const hasAdminAccess = await isAdmin(currentUser)
    setAdminAccess(hasAdminAccess)
    
    if (!hasAdminAccess) {
      alert('Admin access required')
      router.push('/learn')
      return
    }
    
    setIsLoading(false)
  }

  // Mock analytics data
  const stats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    pendingPayments: 45,
    expiredSubscriptions: 310,
    totalRevenue: 4453108, // in rupees
    avgProgress: 37.5,
    completionRate: 12.3
  }

  const subjectEngagement = [
    { subject: 'Physics', activeUsers: 756, avgProgress: 42, testsCompleted: 2134 },
    { subject: 'Chemistry', activeUsers: 823, avgProgress: 39, testsCompleted: 2456 },
    { subject: 'Biology', activeUsers: 798, avgProgress: 31, testsCompleted: 1987 }
  ]

  const topModules = [
    { name: 'Physics - Mechanics', completions: 423, avgScore: 78.5 },
    { name: 'Chemistry - Organic Chemistry', completions: 389, avgScore: 72.3 },
    { name: 'Biology - Cell Biology', completions: 456, avgScore: 81.2 },
    { name: 'Physics - Electromagnetism', completions: 367, avgScore: 69.8 },
    { name: 'Chemistry - Chemical Bonding', completions: 401, avgScore: 75.6 }
  ]

  const recentActivity = [
    { user: 'Rahul S.', action: 'Completed Physics Module 3', time: '2 hours ago' },
    { user: 'Priya P.', action: 'Scored 85% in Chemistry Test', time: '4 hours ago' },
    { user: 'Amit K.', action: 'Registered - Pending Payment', time: '5 hours ago' },
    { user: 'Sneha M.', action: 'Unlocked Premium Resources', time: '1 day ago' },
    { user: 'Vikram R.', action: 'Completed Biology Module 5', time: '1 day ago' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Analytics Dashboard - Learn NEET Admin</title>
        <meta name="description" content="View analytics and performance metrics" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Usage statistics and performance metrics</p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <Link href="/admin" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                  ← Back to Admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-3xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">↑ 12% from last period</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Subscriptions</span>
                <span className="text-2xl">✓</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.activeSubscriptions.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">↑ 8% from last period</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg. Progress</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.avgProgress}%</div>
              <div className="text-xs text-green-600 mt-1">↑ 5% from last period</div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
              <div className="text-xs text-green-600 mt-1">↑ 15% from last period</div>
            </div>
          </div>

          {/* Subject Engagement */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-primary mb-6">Subject Engagement</h3>
            <div className="space-y-6">
              {subjectEngagement.map((subject) => (
                <div key={subject.subject} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {subject.subject === 'Physics' ? '⚛️' : subject.subject === 'Chemistry' ? '🧪' : '🧬'}
                      </span>
                      <h4 className="text-lg font-bold text-charcoal">{subject.subject}</h4>
                    </div>
                    <span className="text-sm text-gray-600">{subject.activeUsers} active users</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Average Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${subject.avgProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{subject.avgProgress}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Tests Completed</div>
                      <div className="text-2xl font-bold text-primary">{subject.testsCompleted}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Active Users</div>
                      <div className="text-2xl font-bold text-green-600">{subject.activeUsers}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Top Modules */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-6">Top Performing Modules</h3>
              <div className="space-y-4">
                {topModules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-charcoal">{module.name}</div>
                      <div className="text-sm text-gray-600">{module.completions} completions</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{module.avgScore}%</div>
                      <div className="text-xs text-gray-600">Avg Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-primary mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">👤</div>
                    <div className="flex-1">
                      <div className="font-semibold text-charcoal">{activity.user}</div>
                      <div className="text-sm text-gray-700">{activity.action}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">📈</div>
              <div className="text-3xl font-bold mb-2">{stats.completionRate}%</div>
              <div className="text-sm opacity-90">Course Completion Rate</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">⏳</div>
              <div className="text-3xl font-bold mb-2">{stats.pendingPayments}</div>
              <div className="text-sm opacity-90">Pending Payments</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-3xl font-bold mb-2">{stats.expiredSubscriptions}</div>
              <div className="text-sm opacity-90">Expired Subscriptions</div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">📊 Mock Analytics Data</h4>
            <p className="text-blue-800">
              The analytics data shown above is mock data for demonstration purposes. In production, this would be 
              connected to your database and analytics service to display real-time usage statistics, user engagement 
              metrics, and performance data.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
