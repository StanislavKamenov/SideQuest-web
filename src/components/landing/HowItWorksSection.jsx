import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'PICK A MISSION', desc: 'Browse active missions — Body, Social, or Mind. Pick the one that challenges you today.', color: '#E85D4A' },
  { num: '02', title: 'ACT IN THE REAL WORLD', desc: 'Put down the phone and do it. Go outside, call a friend, lift some weights.', color: '#6B9FD4' },
  { num: '03', title: 'UPLOAD PROOF', desc: 'Take a photo or record a short video. Honesty is the core of SideQuest.', color: '#7BC67E' },
  { num: '04', title: 'EARN XP', desc: 'Get XP points and climb the leaderboard. From Recruit to Legend through real actions.', color: '#C8E650' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 relative bg-background">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-pixel text-[clamp(0.7rem,2.5vw,1.2rem)] text-foreground glow-lime mb-4 leading-relaxed">
            HOW IT WORKS
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Four steps. No excuses. Just action.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'md:direction-rtl' : ''
                  }`}
              >
                {/* Number dot */}
                <div
                  className="absolute left-6 md:left-1/2 w-4 h-4 -translate-x-1/2 border-2 flex items-center justify-center"
                  style={{ borderColor: step.color, backgroundColor: step.color + '22', boxShadow: `0 0 12px ${step.color}66` }}
                />

                {/* Content */}
                <div className={`pl-16 md:pl-0 ${i % 2 === 1 ? 'md:col-start-2 md:pl-16' : 'md:pr-16 md:text-right'}`}>
                  <div className="font-pixel text-[2.5rem] leading-none mb-2 opacity-20" style={{ color: step.color }}>
                    {step.num}
                  </div>
                  <h3 className="font-pixel text-[10px] mb-3 tracking-wide leading-relaxed" style={{ color: step.color, textShadow: `0 0 10px ${step.color}88` }}>
                    {step.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>

                {/* Visual */}
                <div className={`hidden md:block pl-16 ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1 md:pr-16 md:pl-0' : ''}`}>
                  <div className="border border-border p-6 bg-card" style={{ borderColor: step.color + '33' }}>
                    <div className="font-pixel text-[8px] text-muted-foreground mb-2 tracking-wider">STAGE {step.num}</div>
                    <div className="font-pixel text-[10px] leading-relaxed" style={{ color: step.color }}>
                      {step.title}
                    </div>
                    <div className="mt-4 h-1 bg-border">
                      <div className="h-full bg-gradient-to-r" style={{
                        width: `${(i + 1) * 25}%`,
                        backgroundImage: `linear-gradient(to right, ${step.color}, ${step.color}88)`
                      }} />
                    </div>
                    <div className="font-pixel text-[7px] text-muted-foreground mt-1">{(i + 1) * 25}% COMPLETE</div>
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