import React from 'react';
import { motion } from 'framer-motion';

export default function PillarCard({ title, subtitle, description, image, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group cursor-default"
    >
      <div className="relative bg-background border border-border transition-all duration-500 group-hover:shadow-[8px_8px_0px_0px_hsl(var(--foreground)/0.08)] group-hover:-translate-x-1 group-hover:-translate-y-1">
        {/* Image */}
        <div className="overflow-hidden">
          <img 
            src={image}
            alt={title}
            className="w-full aspect-[4/5] object-cover grayscale-[30%] contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              {subtitle}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              0{index + 1}
            </span>
          </div>
          
          <div className="h-px bg-border mb-5" />
          
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[-0.02em] text-foreground mb-4">
            {title}
          </h3>
          
          <p className="font-body text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}