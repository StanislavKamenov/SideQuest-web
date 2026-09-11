import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'PICK A MISSION', desc: 'Browse active missions — Body, Social, or Mind. Pick the one that challenges you today.', color: '#E85D4A', cmd: 'INIT' },
  { num: '02', title: 'ACT IN THE REAL WORLD', desc: 'Put down the phone and do it. Go outside, call a friend, lift some weights.', color: '#6B9FD4', cmd: 'EXECUTE' },
  { num: '03', title: 'UPLOAD PROOF', desc: 'Take a photo or record a short video. Honesty is the core of SideQuest.', color: '#7BC67E', cmd: 'VERIFY' },
  { num: '04', title: 'EARN XP', desc: 'Get XP points and climb the leaderboard. From Recruit to Legend through real actions.', color: '#C8E650', cmd: 'REWARD' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative"
      style={{ background: 'linear-gradient(180deg, rgba(10,9,18,0.92) 0%, rgba(12,11,22,0.92) 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 border border-[#C8E650]/30 px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 bg-[#C8E650] animate-pulse" style={{ boxShadow: '0 0 6px #C8E650' }} />
            <span className="font-pixel text-[7px] text-[#C8E650] tracking-widest">TUTORIAL SEQUENCE</span>
          </div>
          <h2 className="font-pixel text-[clamp(0.7rem,2.5vw,1.2rem)] text-foreground mb-4 leading-relaxed"
            style={{ textShadow: '0 0 20px #C8E65088' }}
          >
            HOW IT WORKS
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Four steps. No excuses. Just action.
          </p>
        </motion.div>

        {/* Steps — arcade terminal progression */}
        <div className="relative">
          {/* Vertical connector — neon line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{
              background: 'linear-gradient(180deg, #E85D4A44, #6B9FD444, #7BC67E44, #C8E65044)',
              boxShadow: '0 0 6px rgba(200,230,80,0.15)',
            }}
          />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  i % 2 === 1 ? 'md:direction-rtl' : ''
                }`}
              >
                {/* Step dot — neon glowing */}
                <div
                  className="absolute left-6 md:left-1/2 w-5 h-5 -translate-x-1/2 border-2 flex items-center justify-center z-10"
                  style={{
                    borderColor: step.color,
                    backgroundColor: step.color + '22',
                    boxShadow: `0 0 16px ${step.color}66, 0 0 32px ${step.color}33`,
                  }}
                >
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: step.color }} />
                </div>

                {/* Content */}
                <div className={`pl-16 md:pl-0 ${i % 2 === 1 ? 'md:col-start-2 md:pl-16' : 'md:pr-16 md:text-right'}`}>
                  <div className="font-pixel text-[2.5rem] leading-none mb-2 opacity-15"
                    style={{ color: step.color, textShadow: `0 0 20px ${step.color}44` }}>
                    {step.num}
                  </div>
                  <h3 className="font-pixel text-[10px] mb-3 tracking-wide leading-relaxed"
                    style={{ color: step.color, textShadow: `0 0 12px ${step.color}88` }}>
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                {/* Visual — CRT terminal card */}
                <div className={`hidden md:block pl-16 ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1 md:pr-16 md:pl-0' : ''}`}>
                  <div className="crt-card p-6" style={{ borderColor: step.color + '33' }}>
                    {/* Terminal header */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <span className="font-pixel text-[6px] text-muted-foreground/50 tracking-widest">
                        {step.cmd}_STAGE.exe
                      </span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/20" />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/20" />
                        <span className="w-1.5 h-1.5" style={{ backgroundColor: step.color + '66' }} />
                      </div>
                    </div>

                    <div className="font-pixel text-[7px] text-muted-foreground/60 mb-1 tracking-wider relative z-10">
                      STAGE {step.num}
                    </div>
                    <div className="font-pixel text-[10px] leading-relaxed relative z-10" style={{ color: step.color }}>
                      {step.title}
                    </div>

                    {/* Progress bar — arcade loading style */}
                    <div className="mt-4 h-2 border relative z-10"
                      style={{ borderColor: step.color + '33', backgroundColor: '#0a091222' }}
                    >
                      <div className="h-full transition-all duration-1000"
                        style={{
                          width: `${(i + 1) * 25}%`,
                          background: `linear-gradient(90deg, ${step.color}88, ${step.color})`,
                          boxShadow: `0 0 8px ${step.color}66`,
                        }}
                      />
                    </div>
                    <div className="font-pixel text-[6px] text-muted-foreground mt-1 relative z-10 flex justify-between">
                      <span>{(i + 1) * 25}% COMPLETE</span>
                      <span style={{ color: step.color + '88' }}>█{'░'.repeat(3 - i)}{'█'.repeat(i)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}