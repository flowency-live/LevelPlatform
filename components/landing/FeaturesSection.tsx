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
              className="level-card level-card-hover p-6 relative group"
            >
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-level-primary to-level-accent rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-level-primary/30 to-level-accent/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-level-accent" />
              </div>

              <h3 className="text-lg font-semibold text-level-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-level-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
