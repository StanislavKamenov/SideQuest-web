import React from 'react';
import { motion } from 'framer-motion';

const pillars = [
  { icon: '💪', label: 'BODY', color: '#E85D4A', desc: 'Running, workouts, sleep, nutrition — missions that keep you moving every day.' },
  { icon: '🤝', label: 'SOCIAL', color: '#6B9FD4', desc: 'Meet a friend, call a loved one. Real connections are built offline.' },
  { icon: '🧠', label: 'MIND', color: '#C8E650', desc: 'Reading, meditation, new skills. Grow beyond your comfort zone.' },
];

export default function PillarsSection() {
  return (
    <section className="py-4 border-y-2 border-border bg-card">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex items-start gap-4 p-8 group hover:bg-background transition-colors"
            >
              <div className="text-3xl flex-shrink-0 mt-1">{p.icon}</div>
              <div>
                <h3 className="font-pixel text-[10px] mb-2 tracking-wide"
                  style={{ color: p.color, textShadow: `0 0 10px ${p.color}88` }}>
                  {p.label}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}