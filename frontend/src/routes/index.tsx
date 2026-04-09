"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Rocket, Code2, Sparkles, ArrowRight, Zap, Share2, ShieldCheck, Users, BookOpen } from "lucide-react";
import HeroCanvas from "@/components/HeroCanvas";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { signout, user } = useAuth();

  const handleSignout = () => {
    signout();
    navigate({ to: "/login" });
  };

  return (
<div className="min-h-screen bg-[#020817] text-white selection:bg-primary/30 overflow-x-hidden">
      <style>{`
        @keyframes aurora1 {
          0%, 100% { transform: translate(0px, 0px); }
          25%  { transform: translate(80px, -40px); }
          50%  { transform: translate(-80px, 40px); }
          75%  { transform: translate(40px, 20px); }
        }
        @keyframes aurora2 {
          0%, 100% { transform: translate(0px, 0px); }
          25%  { transform: translate(-60px, 40px); }
          50%  { transform: translate(60px, -40px); }
          75%  { transform: translate(-30px, -20px); }
        }
        @keyframes aurora3 {
          0%, 100% { transform: translate(-50%, 0px); }
          33%  { transform: translate(calc(-50% + 40px), 20px); }
          66%  { transform: translate(calc(-50% - 40px), -20px); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }
        .aurora-blob-1 {
          background: color-mix(in oklch, var(--primary) 30%, transparent);
        }
        .aurora-blob-2 {
          background: color-mix(in oklch, var(--primary) 20%, transparent);
        }
        .aurora-blob-3 {
          background: color-mix(in oklch, var(--primary) 15%, transparent);
        }
        .hero-gradient-text {
          background: linear-gradient(90deg, var(--primary), color-mix(in oklch, var(--primary) 60%, white));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-card {
          background: linear-gradient(135deg,
            color-mix(in oklch, var(--primary) 25%, transparent),
            color-mix(in oklch, var(--background) 80%, transparent),
            color-mix(in oklch, var(--primary) 10%, transparent)
          );
        }
        .cta-blob-1 {
          background: color-mix(in oklch, var(--primary) 20%, transparent);
        }
        .cta-blob-2 {
          background: color-mix(in oklch, var(--primary) 15%, transparent);
        }
        .badge-pill {
          border-color: color-mix(in oklch, var(--primary) 30%, transparent);
          background: color-mix(in oklch, var(--primary) 10%, transparent);
          color: var(--primary);
        }
        .timeline-line {
          background: linear-gradient(to bottom,
            color-mix(in oklch, var(--primary) 50%, transparent),
            color-mix(in oklch, var(--primary) 20%, transparent),
            transparent
          );
        }
        .timeline-node {
          border-color: color-mix(in oklch, var(--primary) 30%, transparent);
          color: var(--primary);
          box-shadow: 0 4px 24px color-mix(in oklch, var(--primary) 20%, transparent);
        }
        .timeline-badge {
          border-color: color-mix(in oklch, var(--primary) 50%, transparent);
          color: var(--primary);
        }
        .section-label {
          color: var(--primary);
        }
        .feature-accent-primary {
          background: linear-gradient(135deg, color-mix(in oklch, var(--primary) 20%, transparent), transparent);
        }
      `}</style>

      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>VibeConnect</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/api/projects" className="text-sm text-slate-400 hover:text-white transition-colors">
              Explore Projects
            </Link>
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignout} className="border-white/10 hover:bg-white/5">
                Sign Out
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate({ to: "/login" })} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">

       {/* 3D Canvas Background */}
<div className="absolute inset-0" style={{ zIndex: 0, opacity: 0.6 }}>
  <HeroCanvas />
</div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          <div className="aurora-blob-1 absolute -top-40 -left-40 w-[600px] h-[600px] blur-[140px] rounded-full" style={{ animation: "aurora1 20s ease-in-out infinite" }} />
          <div className="aurora-blob-2 absolute top-40 -right-40 w-[600px] h-[600px] blur-[140px] rounded-full" style={{ animation: "aurora2 25s ease-in-out infinite" }} />
          <div className="aurora-blob-3 absolute bottom-[-200px] left-1/2 w-[700px] h-[500px] blur-[140px] rounded-full" style={{ animation: "aurora3 30s ease-in-out infinite" }} />
        </div>

        <div className="max-w-5xl mx-auto text-center" style={{ position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge-pill inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium mb-6"
          >
            <Zap className="w-3 h-3" />
            <span>Sprint Capstone · April 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
          >
            Where Founders Meet <br />
            <span className="hero-gradient-text">Vibecoders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bridging the gap between startup founders sharing their journeys and
            developers who thrive on building exciting, early-stage products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="bg-white text-black hover:bg-slate-200 px-8 group" onClick={() => navigate({ to: "/api/users/register" })}>
              I'm a Founder
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 px-8" onClick={() => navigate({ to: "/api/projects" })}>
              Browse Projects
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="mt-16 flex flex-wrap justify-center gap-10 border-t border-white/10 pt-10"
          >
            {[
              { value: "200+", label: "Founders onboarded" },
              { value: "1.4k", label: "Vibecoders matched" },
              { value: "98%", label: "Project success rate" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Marquee / Tech Stack --- */}
      <div className="py-10 border-y border-white/5 overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, gi) => (
            <div key={gi} className="flex items-center gap-16 px-8">
              {["Spring Boot", "React", "Python", "Microservices", "PostgreSQL", "Docker", "Kafka", "TailwindCSS", "Scikit-Learn","TensorFlow","FastAPI", "Expo"].map((tech) => (
                <span key={tech} className="text-slate-500 text-sm font-medium whitespace-nowrap tracking-wide uppercase">{tech}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* --- Features Section --- */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <span className="section-label inline-block text-xs font-semibold uppercase tracking-widest mb-3">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Everything you need to <br />
              <span className="hero-gradient-text">build together</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
              A full-stack platform purpose-built for early-stage startup velocity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-5">
            <FeatureCard
              icon={<Rocket className="w-5 h-5" style={{ color: "var(--primary)" }} />}
              accentClass="feature-accent-primary"
              tag="For Founders"
              title="Post your startup story"
              description="Share your building journey, post open roles, and attract developers who are excited about what you're creating — not just the paycheck."
            />
            <FeatureCard
              icon={<Code2 className="w-5 h-5 text-pink-400" />}
              accentClass=""
              accentStyle={{ background: "linear-gradient(135deg, rgba(236,72,153,0.15), transparent)" }}
              tag="For Builders"
              title="Discover & apply to projects"
              description="Browse early-stage projects filtered by stack, stage, and vibe. Apply in one click and connect directly with the founder."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5 text-blue-400" />}
              accentClass=""
              accentStyle={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), transparent)" }}
              tag="Matchmaking"
              title="Smart vibecoder matching"
              description="Our system surfaces the right builders for each project based on skills, interests, and availability — cutting time-to-team in half."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              accentClass=""
              accentStyle={{ background: "linear-gradient(135deg, rgba(52,211,153,0.15), transparent)" }}
              tag="Security"
              title="Secured Auth"
              description="Every user action is protected and validated . Role-based access ensures founders and builders see only what they should."
            />
            <FeatureCard
              icon={<Share2 className="w-5 h-5 text-amber-400" />}
              accentClass=""
              accentStyle={{ background: "linear-gradient(135deg, rgba(251,191,36,0.15), transparent)" }}
              tag="Collabration"
              title="Get Inspired"
              description="Get Inspired from Builder stories and build your own tech someday , fuel your self with the zeal."
            />
          </div>

        </div>
      </section>

      {/* --- How It Works --- */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-20">
            <span className="section-label inline-block text-xs font-semibold uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              From idea to team <br />
              <span className="hero-gradient-text">in four steps</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-base leading-relaxed">
              No lengthy forms, no recruiter fees. Just signal and alignment.
            </p>
          </div>

          <div className="relative">
            <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" />

            <div className="flex flex-col gap-16">
              {[
                { step: "01", side: "left",  icon: <BookOpen className="w-5 h-5" />, title: "Create your profile",       tag: "Sign Up",  description: "Founders describe their startup vision, current stack, and what kind of builder they're looking for. Builders showcase their skills, preferred stack, and project appetite." },
                { step: "02", side: "right", icon: <Rocket className="w-5 h-5" />,   title: "Post or browse projects",   tag: "Discover", description: "Founders publish project opportunities with context, roles needed, and equity or compensation details. Builders filter by stage, tech, and commitment level." },
                { step: "03", side: "left",  icon: <Users className="w-5 h-5" />,    title: "Match & connect",           tag: "Connect",  description: "Builders apply with a short intro. Founders review and respond. No cold emails, no ghosting — the platform keeps both sides accountable." },
                { step: "04", side: "right", icon: <Zap className="w-5 h-5" />,      title: "Start building together",   tag: "Build",    description: "Once aligned, the team forms and building begins. Track project updates, share milestones, and keep your building story alive on the platform." },
              ].map((item, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${item.side === "right" ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${item.side === "left" ? "md:text-right" : "md:text-left"}`}>
                    <span className="section-label inline-block text-xs font-semibold uppercase tracking-widest mb-2">{item.tag}</span>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{item.description}</p>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <div className="timeline-node w-14 h-14 rounded-2xl bg-slate-900 border flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="timeline-badge absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-950 border flex items-center justify-center text-[10px] font-bold">
                      {item.step}
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Banner --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="cta-card relative rounded-3xl border border-white/10 bg-white/[0.08] backdrop-blur-sm px-10 py-16 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="cta-blob-1 absolute -top-20 -left-20 w-72 h-72 blur-[100px] rounded-full" />
              <div className="cta-blob-2 absolute -bottom-20 -right-20 w-72 h-72 blur-[100px] rounded-full" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to find your{" "}
                <span className="hero-gradient-text">co-builder?</span>
              </h2>
              <p className="text-slate-200 mb-8 max-w-lg mx-auto leading-relaxed">
                Join the platform where the best startup ideas meet the builders who can bring them to life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-slate-200 px-8 group" onClick={() => navigate({ to: "/api/users/register" })}>
                  Get started free
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 px-8" onClick={() => navigate({ to: "/api/projects" })}>
                  Browse projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 VibeConnect · GL Spark Capstone Project</p>
      </footer>

    </div>
  );
}

function FeatureCard({
  icon,
  accentClass,
  accentStyle,
  tag,
  title,
  description,
}: {
  icon: React.ReactNode;
  accentClass?: string;
  accentStyle?: React.CSSProperties;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-7 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all group overflow-hidden">
      <div className={`absolute top-0 left-0 w-48 h-48 blur-2xl pointer-events-none ${accentClass ?? ""}`} style={accentStyle} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{tag}</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}