# Certificate System - Testing Guide

## Quick Test

This guide helps you test the certificate generation system.

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 2. Test Certificate Dashboard

Navigate to: `http://localhost:3000/my-certificates`

**Expected Result:**
- You should see a list of sample certificates
- Certificate preview is displayed
- "Download PDF" button is available

**Test the Download:**
1. Click the "Download PDF" button
2. A PDF file should download to your downloads folder
3. Open the PDF and verify:
   - Professional appearance with double border
   - Decorative corners in purple
   - Organization logo at top
   - Recipient name is prominent
   - Course name is displayed
   - Certificate number is shown
   - Two signatures at bottom
   - QR code in bottom right
   - Date information is correct

### 3. Test Certificate Verification

Navigate to: `http://localhost:3000/verify/IIPS-202412-0011001`

**Expected Result:**
- Green verification checkmark appears
- "Certificate Verified ✓" message is displayed
- Certificate details are shown:
  - Certificate Number
  - Recipient Name
  - Course Name
  - Score
  - Completion Date
  - Issue Date

**Test Invalid Certificate:**
Navigate to: `http://localhost:3000/verify/INVALID-CERT-NUMBER`

**Expected Result:**
- Shows form to enter certificate number
- Can enter a certificate number and press Enter to verify

### 4. Test API Endpoint

You can test the API endpoint using curl or Postman:

```bash
curl -X POST http://localhost:3000/api/generate-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1001,
    "courseId": 5,
    "userName": "Test User",
    "courseName": "Test Course",
    "score": 85
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Certificate generated successfully",
  "data": {
    "certificateNo": "IIPS-202412-0051001",
    "userName": "Test User",
    "courseName": "Test Course",
    "score": 85,
    "completionDate": "22 December, 2024",
    "issueDate": "22 December, 2024",
    "qrCodeData": "https://iiskills.cloud/verify/IIPS-202412-0051001",
    "timestamp": "2024-12-22T..."
  }
}
```

### 5. Test Different Certificates

On the my-certificates page, you can:
1. Click on different certificates in the list
2. Preview each certificate
3. Download each one separately

**Sample Certificates Available:**
- Professional Communication Skills (Score: 85%)
- Project Management Basics (Score: 92%)

### 6. Visual Inspection Checklist

When viewing the certificate, verify:

- [ ] Double border is visible and properly styled
- [ ] Decorative corners are present in all four corners
- [ ] Organization logo is centered and clear
- [ ] "Certificate of Achievement" heading is prominent
- [ ] Organization name is displayed under heading
- [ ] Horizontal divider line is under organization name
- [ ] "This certificate is proudly presented to" text is visible
- [ ] Recipient name is large, bold, and has underline
- [ ] "For having successfully completed the" text is visible
- [ ] Course name is displayed in purple color
- [ ] Score percentage is shown (if applicable)
- [ ] Motivational text about skills is displayed
- [ ] Certificate number is in bottom left
- [ ] Completion date is in bottom center
- [ ] QR code is in bottom right (if enabled)
- [ ] Two signatures are displayed at bottom
- [ ] Signature names and titles are visible
- [ ] Issue date is at very bottom
- [ ] Verification seal/badge watermark is visible (faint)

### 7. QR Code Testing

To test the QR code:
1. Download a certificate as PDF
2. Open the PDF on your computer
3. Use your smartphone to scan the QR code
4. You should be redirected to the verification page
5. Certificate details should be displayed

### 8. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 9. Responsive Design Test

Test the certificate preview on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Note: The certificate itself maintains its fixed dimensions for PDF generation, but the page layout should be responsive.

### 10. PDF Quality Check

After downloading a PDF:
- [ ] Open in Adobe Acrobat Reader
- [ ] Zoom to 200% - text should remain sharp
- [ ] Check that all elements are visible
- [ ] Print preview should look professional
- [ ] File size should be reasonable (< 500KB)

## Common Issues and Solutions

### Issue: PDF is blank
**Solution:** Wait a moment before clicking download again. Images need time to load.

### Issue: QR code not showing
**Solution:** Check browser console for errors. Ensure `qrcode` package is installed.

### Issue: Low quality PDF
**Solution:** The `scale` parameter in html2canvas is set to 2. Increase it for higher quality.

### Issue: Certificate not centered in preview
**Solution:** The preview uses transform scale. Adjust the wrapper div width.

## Integration Testing

For production integration:

1. **User Authentication**: Replace sample data with real user data from your auth system
2. **Course Completion**: Trigger certificate generation when user passes (score >= 50%)
3. **Database Storage**: Save certificate records to your database
4. **Email Delivery**: Send certificate download link via email
5. **Verification**: Query database for certificate verification

## Performance Testing

Test with:
- Multiple certificate downloads in succession
- Large number of certificates in the list
- Slow network conditions
- Different image formats for the logo

## Security Testing

Verify:
- API endpoint validates all inputs
- Certificate numbers are unique
- Cannot generate certificate with score < 50%
- Verification page handles invalid inputs gracefully

## Success Criteria

The system is working correctly if:
✅ Certificates can be downloaded as high-quality PDFs
✅ Certificate design matches the professional sample
✅ Verification page works for valid certificate numbers
✅ QR codes can be scanned and redirect correctly
✅ API endpoint generates certificate data correctly
✅ Build succeeds without errors
✅ All pages are responsive and accessible

## Next Steps

After successful testing:
1. Review the CERTIFICATE_SYSTEM.md documentation
2. Plan database integration
3. Connect to user authentication system
4. Set up email delivery
5. Configure cloud storage for PDFs
6. Add admin management features
