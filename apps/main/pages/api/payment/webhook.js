export default async function handler(req, res) {
  // Disabled: Payment webhook functionality not available in this branch
  res.status(200).json({ message: "Payment webhook is disabled in open-access-refactor branch." });
}