export default async function handler(req, res) {
  // Disabled: Payment functionality not available in this branch
  res.status(200).json({ message: "Payment API is disabled in open-access-refactor branch." });
}