import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import FooterCTA from '@/components/landing/FooterCTA';
import ArcadeScene from '@/components/landing/3d/ArcadeScene';
import AmbientArcade from '@/components/landing/3d/AmbientArcade';
import { Search, HelpCircle, ChevronDown, Award, Shield, Cpu } from 'lucide-react';

const faqData = [
  {
    category: 'GENERAL', icon: HelpCircle, color: '#E85D4A',
    questions: [
      { q: 'WHAT IS SIDEQUEST?', a: 'SideQuest is a gamified productivity and lifestyle app that turns your real-world activities into epic quests. By completing daily tasks, habits, and adventurous missions, you earn experience points (XP), level up, and unlock pixel-art achievements.' },
      { q: 'HOW DOES THE APP ENCOURAGE SCREEN-FREE TIME?', a: 'Unlike traditional apps that keep you scrolling, SideQuest rewards you for taking action in the real world. Many of our quests are specifically designed to be completed offline (like outdoor exploration, workouts, or learning a physical skill). You log your completion, get approved, and then put your phone back down.' },
      { q: 'IS SIDEQUEST FREE TO USE?', a: 'Yes, SideQuest is completely free to download and play! We offer core questing, leveling, and leaderboard systems to all players. We also have a premium tier for advanced players who want detailed analytics, custom quest templates, and exclusive pixel-art cosmetics.' }
    ]
  },
  {
    category: 'GAMEPLAY & XP', icon: Award, color: '#C8E650',
    questions: [
      { q: 'HOW DO I EARN XP?', a: 'You earn XP by completing quests, logging daily habits, and hitting streaks. Each quest has a difficulty level (Easy, Medium, Hard, Epic) which determines how much XP you receive. Some quests also offer special item loot!' },
      { q: 'WHAT IS "PROOF OF COMPLETION"?', a: 'To keep the gameplay fair, certain community and guild quests require you to submit a "proof" — this could be a photo of your completed workout, a screenshot of your learning streak, or a short log. Other users or auto-moderation verify your proof before XP is awarded.' },
      { q: 'CAN I CREATE MY OWN CUSTOM QUESTS?', a: 'Absolutely! You can create custom quests for your own daily chores, routines, or personal goals. You can set the XP values, repetition schedule, and add reminders.' }
    ]
  },
  {
    category: 'SECURITY & TECH', icon: Shield, color: '#6B9FD4',
    questions: [
      { q: 'HOW IS MY PRIVACY PROTECTED?', a: 'Your privacy is our number one priority. Any photo proofs you upload for private quests are visible only to you. For public/guild quests, you can choose what to share. We never sell your personal data or location history.' },
      { q: 'CAN I SYNC SIDEQUEST WITH MY HEALTH APPS?', a: 'Yes! SideQuest supports integrations with Apple Health and Google Fit. You can auto-complete fitness and sleep quests by syncing your device data directly.' },
      { q: 'WHAT PLATFORMS IS SIDEQUEST AVAILABLE ON?', a: 'SideQuest is built using React Native & Expo, making it available on both iOS (App Store) and Android (Google Play Store). You can find download links at the top and bottom of our site.' }
    ]
  }
];

function FAQAccordionItem({ question, answer, isOpen, onToggle, activeColor }) {
  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-pixel text-[9px] sm:text-[10px] leading-relaxed transition-all duration-300 crt-card"
        style={{
          borderColor: isOpen ? activeColor + '66' : 'hsl(var(--border))',
          boxShadow: isOpen ? `0 0 16px ${activeColor}22, inset 0 0 8px ${activeColor}08` : 'none',
        }}
      >
        <span className="pr-4 tracking-wide relative z-10"
          style={{ color: isOpen ? activeColor : 'hsl(var(--foreground))', textShadow: isOpen ? `0 0 8px ${activeColor}66` : 'none' }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="flex-shrink-0 relative z-10"
        >
          <ChevronDown className="w-4 h-4" style={{ color: isOpen ? activeColor : 'hsl(var(--muted-foreground))' }} />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 font-body text-sm text-muted-foreground leading-relaxed"
              style={{
                backgroundColor: 'rgba(10,9,18,0.9)',
                borderLeft: `2px solid ${activeColor}66`,
                borderRight: `1px solid ${activeColor}22`,
                borderBottom: `1px solid ${activeColor}22`,
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFAQ = faqData.map((cat, catIdx) => {
    const questions = cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, questions, catIdx };
  }).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Ambient Layer */}
      <ArcadeScene>
        <AmbientArcade color="#6B9FD4" />
      </ArcadeScene>

      <div className="relative z-10">
        <Navbar />

        <main className="pt-28 pb-20 max-w-4xl mx-auto px-5 md:px-8">
          {/* Header — HELP TERMINAL */}
          <div className="text-center mb-16 relative py-12 crt-card border-2 border-border/60">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E85D4A]/8 rounded-full blur-3xl pointer-events-none" />
            
            {/* Terminal header bar */}
            <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
              <span className="w-1.5 h-1.5 bg-[#E85D4A]" style={{ boxShadow: '0 0 4px #E85D4A' }} />
              <span className="w-1.5 h-1.5 bg-[#C8E650]" style={{ boxShadow: '0 0 4px #C8E650' }} />
              <span className="w-1.5 h-1.5 bg-[#6B9FD4]" style={{ boxShadow: '0 0 4px #6B9FD4' }} />
              <span className="font-pixel text-[6px] text-muted-foreground/40 ml-2 tracking-widest">HELP_TERMINAL.exe</span>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 border border-[#C8E650]/40 px-3 py-1 mb-6">
                <span className="w-2 h-2 bg-[#C8E650] animate-pulse" style={{ boxShadow: '0 0 6px #C8E650' }} />
                <span className="font-pixel text-[8px] text-[#C8E650] tracking-widest">KNOWLEDGE DATABASE</span>
              </div>

              <h1 className="font-pixel text-[clamp(0.9rem,3.5vw,1.5rem)] text-foreground mb-6 tracking-wide"
                style={{ textShadow: '0 0 20px #E85D4A88' }}
              >
                HELP TERMINAL
              </h1>
              <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
                Need help on your quest? Search our knowledge base or browse questions by category below.
              </p>

              {/* Search Bar — terminal input */}
              <div className="max-w-md mx-auto mt-10 px-5 relative">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none z-10">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="SEARCH THE KNOWLEDGE BASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0912] border-2 border-border pl-11 pr-5 py-3.5 font-pixel text-[8px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-[#E85D4A] transition-all duration-300"
                  style={{
                    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)',
                  }}
                />
                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                  <span className="font-pixel text-[6px] text-muted-foreground/30 blink">█</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.category} className="mb-12">
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/50">
                    <Icon className="w-5 h-5" style={{ color: category.color, filter: `drop-shadow(0 0 4px ${category.color}66)` }} />
                    <h2 className="font-pixel text-[10px] sm:text-[11px] tracking-widest"
                      style={{ color: category.color, textShadow: `0 0 10px ${category.color}44` }}
                    >
                      {category.category}
                    </h2>
                  </div>

                  <div>
                    {category.questions.map((item, qIdx) => {
                      const originalIdx = faqData[category.catIdx].questions.findIndex(q => q.q === item.q);
                      const isOpen = !!openItems[`${category.catIdx}-${originalIdx}`];
                      return (
                        <FAQAccordionItem
                          key={item.q}
                          question={item.q}
                          answer={item.a}
                          isOpen={isOpen}
                          onToggle={() => toggleItem(category.catIdx, originalIdx)}
                          activeColor={category.color}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 crt-card">
              <Cpu className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-bounce relative z-10" />
              <p className="font-pixel text-[9px] text-muted-foreground relative z-10">NO SEARCH RESULTS FOUND ON YOUR RADAR.</p>
            </div>
          )}
        </main>

        <FooterCTA />
      </div>
    </div>
  );
}
