import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Same-day acute care',
    desc: 'Structured slots for fever, respiratory symptoms, and minor injuries so families are seen without long waits.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Specialty coordination',
    desc: 'Cardiology, neurology, pulmonology, and other subspecialty referrals with shared records and clear handoffs.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Digital scheduling',
    desc: 'Book, reschedule, and receive updates through a single portal aligned with your care team\'s calendar.',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=530&fit=crop',
  },
  {
    name: 'Dr. James Okonkwo',
    role: 'Chief of Pediatric Cardiology',
    bio: 'Non-invasive imaging and congenital heart follow-up; joint programs with regional children\'s hospitals.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=530&fit=crop',
  },
  {
    name: 'Dr. Sarah Lindholm',
    role: 'Lead, Developmental Pediatrics',
    bio: 'Early autism and learning assessments with coordinated therapy pathways and school liaison support.',
    image: 'https://images.unsplash.com/photo-1594824476966-48c8b964273f?w=400&h=530&fit=crop',
  },
  {
    name: 'Maria Santos, RN, MSN',
    role: 'Director of Nursing & Triage',
    bio: 'Oversees nurse triage protocols, vaccine programs, and parent education across all sites.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=530&fit=crop',
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
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #020917 0%, #061430 40%, #0a1f4e 100%)' }}
      >
        {/* background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }} />
          <div className="absolute -bottom-60 -right-40 w-[700px] h-[700px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        </div>

        <Navbar
          variant="home"
          links={[
            { label: 'Sign In', to: '/login' },
            {
              label: 'Get Started',
              to: '/register',
              className: 'bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition shadow-lg shadow-blue-900/40',
            },
          ]}
        />

        <section className="relative max-w-6xl mx-auto px-6 pt-12 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT */}
            <div style={{ animation: 'fadeUp 0.7s 0.1s both' }}>
              <div className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(147,197,253,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
                <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">PediCare Pediatric Clinic</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.07] tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}>
                A pediatric clinic built for{' '}
                <span className="text-blue-300 italic">continuity, clarity, and safety</span>
              </h1>

              <p className="mt-6 text-lg text-slate-300 max-w-xl leading-relaxed font-light">
                We combine experienced subspecialists, structured same-day access, and modern digital tools so
                children receive consistent, evidence-based care — and families always know what comes next.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/50 hover:shadow-blue-700/50 hover:-translate-y-0.5">
                  Create an account
                </Link>
                <Link to="/login"
                  className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/8"
                  style={{ border: '1px solid rgba(255,255,255,0.18)' }}>
                  Sign in
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* RIGHT — image */}
            <div className="relative" style={{ animation: 'fadeIn 0.9s 0.3s both' }}>
              <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-25 lg:block hidden"
                style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)' }} />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=960&h=720&fit=crop"
                  alt="Pediatric care team consulting with a family in a bright clinic setting"
                  className="w-full h-[320px] sm:h-[380px] lg:h-[460px] object-cover block"
                  width={960} height={720}
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(2,9,23,0.88) 0%, transparent 55%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm text-slate-200 font-medium">On-site imaging, labs, and vaccination suites</p>
                  <p className="text-xs text-slate-400 mt-1">Designed to reduce same-day stress for children and caregivers.</p>
                </div>
              </div>

              {/* floating badge */}
              <div className="absolute -top-3 -right-3 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
                style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', animation: 'float 3.5s ease-in-out infinite' }}>
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white font-semibold whitespace-nowrap">Dosage verified</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Pediatric mg/kg calculator active</span>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 pb-0">
            {stats.map((s, i) => (
              <div key={s.label}
                className="rounded-2xl px-5 py-4 text-center lg:text-left"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', animation: `fadeUp 0.5s ${0.5 + i * 0.1}s both` }}>
                <p className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* wave divider */}
        <div className="relative h-16 mt-8">
          <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ fill: '#f8fafc' }}>
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </div>

      {/* ── WHO WE ARE ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center" ref={reveal}>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Who we are</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              A pediatric network built around{' '}
              <em className="not-italic text-blue-600">your child's story</em>
            </h2>
            <p className="mt-5 text-slate-500 leading-relaxed">
              PediCare is a multi-site pediatric network focused on preventive care, early detection, and coordinated
              treatment when children need more than routine visits. Our facilities are designed for sensory comfort,
              clear wayfinding, and short distances between registration, vitals, and exam rooms.
            </p>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Behind the scenes, physicians, nurses, and care navigators share a single clinical record and messaging
              layer — so whether you book online or call triage, your child's history and preferences travel with them.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=560&fit=crop"
                alt="Modern hospital corridor with natural light"
                className="w-full h-56 object-cover block"
                width={800} height={560}
              />
              <div className="p-6">
                <h3 className="font-semibold text-slate-900">Accredited, audited, and parent-informed</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  We participate in regional quality registries and publish annual outcome summaries — including vaccination
                  rates, asthma control metrics, and time-to-specialty appointment — for enrolled families.
                </p>
              </div>
            </div>
            {/* accent card */}
            {/* <div className="absolute -bottom-5 -left-5 bg-blue-600 text-white rounded-2xl px-5 py-4 shadow-xl hidden lg:block">
              <p className="text-2xl font-bold" style={{ fontFamily: "'Georgia', serif" }}>98%</p>
              <p className="text-xs text-blue-200 mt-0.5 font-medium">Parent satisfaction</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="border-y border-slate-200" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="max-w-2xl mb-12" ref={reveal}>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">What we offer</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              Services families <em className="not-italic text-blue-400">use most</em>
            </h2>
            <p className="mt-3 text-slate-400 leading-relaxed">
              From first newborn visits through adolescence, we align services with how real families schedule and move through care.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden" ref={reveal}
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {services.map((item) => (
              <div key={item.title} className="p-8 group cursor-default transition-all duration-300"
                style={{ background: '#0f172a' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(37,99,235,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-blue-400 transition-colors"
                  style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10" ref={reveal}>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Clinical departments</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              One medical home, <em className="not-italic text-blue-600">direct subspecialty access</em>
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl">
              One medical home with direct access to subspecialists when indicated — without losing your primary pediatrician as quarterback.
            </p>
          </div>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3" ref={reveal}>
          {departments.map((d) => (
            <li key={d}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm hover:border-blue-300 hover:shadow-md transition-all font-medium">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {d}
            </li>
          ))}
        </ul>
      </section>

      {/* ── STAFF ── */}
      <section style={{ background: '#020917' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="mb-12" ref={reveal}>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400 mb-4">Our team</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Georgia', serif" }}>
              Leadership &amp; <em className="not-italic text-blue-300">clinical staff</em>
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl">
              A sample of our leadership team. Full directories are available to registered patients in the portal.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" ref={reveal}>
            {staff.map((person) => (
              <article key={person.name} className="group">
                <div className="rounded-2xl overflow-hidden shadow-lg aspect-[3/4]"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
                    width={400} height={530}
                  />
                </div>
                <h3 className="mt-4 font-semibold text-white">{person.name}</h3>
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-widest mt-1">{person.role}</p>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{person.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE PRACTICE ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
        <div ref={reveal}>
          <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Our approach</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}>
            How we practice medicine
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl leading-relaxed">
            Advanced methodology does not mean experimental — it means repeatable processes, measurable outcomes, and room for human judgment when guidelines meet individual children.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6" ref={reveal}>
          {methodology.map((m) => (
            <div key={m.title}
              className="rounded-2xl border border-slate-200 p-7 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              style={{ background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
              <div className="w-2 h-8 rounded-full bg-blue-600 mb-5" />
              <h3 className="font-semibold text-slate-900">{m.title}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section style={{ background: '#1d4ed8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div ref={reveal}>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-200 mb-4">Why families choose us</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}>
                Why families choose PediCare
              </h2>
              <p className="mt-4 text-blue-100 leading-relaxed">
                Parents tell us they value fewer handoffs, clearer next steps, and a team that remembers their child's story.
                Our model is built around those expectations — not around filling schedules at any cost.
              </p>
            </div>
            <ul className="space-y-4" ref={reveal}>
              {whyUs.map((w) => (
                <li key={w.title}
                  className="rounded-2xl px-6 py-5 transition-all hover:bg-white/15"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <h3 className="font-semibold text-white">{w.title}</h3>
                  <p className="mt-1 text-sm text-blue-100 leading-relaxed">{w.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SAFETY + CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-24">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden" ref={reveal}>
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-widest uppercase text-blue-600 mb-4">Safety</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight"
                style={{ fontFamily: "'Georgia', serif" }}>
                Safety you can verify
              </h2>
              <ul className="mt-6 space-y-4 text-slate-500 text-sm leading-relaxed">
                {[
                  'Infection prevention bundles aligned with national pediatric recommendations for outpatient settings.',
                  'Structured antibiotic stewardship and weight-based dosing review for high-alert medications.',
                  'Parent-accessible visit notes and after-visit instructions in plain language, with escalation paths for red-flag symptoms.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-200 hover:-translate-y-0.5">
                  Join as a patient
                </Link>
                <Link to="/login"
                  className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                  Staff sign in
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-full">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=900&fit=crop"
                alt="Child-friendly examination room with soft lighting"
                className="absolute inset-0 w-full h-full object-cover block"
                width={800} height={900}
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(2,9,23,0.6) 0%, transparent 60%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 text-sm text-slate-500">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-900">PediCare Pediatric Clinic</p>
            </div>
            <p className="ml-9">Outpatient care, specialty access, and secure digital coordination.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link>
          </div>
        </div>
        <div className="text-center pb-8 text-xs text-slate-400">© 2026 PediCare. All rights reserved.</div>
      </footer>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
