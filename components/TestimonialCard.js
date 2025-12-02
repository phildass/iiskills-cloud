export default function TestimonialCard({ name, text, org }) {
  return (
    <div className="bg-neutral p-5 rounded shadow-md mb-4">
      <p className="italic mb-2">"{text}"</p>
      <div className="text-sm font-bold text-primary">{name}</div>
      {org && <span className="text-xs text-charcoal">{org}</span>}
    </div>
  )
}