"use client";

import { useEffect, useState } from "react";

export default function CertificateTemplate({
  userName = "John Doe",
  courseName = "Professional Skills Development",
  certificateNo = "IIPS-2024-0001",
  completionDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  score = null,
  issueDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  qrCodeData = null,
  logoPath = "/images/iiskills-logo.png",
}) {
  const [qrCodeSrc, setQrCodeSrc] = useState(null);

  useEffect(() => {
    if (qrCodeData && typeof window !== "undefined") {
      import("qrcode").then((QRCode) => {
        QRCode.default
          .toDataURL(qrCodeData, { width: 120, margin: 1 })
          .then((url) => setQrCodeSrc(url))
          .catch((err) => console.error("QR Code generation error:", err));
      });
    }
  }, [qrCodeData]);

  return (
    <div
      id="certificate-template"
      className="certificate-container bg-white mx-auto"
      style={{
        width: "1056px",
        height: "816px",
        padding: "48px",
        position: "relative",
        fontFamily: "Georgia, serif",
      }}
    >
      {/* Outer Border */}
      <div
        className="border-8 border-double h-full flex flex-col"
        style={{
          borderColor: "#1e40af",
          borderStyle: "double",
          borderWidth: "8px",
          padding: "32px",
          position: "relative",
        }}
      >
        {/* Decorative Corners */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            width: "60px",
            height: "60px",
            borderTop: "4px solid #7c3aed",
            borderLeft: "4px solid #7c3aed",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "60px",
            height: "60px",
            borderTop: "4px solid #7c3aed",
            borderRight: "4px solid #7c3aed",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            width: "60px",
            height: "60px",
            borderBottom: "4px solid #7c3aed",
            borderLeft: "4px solid #7c3aed",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "60px",
            height: "60px",
            borderBottom: "4px solid #7c3aed",
            borderRight: "4px solid #7c3aed",
          }}
        ></div>

        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src={logoPath}
              alt="iiskills Logo"
              style={{ height: "80px", width: "80px", objectFit: "contain" }}
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = "none";
              }}
            />
          </div>
          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "42px",
              color: "#1e40af",
              letterSpacing: "1px",
              fontFamily: "Georgia, serif",
            }}
          >
            Certificate of Achievement
          </h1>
          <p
            className="font-semibold"
            style={{
              fontSize: "18px",
              color: "#7c3aed",
              letterSpacing: "0.5px",
            }}
          >
            Indian Institute of Professional Skills Development
          </p>
          <div
            className="mx-auto mt-2"
            style={{
              height: "3px",
              width: "140px",
              background: "linear-gradient(to right, #1e40af, #7c3aed)",
            }}
          ></div>
        </div>

        {/* Certificate Body */}
        <div
          className="text-center flex-1 flex flex-col justify-center"
          style={{ marginTop: "-20px", marginBottom: "-20px" }}
        >
          <p style={{ fontSize: "20px", color: "#374151", marginBottom: "24px" }}>
            This certificate is proudly presented to
          </p>

          <div className="my-4">
            <p
              className="font-bold inline-block px-12 pb-2"
              style={{
                fontSize: "40px",
                color: "#1e40af",
                borderBottom: "3px solid #d1d5db",
                fontFamily: "Georgia, serif",
                minWidth: "400px",
              }}
            >
              {userName}
            </p>
          </div>

          <p style={{ fontSize: "18px", color: "#374151", margin: "24px 0 20px 0" }}>
            For having successfully completed the
          </p>

          <div className="my-3">
            <p
              className="font-bold"
              style={{
                fontSize: "32px",
                color: "#7c3aed",
                fontFamily: "Georgia, serif",
              }}
            >
              {courseName}
            </p>
          </div>

          {score !== null && (
            <p style={{ fontSize: "16px", color: "#374151", marginTop: "20px" }}>
              with a score of <span className="font-bold text-green-600">{score}%</span>
            </p>
          )}

          <p
            className="italic mt-5"
            style={{
              fontSize: "15px",
              color: "#6b7280",
              maxWidth: "700px",
              margin: "24px auto 0",
            }}
          >
            Demonstrating dedication to professional development and mastery of essential skills
          </p>
        </div>

        {/* Footer Section */}
        <div style={{ marginTop: "auto" }}>
          {/* Certificate Info and QR Code */}
          <div
            className="flex justify-between items-end mb-6 pb-4"
            style={{ borderTop: "2px solid #e5e7eb", paddingTop: "20px" }}
          >
            <div className="text-left" style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                Certificate No.
              </p>
              <p className="font-bold" style={{ fontSize: "15px", color: "#1e40af" }}>
                {certificateNo}
              </p>
            </div>

            <div className="text-center" style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>
                Date of Completion
              </p>
              <p className="font-bold" style={{ fontSize: "15px", color: "#1e40af" }}>
                {completionDate}
              </p>
            </div>

            {qrCodeSrc && (
              <div className="text-right" style={{ flex: 1 }}>
                <img
                  src={qrCodeSrc}
                  alt="Verification QR Code"
                  style={{
                    width: "80px",
                    height: "80px",
                    marginLeft: "auto",
                    border: "2px solid #e5e7eb",
                    padding: "4px",
                    background: "white",
                  }}
                />
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  Verify Certificate
                </p>
              </div>
            )}
          </div>

          {/* Signatures */}
          <div className="flex justify-around items-end">
            <div className="text-center">
              <div
                className="mb-2"
                style={{
                  borderTop: "2px solid #374151",
                  width: "200px",
                  paddingTop: "8px",
                }}
              >
                <p
                  className="font-bold"
                  style={{ fontSize: "16px", color: "#111827", fontFamily: "Georgia, serif" }}
                >
                  Pradhyot Kumar
                </p>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>Director</p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>IIPSD</p>
              </div>
            </div>

            <div className="text-center">
              <div
                className="mb-2"
                style={{
                  borderTop: "2px solid #374151",
                  width: "200px",
                  paddingTop: "8px",
                }}
              >
                <p
                  className="font-bold"
                  style={{ fontSize: "16px", color: "#111827", fontFamily: "Georgia, serif" }}
                >
                  Academic Head
                </p>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>Program Director</p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>IIPSD</p>
              </div>
            </div>
          </div>

          {/* Issue Date */}
          <div className="text-center mt-4">
            <p style={{ fontSize: "11px", color: "#9ca3af" }}>Issued on {issueDate}</p>
          </div>
        </div>
      </div>

      {/* Seal/Badge (Optional - positioned absolutely) */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          left: "100px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          border: "3px solid #7c3aed",
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          opacity: 0.15,
        }}
      >
        <div style={{ fontSize: "28px", fontWeight: "bold" }}>✓</div>
        <div style={{ fontSize: "10px", marginTop: "4px" }}>VERIFIED</div>
      </div>
    </div>
  );
}
