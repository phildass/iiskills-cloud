export default async function handler(req, res) {
  // Disabled: OTP verification not available in this branch
  res.status(200).json({ message: "OTP verification API is disabled in open-access-refactor branch." });
}