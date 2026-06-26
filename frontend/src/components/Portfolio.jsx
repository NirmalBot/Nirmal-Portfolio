import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Phone, MapPin, Send, ArrowUpRight, Download, Code2, GraduationCap, Briefcase, FolderGit2, Sparkles, FileText, Award, BookOpen } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" },
];

function Nav({ active }) {
  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-strong" data-testid="top-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2 mono font-bold text-lg" data-testid="brand-link">
            <span className="text-[#1a1a1a]">N</span>
            <span className="text-accent">N</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {SECTIONS.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active === s.id ? "text-accent" : "text-muted-fg hover:text-[#1a1a1a]"}`}
                data-testid={`nav-${s.id}`}
              >
                {s.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="btn-primary text-sm py-2.5 px-5" data-testid="nav-cta">
            Hire me <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Side dots */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3" data-testid={`dot-${s.id}`}>
            <span className={`nav-dot ${active === s.id ? "active" : ""}`} />
            <span className={`text-xs mono transition-opacity ${active === s.id ? "opacity-100 text-accent" : "opacity-0 group-hover:opacity-70 text-muted-fg"}`}>{s.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-24 overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.2fr_0.9fr] gap-12 items-center">
        <div className="fade-up">
          <span className="pill" data-testid="hero-availability">
            <span className="pill-dot" /> Available for Opportunities
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#1a1a1a]" data-testid="hero-title">
            Hi, I'm <br />
            <span className="title-gradient accent-underline">Nirmal Natarajan</span>
          </h1>
          <h2 className="mt-6 text-2xl md:text-3xl font-bold text-[#1a1a1a]">Aspiring Software Engineer & AI Enthusiast</h2>
          <p className="mt-3 text-lg text-muted-fg max-w-2xl" data-testid="hero-subtitle">
            Building intelligent solutions with AI, ML, and Full‑Stack Development.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary" data-testid="hero-view-projects">
              View Projects <ArrowUpRight size={18} />
            </a>
            <a href="#contact" className="btn-ghost" data-testid="hero-resume">
              <Send size={16} /> Get in touch
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-[#f3e8df] flex flex-wrap gap-6 text-sm">
            <a href="mailto:nirnat2002@gmail.com" className="flex items-center gap-2 text-muted-fg hover:text-accent transition-colors" data-testid="hero-email">
              <Mail size={16} /> Email
            </a>
            <a href="https://www.linkedin.com/in/nirmal-natarajan-0b5951384" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-fg hover:text-accent transition-colors" data-testid="hero-linkedin">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="tel:+447818462507" className="flex items-center gap-2 text-muted-fg hover:text-accent transition-colors" data-testid="hero-phone">
              <Phone size={16} /> Call
            </a>
          </div>
        </div>

        {/* Right card - light themed profile card */}
        <div className="relative">
          <div className="relative aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden bg-white border border-[#f3e8df] shadow-[0_30px_80px_rgba(248,180,150,0.18)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-orange-50" />
            <img
              src="https://customer-assets.emergentagent.com/job_smtp-portfolio-pro/artifacts/8yicxbif_ChatGPT%20Image%20Jun%202%2C%202026%2C%2011_20_39%20PM.png"
              alt="Nirmal Natarajan"
              className="relative w-full h-full object-cover object-top"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Top right CGPA badge */}
            <div className="absolute top-5 right-5 stat-float float" data-testid="hero-stat-cgpa">
              <div className="text-2xl font-extrabold text-accent leading-none">9.01</div>
              <div className="text-[10px] mono uppercase tracking-widest text-muted-2 mt-1">CGPA</div>
            </div>
            {/* Bottom left Projects badge */}
            <div className="absolute bottom-6 left-6 stat-float" data-testid="hero-stat-projects">
              <div className="text-2xl font-extrabold text-success leading-none">5+</div>
              <div className="text-[10px] mono uppercase tracking-widest text-muted-2 mt-1">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, kicker }) {
  return (
    <div className="mb-12 max-w-3xl">
      <div className="section-eyebrow mb-3">{eyebrow}</div>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a1a1a]">{title}</h2>
      {kicker && <p className="mt-4 text-muted-fg text-lg">{kicker}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-24 px-6 max-w-7xl mx-auto" data-testid="about-section">
      <SectionTitle eyebrow="// about" title="About Me" />
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div className="glass rounded-2xl p-8 leading-relaxed text-muted-fg text-[15px]">
          A highly driven computer science professional with practical knowledge in database administration,
          programming, and contemporary frameworks, as well as a solid background in software development,
          algorithms, and system architecture. Adept at deciphering intricate issues, creating effective solutions,
          and utilising cutting‑edge technologies to spur creativity and output.
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { v: "9.01", l: "CGPA / 10" },
              { v: "5+", l: "Projects" },
              { v: "7+", l: "Certifications" },
              { v: "2", l: "Publications" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-[#f3e8df] bg-white/70 p-4">
                <div className="text-3xl font-bold text-accent">{s.v}</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-fg mono mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xs mono uppercase tracking-widest text-muted-fg flex items-center gap-2"><GraduationCap size={14}/> Education</div>
          {[{
            deg: "MSc in Advanced Computer Science",
            place: "Newcastle University",
            range: "2025 – 2026",
            loc: "United Kingdom",
            note: "Currently Pursuing",
          },{
            deg: "B.E in Computer Science and Engineering",
            place: "SRM Valliammai Engineering College",
            range: "2020 – 2024",
            loc: "India",
            note: "CGPA 9.01 / 10.00",
          }].map((e) => (
            <div key={e.deg} className="glass rounded-2xl p-5 card-hover">
              <div className="font-semibold text-[#1a1a1a]">{e.deg}</div>
              <div className="text-muted-fg text-sm">{e.place}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-fg mono">
                <span>{e.range}</span><span>•</span><span>{e.loc}</span>
              </div>
              <div className="mt-3 chip-green">{e.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const EXPERIENCE = [
  {
    type: "Internship",
    role: "Virtual Software Engineer",
    company: "JP Morgan Chase & Co",
    range: "Sep 2023 – Oct 2023",
    bullets: [
      "Simulated software engineering roles, enhancing practical skills",
      "Achieved an average project score of 89.59%",
      "Worked on real‑world software development scenarios",
    ],
  },
  {
    type: "Full‑time",
    role: "Associate Customer Support",
    company: "Sutherland Global Services",
    range: "Jun 2024 – Sep 2024",
    bullets: [
      "Delivered professional support to international clients via phone and email",
      "Resolved inquiries, complaints, and technical issues efficiently",
      "Achieved 90%+ satisfaction rating over six months",
      "Communicated effectively across multiple departments",
    ],
  },
  {
    type: "Internship",
    role: "Full Stack Web Developer",
    company: "SwanInfosoft",
    range: "Jun 2022 – Aug 2022",
    bullets: [
      "Gained hands‑on experience in web development",
      "Collaborated with a cross‑functional team of 3",
      "Worked on both frontend and backend technologies",
      "Contributed to creation of fully functional web applications",
    ],
  },
];

function Experience() {
  return (
    <section id="experience" className="py-24 px-6 max-w-7xl mx-auto" data-testid="experience-section">
      <SectionTitle eyebrow="// experience" title="Professional Journey" kicker="A journey of growth across software engineering, full‑stack development, and client services." />
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[#ef4444]/40 via-[#f3e8df] to-transparent" />
        <div className="space-y-6">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-[#ef4444] ring-4 ring-[#ef4444]/15" />
              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs mono uppercase tracking-widest text-accent">{e.type}</div>
                    <div className="mt-1 text-xl font-semibold text-[#1a1a1a]">{e.role}</div>
                    <div className="text-muted-fg">{e.company}</div>
                  </div>
                  <div className="text-xs mono text-muted-fg whitespace-nowrap">{e.range}</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-fg">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2 leading-relaxed"><span className="text-accent">▹</span><span>{b}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROJECTS = [
  {
    title: "Tamil Nadu Election 2026 Vote Share Prediction",
    cat: "Machine Learning & Data Analytics",
    img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=900&h=600&fit=crop",
    desc: "Random Forest Regression model predicting party‑wise vote share for the TN 2026 Assembly Election. End‑to‑end pipeline: preprocessing, feature engineering, training, and visualisation.",
    tags: ["Python", "Pandas", "Scikit‑learn", "Random Forest", "Colab"],
  },
  {
    title: "No Code Chatbot With Dialogflow",
    cat: "Conversational AI",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=900&h=600&fit=crop",
    desc: "Intelligent chatbot using Google Dialogflow with NLP and automated workflows for human‑like conversation.",
    tags: ["Dialogflow", "NLP", "Conversational AI"],
  },
  {
    title: "Hunger Hero — Food Donation App",
    cat: "Mobile Development",
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&h=600&fit=crop",
    desc: "Android app linking food donors and recipients with real‑time notifications and donor‑recipient matching.",
    tags: ["Java", "Android", "Firebase", "Notifications"],
  },
  {
    title: "Injury Anticipation in Football Players",
    cat: "Machine Learning",
    img: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&h=600&fit=crop",
    desc: "ML algorithms predicting player injuries — risk trends and early warning signs through robust feature engineering.",
    tags: ["Python", "ML", "Feature Engineering", "Healthcare AI"],
  },
  {
    title: "Scout & Deal — Football Transfer Recommender",
    cat: "Machine Learning & Data Analytics",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&h=600&fit=crop",
    desc: "Data‑driven recommender combining performance data with ML to evaluate players and forecast transfer suitability.",
    tags: ["Python", "ML", "Data Analytics", "Recommender"],
  },
];

function Projects() {
  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto" data-testid="projects-section">
      <SectionTitle eyebrow="// projects" title="Featured Work" kicker="Showcasing innovative solutions in AI, Machine Learning, and Full‑Stack Development." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((p, i) => (
          <article key={p.title} className="glass rounded-2xl overflow-hidden card-hover group" data-testid={`project-card-${i}`}>
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 chip !bg-white/95 backdrop-blur-md">{p.cat}</span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-snug text-[#1a1a1a]">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-fg leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex flex-wrap">
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const SKILLS = [
  { group: "Languages", items: ["Java", "JavaScript", "TypeScript", "Python", "C", "SQL"] },
  { group: "Web & Frontend", items: ["HTML5", "CSS3", "React JS"] },
  { group: "Backend & Frameworks", items: ["Spring Boot", "Node.js", "REST APIs"] },
  { group: "Cloud & DevOps", items: ["AWS", "Docker", "CI/CD", "Microservices Architecture", "Git"] },
  { group: "Data & ML", items: ["Pandas", "Scikit-learn", "Random Forest", "Power BI", "Machine Learning", "Feature Engineering", "Conversational AI"] },
  { group: "Practices & Tools", items: ["Agile / Scrum", "Test-Driven Development (TDD)", "Database Design", "Database Management"] },
];

function Skills() {
  const attrs = [
    "Strong Analytical Skills",
    "Problem‑Solving",
    "Team Collaboration",
    "Adaptability",
    "Initiative & Curiosity",
    "Effective Communication",
  ];
  return (
    <section id="skills" className="py-24 px-6 max-w-7xl mx-auto" data-testid="skills-section">
      <SectionTitle eyebrow="// skills" title="Skills & Expertise" kicker="Comprehensive technical stack across software development, AI/ML, and data analytics." />
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="grid sm:grid-cols-2 gap-4">
          {SKILLS.map((s) => (
            <div key={s.group} className="glass rounded-2xl p-5 card-hover">
              <div className="flex items-center gap-2 text-xs mono uppercase tracking-widest text-accent">
                <Code2 size={14}/> {s.group}
              </div>
              <div className="mt-3 flex flex-wrap">
                {s.items.map((it) => <span key={it} className="chip">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs mono uppercase tracking-widest text-accent flex items-center gap-2"><Sparkles size={14}/> Professional Attributes</div>
          <ul className="mt-4 space-y-3">
            {attrs.map((a) => (
              <li key={a} className="flex items-center gap-3 text-sm text-[#1a1a1a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />{a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const CERTS = [
  { name: "Intro to Machine Learning", by: "Kaggle" },
  { name: "Python", by: "Kaggle" },
  { name: "Full Stack Development", by: "Besant Technologies" },
  { name: "Database Management System", by: "Pantech e Learning" },
  { name: ".Net Fundamentals", by: "Great Learning" },
  { name: "Introduction to Big Data Tools", by: "Simplilearn" },
  { name: "Designing Blockchain Solutions", by: "AWS Training & Certification" },
];

function Certifications() {
  return (
    <section id="certifications" className="py-24 px-6 max-w-7xl mx-auto" data-testid="certifications-section">
      <SectionTitle eyebrow="// learning" title="Certifications & Achievements" kicker="Continuous learning and professional development across multiple domains." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTS.map((c) => (
          <div key={c.name} className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 border border-rose-200 flex items-center justify-center text-accent">
                <Award size={18}/>
              </div>
              <div>
                <div className="font-medium leading-tight text-[#1a1a1a]">{c.name}</div>
                <div className="text-xs mono text-muted-fg mt-1">{c.by}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs mono uppercase tracking-widest text-accent">Professional Membership</div>
          <div className="mt-3 font-medium text-[#1a1a1a]">International Association of Engineers</div>
          <div className="text-sm text-muted-fg mono">Member ID: 340014</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs mono uppercase tracking-widest text-accent">Professional Membership</div>
          <div className="mt-3 font-medium text-[#1a1a1a]">Institute for Engineering Research and Publication</div>
          <div className="text-sm text-muted-fg mono">Member ID: 97473273</div>
        </div>
      </div>
    </section>
  );
}

function Publications() {
  const pubs = [
    {
      journal: "IJSART",
      meta: "Volume 9, Issue 9 · September 2023",
      title: "AI‑Enhanced Mental Health Care: Innovative Strategies",
      desc: "Created innovative strategies for AI‑enhanced mental health care.",
    },
    {
      journal: "IJSART",
      meta: "Volume 10, Issue 3 · March 2024",
      title: "Football Transfer Recommendation System",
      desc: "Published research on a football transfer recommendation system.",
    },
  ];
  return (
    <section id="publications" className="py-24 px-6 max-w-7xl mx-auto" data-testid="publications-section">
      <SectionTitle eyebrow="// research" title="Research Publications" kicker="Contributing to the academic community through innovative research." />
      <div className="grid md:grid-cols-2 gap-6">
        {pubs.map((p) => (
          <div key={p.title} className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 border border-rose-200 flex items-center justify-center text-accent">
                <BookOpen size={18}/>
              </div>
              <div>
                <div className="text-xs mono uppercase tracking-widest text-accent">{p.journal}</div>
                <div className="text-xs text-muted-fg mt-0.5">{p.meta}</div>
              </div>
            </div>
            <h3 className="mt-4 font-semibold text-lg leading-snug text-[#1a1a1a]">{p.title}</h3>
            <p className="text-sm text-muted-fg mt-2">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      toast.success(res.data?.message || "Message sent! Check your inbox for confirmation.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail || "Failed to send. Please try again later.";
      toast.error(typeof detail === "string" ? detail : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const channels = [
    { icon: Mail, label: "Email", value: "nirnat2002@gmail.com", href: "mailto:nirnat2002@gmail.com", testId: "contact-email" },
    { icon: Phone, label: "Phone", value: "+44 7818462507", href: "tel:+447818462507", testId: "contact-phone" },
    { icon: Linkedin, label: "LinkedIn", value: "Connect on LinkedIn", href: "https://www.linkedin.com/in/nirmal-natarajan-0b5951384", testId: "contact-linkedin" },
    { icon: MapPin, label: "Location", value: "United Kingdom", href: "#", testId: "contact-location" },
  ];

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto" data-testid="contact-section">
      <SectionTitle eyebrow="// contact" title="Get In Touch" kicker="Feel free to reach out for opportunities, collaborations, or just to connect!" />
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
        <div className="space-y-4">
          {channels.map((c) => (
            <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="glass rounded-2xl p-5 flex items-center gap-4 card-hover" data-testid={c.testId}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100 border border-rose-200 flex items-center justify-center text-accent">
                <c.icon size={20}/>
              </div>
              <div>
                <div className="text-xs mono uppercase tracking-widest text-muted-fg">{c.label}</div>
                <div className="mt-0.5 font-medium text-[#1a1a1a]">{c.value}</div>
              </div>
              <ArrowUpRight className="ml-auto text-muted-fg" size={18}/>
            </a>
          ))}
        </div>

        <form onSubmit={submit} className="glass-strong rounded-2xl p-7" data-testid="contact-form">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-accent" />
            <h3 className="text-xl font-semibold text-[#1a1a1a]">Send a Message</h3>
          </div>
          <p className="text-sm text-muted-fg mt-1">Drop a note — I'll reply within 24‑48 hours.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs mono uppercase tracking-widest text-muted-fg mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field"
                placeholder="Your name"
                data-testid="contact-name-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs mono uppercase tracking-widest text-muted-fg mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field"
                placeholder="you@example.com"
                data-testid="contact-email-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs mono uppercase tracking-widest text-muted-fg mb-2">Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="field resize-none"
                placeholder="Tell me about your project, role, or just say hi…"
                data-testid="contact-message-input"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center" data-testid="contact-submit-button">
              {loading ? "Sending…" : (<>Send Message <Send size={16}/></>)}
            </button>
            <p className="text-[11px] text-muted-fg text-center">Your message goes directly to my inbox and you'll receive an auto‑confirmation.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#f3e8df] py-10 px-6 mt-12 bg-white/40" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-fg">© {new Date().getFullYear()} Nirmal Natarajan. Crafted with care.</div>
        <div className="flex items-center gap-4">
          <a href="mailto:nirnat2002@gmail.com" className="text-muted-fg hover:text-accent" aria-label="Email"><Mail size={18}/></a>
          <a href="https://www.linkedin.com/in/nirmal-natarajan-0b5951384" target="_blank" rel="noreferrer" className="text-muted-fg hover:text-accent" aria-label="LinkedIn"><Linkedin size={18}/></a>
          <a href="tel:+447818462507" className="text-muted-fg hover:text-accent" aria-label="Phone"><Phone size={18}/></a>
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative" data-testid="portfolio-root">
      <Toaster theme="light" position="top-right" richColors />
      <Nav active={active} />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Certifications />
      <Publications />
      <Contact />
      <Footer />
    </div>
  );
}
