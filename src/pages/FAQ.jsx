import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import FooterCTA from '@/components/landing/FooterCTA';
import { Search, HelpCircle, ChevronDown, Award, Shield, Cpu } from 'lucide-react';

const faqData = [
  {
    category: 'GENERAL',
    icon: HelpCircle,
    color: '#E85D4A', // Red
    questions: [
      {
        q: 'WHAT IS SIDEQUEST?',
        a: 'SideQuest is a gamified productivity and lifestyle app that turns your real-world activities into epic quests. By completing daily tasks, habits, and adventurous missions, you earn experience points (XP), level up, and unlock pixel-art achievements.'
      },
      {
        q: 'HOW DOES THE APP ENCOURAGE SCREEN-FREE TIME?',
        a: 'Unlike traditional apps that keep you scrolling, SideQuest rewards you for taking action in the real world. Many of our quests are specifically designed to be completed offline (like outdoor exploration, workouts, or learning a physical skill). You log your completion, get approved, and then put your phone back down.'
      },
      {
        q: 'IS SIDEQUEST FREE TO USE?',
        a: 'Yes, SideQuest is completely free to download and play! We offer core questing, leveling, and leaderboard systems to all players. We also have a premium tier for advanced players who want detailed analytics, custom quest templates, and exclusive pixel-art cosmetics.'
      }
    ]
  },
  {
    category: 'GAMEPLAY & XP',
    icon: Award,
    color: '#C8E650', // Lime
    questions: [
      {
        q: 'HOW DO I EARN XP?',
        a: 'You earn XP by completing quests, logging daily habits, and hitting streaks. Each quest has a difficulty level (Easy, Medium, Hard, Epic) which determines how much XP you receive. Some quests also offer special item loot!'
      },
      {
        q: 'WHAT IS "PROOF OF COMPLETION"?',
        a: 'To keep the gameplay fair, certain community and guild quests require you to submit a "proof" — this could be a photo of your completed workout, a screenshot of your learning streak, or a short log. Other users or auto-moderation verify your proof before XP is awarded.'
      },
      {
        q: 'CAN I CREATE MY OWN CUSTOM QUESTS?',
        a: 'Absolutely! You can create custom quests for your own daily chores, routines, or personal goals. You can set the XP values, repetition schedule, and add reminders.'
      }
    ]
  },
  {
    category: 'SECURITY & TECH',
    icon: Shield,
    color: '#6B9FD4', // Blue
    questions: [
      {
        q: 'HOW IS MY PRIVACY PROTECTED?',
        a: 'Your privacy is our number one priority. Any photo proofs you upload for private quests are visible only to you. For public/guild quests, you can choose what to share. We never sell your personal data or location history.'
      },
      {
        q: 'CAN I SYNC SIDEQUEST WITH MY HEALTH APPS?',
        a: 'Yes! SideQuest supports integrations with Apple Health and Google Fit. You can auto-complete fitness and sleep quests by syncing your device data directly.'
      },
      {
        q: 'WHAT PLATFORMS IS SIDEQUEST AVAILABLE ON?',
        a: 'SideQuest is built using React Native & Expo, making it available on both iOS (App Store) and Android (Google Play Store). You can find download links at the top and bottom of our site.'
      }
    ]
  }
];

function FAQAccordionItem({ question, answer, isOpen, onToggle, activeColor }) {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-pixel text-[10px] sm:text-[11px] leading-relaxed transition-all duration-300"
        style={{
          backgroundColor: '#0c0b11',
          border: `2px solid ${isOpen ? activeColor : '#1e1b29'}`,
          boxShadow: isOpen 
            ? `0 0 12px ${activeColor}33, inset -2px -2px 0 0 ${activeColor}66, inset 2px 2px 0 0 ${activeColor}33` 
            : 'inset -2px -2px 0 0 #1e1b2922, inset 2px 2px 0 0 #ffffff0a',
        }}
      >
        <span className="pr-4 tracking-wide" style={{ color: isOpen ? activeColor : '#f4f4f5' }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', damping: 15 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" style={{ color: isOpen ? activeColor : '#71717a' }} />
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
            <div 
              className="p-5 font-body text-sm text-muted-foreground leading-relaxed border-t-0"
              style={{
                backgroundColor: '#09080d',
                borderLeft: `2px solid ${activeColor}`,
                borderRight: `2px solid ${activeColor}44`,
                borderBottom: `2px solid ${activeColor}44`,
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
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filter questions based on search query
  const filteredFAQ = faqData.map((cat, catIdx) => {
    const questions = cat.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, questions, catIdx };
  }).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-5 md:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 relative py-12 pixel-grid bg-card/40 border-2 border-border/80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E85D4A]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 border border-[#C8E650]/40 px-3 py-1 mb-6">
            <span className="w-2 h-2 bg-[#C8E650] animate-pulse" />
            <span className="font-pixel text-[8px] text-[#C8E650] tracking-widest">KNOWLEDGE DATABASE</span>
          </div>

          <h1 className="font-pixel text-[clamp(1.1rem,4vw,1.8rem)] text-foreground glow-red mb-6 tracking-wide">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
            Need help on your quest? Search our knowledge base or browse questions by category below.
          </p>

          {/* Glowing Retro Search Bar */}
          <div className="max-w-md mx-auto mt-10 px-5 relative">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="SEARCH THE KNOWLEDGE BASE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c0b11] border-2 border-[#1e1b29] pl-11 pr-5 py-3.5 font-pixel text-[9px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#E85D4A] focus:shadow-[0_0_15px_rgba(232,93,74,0.25)] transition-all duration-300"
              style={{
                boxShadow: 'inset -2px -2px 0 0 #1e1b2922, inset 2px 2px 0 0 #ffffff05'
              }}
            />
          </div>
        </div>

        {/* FAQ Content */}
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.category} className="mb-12">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2 border-border">
                  <Icon className="w-5 h-5" style={{ color: category.color }} />
                  <h2 
                    className="font-pixel text-[11px] sm:text-[12px] tracking-widest"
                    style={{ 
                      color: category.color,
                      textShadow: `0 0 10px ${category.color}44`
                    }}
                  >
                    {category.category}
                  </h2>
                </div>

                {/* Questions Accordion */}
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
          <div className="text-center py-12 border-2 border-dashed border-border/80">
            <Cpu className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-bounce" />
            <p className="font-pixel text-[9px] text-muted-foreground">NO SEARCH RESULTS FOUND ON YOUR RADAR.</p>
          </div>
        )}
      </main>

      <FooterCTA />
    </div>
  );
}
