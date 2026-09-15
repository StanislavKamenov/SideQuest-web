import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    logo_url: '',
    notifications: {
      emailOnNewRedemption: true,
      emailWeeklySummary: true,
      pushOnNewParticipant: true,
    }
  });
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single();
        
      if (data) {
        setProfile((prev) => ({
          ...prev,
          id: data.id,
          name: data.name || '',
          email: data.contact_email || '',
          phone: data.contact_phone || '',
          website: data.website || '',
          address: data.address || '',
          description: data.description || '',
          logo_url: data.logo_url || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching business profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile.id) return;
    
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: profile.name,
          contact_email: profile.email,
          contact_phone: profile.phone,
          website: profile.website,
          address: profile.address,
          description: profile.description,
        })
        .eq('id', profile.id);
        
      if (error) throw error;
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
          {t("admin.settings.title")}
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          {t("admin.settings.subtitle")}
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
            <h2 className="font-pixel text-[9px] text-foreground tracking-wider">{t("admin.settings.businessProfile")}</h2>
            <p className="font-body text-xs text-muted-foreground">{t("admin.settings.businessProfileDesc")}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          {/* Logo placeholder */}
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-secondary border-2 border-border flex items-center justify-center overflow-hidden">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="font-pixel text-[16px] text-[#E85D4A]">
                  {profile.name ? profile.name.substring(0, 2).toUpperCase() : 'SQ'}
                </span>
              )}
            </div>
            <div>
              <button type="button" className="font-pixel text-[7px] text-[#6B9FD4] tracking-wider hover:underline">
                {t("admin.settings.changeLogo")}
              </button>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">{t("admin.settings.logoSpecs")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3" /> {t("admin.settings.businessName")}
              </label>
              <input
                value={profile.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> {t("admin.settings.email")}
              </label>
              <input
                value={profile.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> {t("admin.settings.phone")}
              </label>
              <input
                value={profile.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> {t("admin.settings.website")}
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
              <MapPin className="w-3 h-3" /> {t("admin.settings.address")}
            </label>
            <input
              value={profile.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> {t("admin.settings.description")}
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
              {saved ? t("admin.settings.saved") : t("admin.settings.saveChanges")}
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
            <h2 className="font-pixel text-[9px] text-foreground tracking-wider">{t("admin.settings.notificationsTitle")}</h2>
            <p className="font-body text-xs text-muted-foreground">{t("admin.settings.notificationsDesc")}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {[
            { key: 'emailOnNewRedemption' },
            { key: 'emailWeeklySummary' },
            { key: 'pushOnNewParticipant' },
          ].map(({ key }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="font-body text-sm text-foreground">{t(`admin.settings.notifications.${key}.label`)}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{t(`admin.settings.notifications.${key}.desc`)}</p>
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
          <h2 className="font-pixel text-[9px] text-[#E85D4A] tracking-wider">{t("admin.settings.dangerZone")}</h2>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-foreground">{t("admin.settings.deleteAccount")}</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{t("admin.settings.deleteAccountDesc")}</p>
          </div>
          <button className="px-4 py-2 border border-[#E85D4A]/40 font-pixel text-[7px] text-[#E85D4A] tracking-wider hover:bg-[#E85D4A]/10 transition-colors">
            {t("admin.settings.deleteBtn")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
