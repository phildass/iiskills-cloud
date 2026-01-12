# Certificate System Integration Examples

This document provides code examples for integrating the certificate generation system into your user workflow.

## Example 1: Generate Certificate After Course Completion

```javascript
// pages/courses/[courseId]/test-results.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function TestResults() {
  const router = useRouter();
  const [testData, setTestData] = useState(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  // After user completes a test
  const handleTestCompletion = async (score, userId, courseId, userName, courseName) => {
    // Check if user passed (score >= 50%)
    if (score >= 50) {
      try {
        // Call API to generate certificate data
        const response = await fetch("/api/generate-certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            courseId,
            userName,
            courseName,
            score,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setCertificateGenerated(true);

          // Save certificate to database
          await saveCertificateToDatabase(result.data);

          // Send email notification
          await sendCertificateEmail(userName, result.data.certificateNo);

          // Show success message
          alert(
            `Congratulations! Your certificate ${result.data.certificateNo} has been generated.`
          );
        }
      } catch (error) {
        console.error("Error generating certificate:", error);
      }
    }
  };

  return (
    <div>
      {/* Show test results */}
      {certificateGenerated && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Congratulations! You Passed!</h3>
          <p className="text-green-700 mb-4">
            Your certificate has been generated and is ready to download.
          </p>
          <a
            href="/my-certificates"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            View My Certificate
          </a>
        </div>
      )}
    </div>
  );
}
```

## Example 2: Certificate Management in User Dashboard

```javascript
// pages/dashboard.js
import { useState, useEffect } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserCertificates();
  }, []);

  const loadUserCertificates = async () => {
    try {
      // Fetch user's certificates from database
      const response = await fetch("/api/user/certificates");
      const data = await response.json();
      setCertificates(data.certificates);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      {/* Certificates Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Certificates</h2>
          <Link href="/my-certificates" className="text-primary hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <p>Loading certificates...</p>
        ) : certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.slice(0, 4).map((cert) => (
              <div
                key={cert.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-bold text-lg mb-1">{cert.courseName}</h3>
                <p className="text-sm text-gray-600">
                  Score: {cert.score}% | {cert.completionDate}
                </p>
                <p className="text-xs text-gray-500 mt-1">Certificate No: {cert.certificateNo}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No certificates yet. Complete a course to earn your first certificate!</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Example 3: Email Notification with Certificate

```javascript
// utils/emailNotifications.js

export async function sendCertificateEmail(userName, userEmail, certificateData) {
  const { certificateNo, courseName, score } = certificateData;

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1e40af;">Congratulations, ${userName}! 🎉</h1>
      
      <p>You have successfully completed <strong>${courseName}</strong> with a score of <strong>${score}%</strong>!</p>
      
      <p>Your certificate has been generated and is ready for download.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Certificate Number:</strong> ${certificateNo}</p>
        <p style="margin: 10px 0 0 0;"><strong>Course:</strong> ${courseName}</p>
      </div>
      
      <a href="https://iiskills.cloud/my-certificates" 
         style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
        Download Certificate
      </a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
        You can verify your certificate anytime by visiting:<br>
        <a href="https://iiskills.cloud/verify/${certificateNo}" style="color: #1e40af;">
          https://iiskills.cloud/verify/${certificateNo}
        </a>
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <p style="font-size: 12px; color: #9ca3af;">
        Indian Institute of Professional Skills Development<br>
        iiskills.cloud | Education for All, Online and Affordable
      </p>
    </div>
  `;

  // Send email using your email service (SendGrid, AWS SES, etc.)
  // This is a placeholder - implement based on your email service
  try {
    await yourEmailService.send({
      to: userEmail,
      from: "noreply@iiskills.cloud",
      subject: `🎓 Certificate Ready - ${courseName}`,
      html: emailTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
```

## Example 4: Database Schema for Certificates

```sql
-- SQL Schema for Certificate Storage
CREATE TABLE certificates (
  id SERIAL PRIMARY KEY,
  certificate_no VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  course_id INTEGER NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 50),
  completion_date DATE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  qr_code_data TEXT,
  pdf_url TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Index for quick lookups
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_certificate_no ON certificates(certificate_no);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);
```

## Example 5: API Route for Fetching User Certificates

```javascript
// pages/api/user/certificates.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get user ID from session/token
    const userId = req.session?.user?.id || req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Query database for user's certificates
    const certificates = await db.query(
      `SELECT 
        id, 
        certificate_no, 
        course_name, 
        score, 
        completion_date, 
        issue_date,
        pdf_url
      FROM certificates 
      WHERE user_id = $1 
      AND is_valid = true
      ORDER BY issue_date DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      certificates: certificates.rows,
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return res.status(500).json({
      error: "Failed to fetch certificates",
      message: error.message,
    });
  }
}
```

## Example 6: Verification API Route

```javascript
// pages/api/verify-certificate.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { certificateNo } = req.query;

    if (!certificateNo) {
      return res.status(400).json({ error: "Certificate number is required" });
    }

    // Query database for certificate
    const result = await db.query(
      `SELECT 
        c.*,
        u.name as user_name,
        co.name as course_name
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      JOIN courses co ON c.course_id = co.id
      WHERE c.certificate_no = $1
      AND c.is_valid = true`,
      [certificateNo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found or invalid",
      });
    }

    const certificate = result.rows[0];

    return res.status(200).json({
      success: true,
      isValid: true,
      certificate: {
        certificateNo: certificate.certificate_no,
        userName: certificate.user_name,
        courseName: certificate.course_name,
        score: certificate.score,
        completionDate: certificate.completion_date,
        issueDate: certificate.issue_date,
      },
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return res.status(500).json({
      error: "Failed to verify certificate",
      message: error.message,
    });
  }
}
```

## Example 7: Using Certificate Template in Custom Component

```javascript
// components/CustomCertificatePreview.js
import CertificateTemplate from "./CertificateTemplate";

export default function CustomCertificatePreview({ userData, courseData }) {
  return (
    <div className="certificate-preview-wrapper">
      <CertificateTemplate
        userName={userData.fullName}
        courseName={courseData.title}
        certificateNo={generateCertificateNumber(userData.id, courseData.id)}
        completionDate={new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        score={userData.finalScore}
        issueDate={new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        qrCodeData={`https://iiskills.cloud/verify/${generateCertificateNumber(userData.id, courseData.id)}`}
      />
    </div>
  );
}

function generateCertificateNumber(userId, courseId) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const userPart = String(userId).padStart(4, "0");
  const coursePart = String(courseId).padStart(3, "0");

  return `IIPS-${year}${month}-${coursePart}${userPart}`;
}
```

## Example 8: Batch Certificate Generation

```javascript
// utils/batchCertificateGenerator.js

export async function generateCertificatesForCourse(courseId, passingUsers) {
  const results = [];

  for (const user of passingUsers) {
    try {
      const response = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId: courseId,
          userName: user.name,
          courseName: user.courseName,
          score: user.score,
        }),
      });

      const result = await response.json();

      if (result.success) {
        results.push({
          userId: user.id,
          success: true,
          certificateNo: result.data.certificateNo,
        });

        // Send email
        await sendCertificateEmail(user.name, user.email, result.data);
      } else {
        results.push({
          userId: user.id,
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      results.push({
        userId: user.id,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

// Usage:
// const passingUsers = await getPassingUsersForCourse(courseId)
// const results = await generateCertificatesForCourse(courseId, passingUsers)
```

## Integration Checklist

When integrating the certificate system:

- [ ] Set up database schema for certificates
- [ ] Create API routes for certificate CRUD operations
- [ ] Connect user authentication system
- [ ] Implement automatic certificate generation on course completion
- [ ] Set up email delivery service
- [ ] Configure cloud storage for PDFs (optional)
- [ ] Add certificate links to user dashboard
- [ ] Implement certificate verification with database lookup
- [ ] Add admin interface for certificate management
- [ ] Set up logging and monitoring
- [ ] Test with real user data
- [ ] Implement backup and recovery procedures
- [ ] Add analytics tracking for certificate downloads

## Best Practices

1. **Generate Unique Certificate Numbers**: Use a combination of timestamp, user ID, and course ID
2. **Store PDFs in Cloud**: Don't store large PDFs in database, use cloud storage URLs
3. **Cache Certificate Data**: Cache frequently accessed certificates
4. **Validate Before Generation**: Always verify user has passing score
5. **Log All Operations**: Keep audit trail of certificate generations
6. **Handle Errors Gracefully**: Implement retry logic for failed generations
7. **Send Notifications**: Email users when certificates are ready
8. **Implement Revocation**: Have a way to invalidate certificates if needed
9. **Monitor Performance**: Track generation time and success rate
10. **Backup Regularly**: Keep backups of certificate data
