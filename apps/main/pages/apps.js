import AppCard from '../components/AppCard'

export default function Apps() {
  const apps = [
    {
      title: "SkillTracker",
      description: "Track, assess, and certify professional skills for individuals and teams.",
      link: "#"
    },
    {
      title: "Learning Hub",
      description: "Courses, webinars, and resources for career advancement.",
      link: "#"
    },
    {
      title: "JobConnect",
      description: "Bridge the gap between skill development and job opportunities.",
      link: "#"
    }
  ]
  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-8">Our Apps</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {apps.map((app, i) => (
            <AppCard key={i} {...app} />
          ))}
        </div>
      </main>
    </>
  )
}