'use client';

import { ArrowRight, GraduationCap, Brain, BarChart3 } from 'lucide-react';

const HeroSection = () => {
  const handleContactClick = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, hsl(172 55% 35% / 0.4) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, hsl(175 70% 50% / 0.3) 0%, transparent 70%)' }}
      />

      <div className="container relative">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-level-accent animate-pulse" />
            <span className="text-level-muted-foreground text-sm">Special Education Software</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="block">Your School.</span>
            <span className="block level-gradient-text">Intelligent Management.</span>
            <span className="block">Built for SEND.</span>
          </h1>

          <p className="text-lg md:text-xl text-level-muted-foreground mb-8 max-w-2xl">
            AI-powered school management designed for special education. UK National Curriculum integration,
            intelligent assessments, and progress tracking that actually works.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button onClick={handleContactClick} className="btn-primary inline-flex items-center justify-center gap-2">
              Book a Demo
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-level-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-level-primary/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-level-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-level-foreground">UK Curriculum</p>
                <p className="text-xs text-level-muted-foreground">KS3 & KS4</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-level-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-level-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-level-foreground">AI-Powered</p>
                <p className="text-xs text-level-muted-foreground">Assessments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-level-primary/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-level-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-level-foreground">Real-Time</p>
                <p className="text-xs text-level-muted-foreground">Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
