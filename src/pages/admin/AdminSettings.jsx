import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { demoBusinessProfile } from '@/lib/demoData';

export default function AdminSettings() {
  const [profile, setProfile] = useState(demoBusinessProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const toggleNotification = (key) => {
    setProfile((p) => ({
      ...p,
      notifications: { ...p.notifications, [key]: !p.notifications[key] },
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
          SETTINGS
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Manage your business profile and preferences
        </p>
      </div>

      {/* Business Profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center border-2 border-[#E85D4A]/40 bg-[#E85D4A]/10">
            <User className="w-4 h-4 text-[#E85D4A]" />
          </div>
          <div>
            <h2 className="font-pixel text-[9px] text-foreground tracking-wider">BUSINESS PROFILE</h2>
            <p className="font-body text-xs text-muted-foreground">Your company information</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Logo placeholder */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-secondary border-2 border-border flex items-center justify-center">
              <span className="font-pixel text-[16px] text-[#E85D4A]">SQ</span>
            </div>
            <div>
              <button type="button" className="font-pixel text-[7px] text-[#6B9FD4] tracking-wider hover:underline">
                CHANGE LOGO
              </button>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3" /> BUSINESS NAME
              </label>
              <input
                value={profile.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> EMAIL
              </label>
              <input
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> PHONE
              </label>
              <input
                value={profile.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> WEBSITE
              </label>
              <input
                value={profile.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> ADDRESS
            </label>
            <input
              value={profile.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#E85D4A] text-white px-5 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
            >
              <Save className="w-4 h-4" />
              {saved ? 'SAVED ✓' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border"
      >
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center border-2 border-[#C8E650]/40 bg-[#C8E650]/10">
            <Bell className="w-4 h-4 text-[#C8E650]" />
          </div>
          <div>
            <h2 className="font-pixel text-[9px] text-foreground tracking-wider">NOTIFICATIONS</h2>
            <p className="font-body text-xs text-muted-foreground">Choose what you get notified about</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {[
            { key: 'emailOnNewRedemption', label: 'Email on new redemption', desc: 'Get notified when a user redeems a reward' },
            { key: 'emailOnPayment', label: 'Email on payment received', desc: 'Get notified when a payment is completed' },
            { key: 'emailWeeklySummary', label: 'Weekly summary email', desc: 'Receive a weekly digest of your business metrics' },
            { key: 'pushOnNewParticipant', label: 'Push on new participant', desc: 'Get a push notification when someone joins an event' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="font-body text-sm text-foreground">{label}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(key)}
                className={`w-10 h-5 flex items-center px-0.5 transition-colors ${
                  profile.notifications[key] ? 'bg-[#C8E650] justify-end' : 'bg-secondary justify-start'
                }`}
              >
                <div className={`w-4 h-4 transition-colors ${
                  profile.notifications[key] ? 'bg-background' : 'bg-muted-foreground'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-[#E85D4A]/30"
      >
        <div className="px-5 py-4 border-b border-[#E85D4A]/20">
          <h2 className="font-pixel text-[9px] text-[#E85D4A] tracking-wider">DANGER ZONE</h2>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">Delete business account</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">This action cannot be undone</p>
          </div>
          <button className="px-4 py-2 border border-[#E85D4A]/40 font-pixel text-[7px] text-[#E85D4A] tracking-wider hover:bg-[#E85D4A]/10 transition-colors">
            DELETE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
