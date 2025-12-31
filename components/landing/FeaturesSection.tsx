'use client';

import {
  GraduationCap,
  Brain,
  BarChart3,
  Calendar,
  Users,
  Award
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'UK National Curriculum',
    description: 'Full integration with Key Stage 3 and 4 standards. Every lesson mapped to curriculum objectives.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Assessments',
    description: 'Intelligent question generation and evaluation. Instant feedback with personalised recommendations.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Real-time engagement metrics. Identify struggling students before they fall behind.',
  },
  {
    icon: Calendar,
    title: 'Smart Timetabling',
    description: 'AI-optimised scheduling based on student performance patterns. Maximum engagement, minimal friction.',
  },
  {
    icon: Users,
    title: 'Multi-Portal Access',
    description: 'Dedicated dashboards for students, teachers, and headteachers. Everyone sees what they need.',
  },
  {
    icon: Award,
    title: 'ASDAN Ready',
    description: 'Built-in support for ASDAN qualifications. Track evidence and certifications in one place.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding relative">
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: 'linear-gradient(180deg, transparent 0%, hsl(180 20% 12%) 50%, transparent 100%)' }}
      />

      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="level-gradient-text">Level Up</span>
          </h2>
          <p className="text-level-muted-foreground max-w-2xl mx-auto">
            Purpose-built for special education schools. Not a generic system adapted for SEND -
            designed from the ground up for your unique needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 border-2 bg-level-card transition-all duration-300 hover:translate-y-[-4px]"
              style={{
                borderColor: 'hsl(172 55% 35% / 0.35)',
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-level-primary/40 group-hover:bg-level-primary transition-colors" />

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(172 55% 35% / 0.15), hsl(175 70% 50% / 0.15))',
                    border: '1px solid hsl(172 55% 35% / 0.25)',
                  }}
                >
                  <feature.icon className="w-6 h-6 text-level-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-level-foreground mb-2 group-hover:text-level-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-level-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
