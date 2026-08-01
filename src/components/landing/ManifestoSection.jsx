import React from 'react';
import { motion } from 'framer-motion';

export default function ManifestoSection({ image }) {
  return (
    <section className="py-24 md:py-40 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-border" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-12"
          >
            <div className="relative">
              <img
                src={image}
                alt="Човек върви по горска пътека в сутрешна мъгла"
                className="w-full aspect-[16/7] object-cover grayscale-[25%] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <p className="font-display text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] tracking-[-0.02em] font-bold text-foreground max-w-3xl">
                    Не броим часове на екрана.
                    <br />
                    <span className="italic font-normal">Броим часове в живота.</span>
                  </p>
                  <div className="h-px bg-foreground/20 my-6 max-w-sm" />
                  <p className="font-body text-base text-muted-foreground max-w-lg">
                    SideQuest не е поредната социална мрежа. Това е платформа, която те награждава
                    за неща, направени далеч от телефона. Всеки ден е нова възможност за мисия.
                  </p>
                </motion.blockquote>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}