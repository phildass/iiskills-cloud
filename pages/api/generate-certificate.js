/**
 * API endpoint for certificate generation
 * This endpoint generates certificate data for a user who has passed a course
 * 
 * POST /api/generate-certificate
 * Body: {
 *   userId: number,
 *   courseId: number,
 *   userName: string,
 *   courseName: string,
 *   score: number
 * }
 */

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId, courseId, userName, courseName, score } = req.body

    // Validation
    if (!userId || !courseId || !userName || !courseName) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, courseId, userName, courseName' 
      })
    }

    // Check if user passed (score >= 50)
    if (typeof score !== 'number' || score < 50) {
      return res.status(400).json({ 
        error: 'Certificate can only be generated for passing scores (>= 50%)',
        details: 'Score must be a number and at least 50'
      })
    }

    // Generate certificate number
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const userPart = String(userId).padStart(4, '0')
    const coursePart = String(courseId).padStart(3, '0')
    const certificateNo = `IIPS-${year}${month}-${coursePart}${userPart}`

    // Generate certificate data
    const certificateData = {
      certificateNo,
      userName,
      courseName,
      score,
      completionDate: now.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      issueDate: now.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      qrCodeData: `https://iiskills.cloud/verify/${certificateNo}`,
      timestamp: now.toISOString()
    }

    // In a production environment, you would:
    // 1. Save certificate data to database
    // 2. Generate the actual PDF (server-side with Puppeteer if needed)
    // 3. Store the PDF in cloud storage
    // 4. Send email notification to user
    // 5. Return download URL

    return res.status(200).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificateData
    })
  } catch (error) {
    console.error('Error generating certificate:', error)
    return res.status(500).json({ 
      error: 'Failed to generate certificate',
      message: error.message 
    })
  }
}
