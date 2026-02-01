import { generateAccessCode, validateAccessCodeFormat } from '../../../lib/accessCode';
import { insertData, queryData } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create new access code
    try {
      const { email, learningPath, goals } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const accessCode = generateAccessCode();

      await insertData('user_profiles', {
        email,
        access_code: accessCode,
        learning_path: learningPath,
        goals,
        onboarding_completed: true
      });

      return res.status(200).json({
        success: true,
        access_code: accessCode
      });
    } catch (error) {
      console.error('Create access code error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // Redeem access code
    try {
      const { code } = req.query;

      if (!code || !validateAccessCodeFormat(code)) {
        return res.status(400).json({ error: 'Invalid access code format' });
      }

      const { data, error } = await queryData('registrations', { access_code: code });

      if (error || !data || data.length === 0) {
        return res.status(404).json({ error: 'Access code not found' });
      }

      const registration = data[0];

      if (registration.status !== 'active') {
        return res.status(403).json({ error: 'Access code is not active' });
      }

      return res.status(200).json({
        success: true,
        email: registration.email,
        valid: true
      });
    } catch (error) {
      console.error('Redeem access code error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
