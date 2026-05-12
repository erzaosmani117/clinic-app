import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const stats = [
  { value: '15+', label: 'Years of pediatric care' },
  { value: '12', label: 'Clinical departments' },
  { value: '40+', label: 'Board-certified physicians' },
  { value: '24/7', label: 'On-call triage line' },
];

const services = [
  {
    title: 'Outpatient pediatrics',
    desc: 'Well-child visits, growth monitoring, vaccinations, and chronic condition follow-up in a child-friendly environment.',
  },
  {
    title: 'Same-day acute care',
    desc: 'Structured slots for fever, respiratory symptoms, and minor injuries so families are seen without long waits.',
  },
  {
    title: 'Specialty coordination',
    desc: 'Cardiology, neurology, pulmonology, and other subspecialty referrals with shared records and clear handoffs.',
  },
  {
    title: 'Digital scheduling',
    desc: 'Book, reschedule, and receive updates through a single portal aligned with your care team’s calendar.',
  },
];

const departments = [
  'General pediatrics',
  'Neonatal follow-up',
  'Pediatric cardiology',
  'Developmental & behavioral health',
  'Allergy & immunology',
  'Gastroenterology',
  'Pulmonology & asthma',
  'Infectious disease',
  'Endocrinology',
  'Nutrition & growth',
  'Adolescent medicine',
  'Urgent assessment clinic',
];

const staff = [
  {
    name: 'Dr. Elena Marquez',
    role: 'Medical Director, General Pediatrics',
    bio: 'Fellowship-trained in ambulatory pediatrics; leads clinical quality and family communication standards.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  },
  {
    name: 'Dr. James Okonkwo',
    role: 'Chief of Pediatric Cardiology',
    bio: 'Non-invasive imaging and congenital heart follow-up; joint programs with regional children’s hospitals.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  },
  {
    name: 'Dr. Sarah Lindholm',
    role: 'Lead, Developmental Pediatrics',
    bio: 'Early autism and learning assessments with coordinated therapy pathways and school liaison support.',
    image: 'https://images.unsplash.com/photo-1594824476966-48c8b964273f?w=400&h=400&fit=crop',
  },
  {
    name: 'Maria Santos, RN, MSN',
    role: 'Director of Nursing & Triage',
    bio: 'Oversees nurse triage protocols, vaccine programs, and parent education across all sites.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop',
  },
];

const methodology = [
  {
    title: 'Evidence-based pathways',
    desc: 'Clinical decisions follow published pediatric guidelines, with regular audits and peer review of high-volume conditions.',
  },
  {
    title: 'Medication safety layer',
    desc: 'Weight- and age-aware dosing checks for in-clinic prescribing, aligned with our digital dosage tools for physicians.',
  },
  {
    title: 'Family-centered rounds',
    desc: 'Care plans are explained in plain language; interpreters and written summaries are standard for every visit type.',
  },
];

const whyUs = [
  {
    title: 'Continuity of care',
    desc: 'Families see a consistent team when possible, so growth, behavior, and chronic issues are tracked over years—not single visits.',
  },
  {
    title: 'Transparent communication',
    desc: 'After-visit summaries, lab timelines, and portal messages reduce uncertainty between appointments.',
  },
  {
    title: 'Safety culture',
    desc: 'Time-outs for procedures, double-checks on high-risk medications, and a no-blame reporting system for near misses.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
        <Navbar
          variant="home"
          links={[
            { label: 'Sign In', to: '/login' },
            {
              label: 'Get Started',
              to: '/register',
              className: 'bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition',
            },
          ]}
        />

        <section className="max-w-6xl mx-auto px-6 pt-10 pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wide border border-blue-400/30 rounded-full px-4 py-2 bg-blue-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                PediCare Pediatric Clinic
              </p>
              <h1 className="font-display mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                A pediatric clinic built for{' '}
                <span className="text-blue-300">continuity, clarity, and safety</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed">
                We combine experienced subspecialists, structured same-day access, and modern digital tools so
                children receive consistent, evidence-based care—and families always know what comes next.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-900/40"
                >
                  Create an account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center border border-white/25 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-xl transition"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl lg:block hidden" aria-hidden />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=960&h=720&fit=crop"
                  alt="Pediatric care team consulting with a family in a bright clinic setting"
                  className="w-full h-[320px] sm:h-[380px] lg:h-[440px] object-cover"
                  width={960}
                  height={720}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                  <p className="text-sm text-slate-200 font-medium">On-site imaging, labs, and vaccination suites</p>
                  <p className="text-xs text-slate-400 mt-1">Designed to reduce same-day stress for children and caregivers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4 text-center lg:text-left"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Who we are</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              PediCare is a multi-site pediatric network focused on preventive care, early detection, and coordinated
              treatment when children need more than routine visits. Our facilities are designed for sensory comfort,
              clear wayfinding, and short distances between registration, vitals, and exam rooms.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Behind the scenes, physicians, nurses, and care navigators share a single clinical record and messaging
              layer—so whether you book online or call triage, your child’s history and preferences travel with them.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=560&fit=crop"
              alt="Modern hospital corridor with natural light"
              className="w-full h-56 object-cover"
              width={800}
              height={560}
            />
            <div className="p-6">
              <h3 className="font-semibold text-slate-900">Accredited, audited, and parent-informed</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                We participate in regional quality registries and publish annual outcome summaries—including vaccination
                rates, asthma control metrics, and time-to-specialty appointment—for enrolled families.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Services families use most</h2>
            <p className="mt-3 text-slate-600">
              From first newborn visits through adolescence, we align services with how real families schedule and move through care.
            </p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            {services.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">Clinical departments</h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              One medical home with direct access to subspecialists when indicated—without losing your primary pediatrician as quarterback.
            </p>
          </div>
        </div>
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {departments.map((d) => (
            <li
              key={d}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight">Leadership & clinical staff</h2>
            <p className="mt-3 text-slate-400">
              A sample of our leadership team. Full directories are available to registered patients in the portal.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {staff.map((person) => (
              <article key={person.name} className="text-center sm:text-left">
                <div className="mx-auto sm:mx-0 w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
                <h3 className="mt-4 font-semibold text-white">{person.name}</h3>
                <p className="text-xs text-blue-300 font-medium uppercase tracking-wide mt-1">{person.role}</p>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{person.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">How we practice medicine</h2>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Advanced methodology does not mean experimental—it means repeatable processes, measurable outcomes, and room for human judgment when guidelines meet individual children.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {methodology.map((m) => (
            <div key={m.title} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">{m.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight">Why families choose PediCare</h2>
              <p className="mt-4 text-blue-100 leading-relaxed">
                Parents tell us they value fewer handoffs, clearer next steps, and a team that remembers their child’s story.
                Our model is built around those expectations—not around filling schedules at any cost.
              </p>
            </div>
            <ul className="space-y-4">
              {whyUs.map((w) => (
                <li key={w.title} className="rounded-xl bg-white/10 border border-white/15 px-5 py-4">
                  <h3 className="font-semibold">{w.title}</h3>
                  <p className="mt-1 text-sm text-blue-100 leading-relaxed">{w.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Safety you can verify</h2>
              <ul className="mt-6 space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold shrink-0">1.</span>
                  Infection prevention bundles aligned with national pediatric recommendations for outpatient settings.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold shrink-0">2.</span>
                  Structured antibiotic stewardship and weight-based dosing review for high-alert medications.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold shrink-0">3.</span>
                  Parent-accessible visit notes and after-visit instructions in plain language, with escalation paths for red-flag symptoms.
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary inline-flex px-6 py-3 rounded-xl text-sm">
                  Join as a patient
                </Link>
                <Link to="/login" className="btn-secondary inline-flex px-6 py-3 rounded-xl text-sm bg-slate-50">
                  Staff sign in
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=900&fit=crop"
                alt="Child-friendly examination room with soft lighting"
                className="absolute inset-0 w-full h-full object-cover"
                width={800}
                height={900}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm text-slate-600">
          <div>
            <p className="font-semibold text-slate-900">PediCare Pediatric Clinic</p>
            <p className="mt-1">Outpatient care, specialty access, and secure digital coordination.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/login" className="hover:text-blue-700 transition">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-blue-700 transition">
              Register
            </Link>
          </div>
        </div>
        <div className="text-center pb-8 text-xs text-slate-500">2026 PediCare. All rights reserved.</div>
      </footer>
    </div>
  );
}
