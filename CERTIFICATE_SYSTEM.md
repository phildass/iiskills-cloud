# Certificate Generation System

## Overview

This professional certificate generation system provides a complete solution for generating, downloading, and verifying certificates for users who successfully complete courses with passing scores (≥50%).

## Features

✅ **Professional Certificate Design**
- Elegant double border with decorative corners
- Organization logo and branding
- Professional typography using Georgia serif font
- Prominent recipient name display
- Course name and completion details
- Two signature fields (Director and Program Director)
- Optional QR code for instant verification
- Optional verification seal/badge

✅ **PDF Generation**
- Client-side PDF generation using jsPDF and html2canvas
- High-quality output (2x scale for sharp rendering)
- Landscape format optimized for certificates
- Automatic filename generation based on user and course name

✅ **Certificate Verification**
- QR code on each certificate for instant verification
- Dedicated verification page at `/verify/[certificateNo]`
- Display of certificate details for verified certificates

✅ **User Experience**
- Certificate preview before download
- Multiple certificates per user supported
- Easy download with single click
- Responsive design for various screen sizes

## File Structure

```
iiskills-cloud/
├── components/
│   └── CertificateTemplate.js       # Certificate template component
├── pages/
│   ├── my-certificates.js           # User certificate dashboard
│   ├── verify/
│   │   └── [certificateNo].js       # Certificate verification page
│   └── api/
│       └── generate-certificate.js  # API endpoint for certificate generation
└── utils/
    └── certificateGenerator.js      # PDF generation utilities
```

## Usage

### For Users

1. **Access Your Certificates**
   - Navigate to `/my-certificates` after logging in
   - View all earned certificates from completed courses

2. **Download Certificate**
   - Select a certificate from the list
   - Preview the certificate
   - Click "Download PDF" button
   - PDF will be saved to your downloads folder

3. **Verify a Certificate**
   - Scan the QR code on the certificate, or
   - Visit `/verify/[certificate-number]` manually
   - View verification status and certificate details

### For Developers

#### Generating a Certificate

```javascript
import CertificateTemplate from '../components/CertificateTemplate'
import { generateCertificatePDF, downloadPDF } from '../utils/certificateGenerator'

// In your component
const handleGenerateCertificate = async () => {
  const element = certificateRef.current
  
  const pdf = await generateCertificatePDF(element, {
    userName: "John Doe",
    courseName: "Digital Marketing"
  })
  
  downloadPDF(pdf, "certificate_john_doe_digital_marketing")
}
```

#### Using the API Endpoint

```javascript
// POST /api/generate-certificate
const response = await fetch('/api/generate-certificate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1001,
    courseId: 5,
    userName: "John Doe",
    courseName: "Digital Marketing",
    score: 85
  })
})

const { data } = await response.json()
console.log(data.certificateNo) // IIPS-202412-0051001
```

#### Certificate Template Props

```javascript
<CertificateTemplate
  userName="John Doe"                    // Required
  courseName="Digital Marketing"         // Required
  certificateNo="IIPS-202412-0051001"   // Required
  completionDate="22 December, 2024"    // Required
  score={85}                            // Optional
  issueDate="22 December, 2024"         // Optional
  qrCodeData="https://..."              // Optional
/>
```

## Integration with User Flow

### Passing Score Workflow

When a user completes a course with a passing score:

1. **Automatic Certificate Generation**
   ```javascript
   // After test submission, if score >= 50%
   if (userScore >= 50) {
     const certificateData = generateCertificateData(userData, courseData)
     // Save to database
     // Trigger notification
   }
   ```

2. **Database Storage** (to be implemented)
   - Store certificate data in your database
   - Link to user and course records
   - Track issue date and certificate number

3. **Email Notification** (to be implemented)
   - Send congratulations email with certificate link
   - Include download instructions
   - Provide verification URL

4. **User Dashboard**
   - Display certificates on `/my-certificates` page
   - Allow download anytime
   - Show verification status

## Certificate Number Format

Format: `IIPS-YYYYMM-CCCUUUU`

- `IIPS`: Organization prefix
- `YYYY`: Year
- `MM`: Month (01-12)
- `CCC`: Course ID (padded to 3 digits)
- `UUUU`: User ID (padded to 4 digits)

Example: `IIPS-202412-0051001`
- Issued in December 2024
- Course ID: 5
- User ID: 1001

## Customization

### Changing Colors

Edit the certificate template in `components/CertificateTemplate.js`:

```javascript
// Primary color (blue)
borderColor: '#1e40af'  // Change to your brand color

// Secondary color (purple)
color: '#7c3aed'        // Change to your accent color
```

### Changing Signatures

Update the signature section in the template:

```javascript
<p className="font-bold">Your Name</p>
<p>Your Title</p>
<p>Your Organization</p>
```

### Adding Custom Fields

Add new props to the CertificateTemplate component and display them:

```javascript
export default function CertificateTemplate({ 
  userName,
  courseName,
  // ... existing props
  instructorName,  // New field
}) {
  // Display in template
  <p>Instructor: {instructorName}</p>
}
```

## Dependencies

```json
{
  "jspdf": "^2.x.x",
  "html2canvas": "^1.x.x",
  "qrcode": "^1.x.x"
}
```

## Future Enhancements

### Phase 1 (Current)
- ✅ Certificate template design
- ✅ PDF generation (client-side)
- ✅ Download functionality
- ✅ Verification page with QR code

### Phase 2 (Recommended)
- [ ] Database integration for certificate storage
- [ ] Server-side PDF generation with Puppeteer
- [ ] Cloud storage for generated PDFs (AWS S3, Cloudinary, etc.)
- [ ] Email delivery system
- [ ] Admin dashboard for certificate management

### Phase 3 (Advanced)
- [ ] Batch certificate generation
- [ ] Certificate templates (multiple designs)
- [ ] Digital signatures
- [ ] Blockchain verification
- [ ] Certificate revocation system

## Testing

### Test Certificate Generation

1. Navigate to `/my-certificates`
2. Select a sample certificate
3. Click "Download PDF"
4. Verify PDF quality and content
5. Test QR code with a smartphone

### Test Verification

1. Scan QR code from generated certificate
2. Should redirect to `/verify/[certificate-number]`
3. Verify certificate details are displayed correctly

## Troubleshooting

### PDF Generation Issues

**Problem**: PDF is blank or incomplete
- **Solution**: Ensure images are loaded before generating PDF
- Check that the certificate template has proper dimensions
- Verify html2canvas options (scale, useCORS)

**Problem**: Poor PDF quality
- **Solution**: Increase the `scale` option in `html2canvas`
- Use higher resolution images for logo

**Problem**: QR code not displaying
- **Solution**: Check that qrcode package is installed
- Verify QR code data is valid URL
- Check browser console for errors

### Verification Issues

**Problem**: Verification page shows "Not Found"
- **Solution**: Check certificate number format
- Verify dynamic routing is working (`[certificateNo].js`)
- In production, ensure database query is correct

## Security Considerations

1. **Certificate Numbers**: Use cryptographically secure random components for production
2. **Verification**: Implement database lookup for real verification
3. **Access Control**: Ensure users can only access their own certificates
4. **Rate Limiting**: Add rate limiting to API endpoints
5. **Data Validation**: Validate all inputs before generating certificates

## Support

For questions or issues:
- Email: info@iiskills.cloud
- Documentation: This file
- Repository: Check for updates and bug fixes

## License

This certificate system is part of the iiskills-cloud project.
