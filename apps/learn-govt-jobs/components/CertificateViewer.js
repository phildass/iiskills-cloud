export default function CertificateViewer({ certificate }) {
  if (!certificate) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">No certificate available yet. Complete the course and pass the final exam to earn your certificate.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="border-4 border-blue-600 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">Certificate of Completion</h2>
        
        <div className="mb-6">
          <p className="text-lg mb-2">This certifies that</p>
          <p className="text-2xl font-bold mb-4">{certificate.user_name}</p>
          <p className="text-lg">has successfully completed</p>
          <p className="text-xl font-semibold text-primary mb-4">{certificate.course_name}</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Certificate ID: {certificate.certificate_id}</p>
          <p className="text-gray-600">
            Issued on: {new Date(certificate.issued_date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="btn-primary">
            Download PDF
          </button>
          <button className="btn-secondary">
            Share Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
