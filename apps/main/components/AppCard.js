export default function AppCard({ title, description, link }) {
  return (
    <div className="rounded-xl shadow-lg p-6 bg-white hover:border-primary border transition">
      <h3 className="font-semibold text-lg text-primary mb-2">{title}</h3>
      <p className="mb-4">{description}</p>
      <a href={link} target="_blank" className="text-accent underline">Open App</a>
    </div>
  )
}