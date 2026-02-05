import { insertData } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, user_email, user_name } = req.body;

    if (!user_id || !user_email || !user_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate certificate metadata
    const certificate = {
      user_id,
      user_email,
      user_name,
      course_name: 'Complete AI Mastery Course',
      issued_date: new Date().toISOString(),
      certificate_id: `LEARNAI-${Date.now()}-${user_id}`,
      status: 'issued'
    };

    // Save certificate to database
    await insertData('certificates', certificate);

    // Send certificate via email (in production, use Resend)
    if (process.env.RESEND_API_KEY) {
      // TODO: Implement Resend email with certificate PDF
      console.log(`Sending certificate ${certificate.certificate_id} to ${user_email}`);
    }

    return res.status(200).json({
      success: true,
      certificate_id: certificate.certificate_id,
      message: 'Certificate generated successfully! Check your email.'
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
