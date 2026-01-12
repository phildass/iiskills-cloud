import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generate a PDF certificate from an HTML element
 * @param {HTMLElement} element - The certificate template element to convert to PDF
 * @param {Object} options - Certificate options
 * @param {string} options.fileName - Name of the PDF file (without extension)
 * @param {string} options.userName - User's name for the filename
 * @param {string} options.courseName - Course name for the filename
 * @returns {Promise<jsPDF>} - Promise that resolves to the jsPDF document
 */
export async function generateCertificatePDF(element, options = {}) {
  const { fileName = "certificate", userName = "certificate", courseName = "course" } = options;

  try {
    // Ensure the element is visible and properly rendered
    const originalDisplay = element.style.display;
    element.style.display = "block";

    // Wait for images to load
    const images = element.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails to load
          // Timeout after 3 seconds
          setTimeout(resolve, 3000);
        });
      })
    );

    // Generate canvas from HTML element with high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 1056,
      height: 816,
    });

    // Restore original display
    element.style.display = originalDisplay;

    // Create PDF in landscape mode (A4 landscape is close to our certificate dimensions)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1056, 816],
      compress: true,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Add the image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, 1056, 816, undefined, "FAST");

    // Add metadata
    pdf.setProperties({
      title: `Certificate - ${userName}`,
      subject: `Certificate of Achievement for ${courseName}`,
      author: "Indian Institute of Professional Skills Development",
      creator: "iiskills.cloud",
    });

    return pdf;
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    throw new Error("Failed to generate certificate PDF: " + error.message);
  }
}

/**
 * Download the generated PDF
 * @param {jsPDF} pdf - The PDF document
 * @param {string} fileName - Name of the file
 */
export function downloadPDF(pdf, fileName = "certificate") {
  const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  pdf.save(`${sanitizedFileName}.pdf`);
}

/**
 * Get PDF as blob for uploading or further processing
 * @param {jsPDF} pdf - The PDF document
 * @returns {Blob} - PDF as blob
 */
export function getPDFBlob(pdf) {
  return pdf.output("blob");
}

/**
 * Get PDF as base64 string
 * @param {jsPDF} pdf - The PDF document
 * @returns {string} - PDF as base64 string
 */
export function getPDFBase64(pdf) {
  return pdf.output("dataurlstring");
}

/**
 * Generate certificate data for a passing user
 * @param {Object} userData - User data
 * @param {Object} courseData - Course data
 * @returns {Object} - Certificate data
 */
export function generateCertificateData(userData, courseData) {
  const now = new Date();
  const certificateNo = generateCertificateNumber(userData.id, courseData.id, now);

  return {
    userName: userData.name,
    courseName: courseData.name,
    certificateNo: certificateNo,
    completionDate: now.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    issueDate: now.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    score: userData.score || null,
    qrCodeData: `https://iiskills.cloud/verify/${certificateNo}`,
  };
}

/**
 * Generate a unique certificate number
 * @param {string|number} userId - User ID
 * @param {string|number} courseId - Course ID
 * @param {Date} date - Issue date
 * @returns {string} - Certificate number
 */
export function generateCertificateNumber(userId, courseId, date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const userPart = String(userId).padStart(4, "0");
  const coursePart = String(courseId).padStart(3, "0");

  return `IIPS-${year}${month}-${coursePart}${userPart}`;
}
