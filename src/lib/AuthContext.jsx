import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [hasBusinessAccount, setHasBusinessAccount] = useState(false);
  const [hasBusinessRecord, setHasBusinessRecord] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await handleSessionUser(session.user);
        } else {
          clearAuth();
        }
        setIsLoadingAuth(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setProfile(null);
    setHasBusinessAccount(false);
    setHasBusinessRecord(false);
    setIsAuthenticated(false);
  };

  const handleSessionUser = async (sessionUser) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      const isSysAdmin = profileData?.role === 'admin' || profileData?.is_admin === true;

      // Check if user has a registered business
      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', sessionUser.id)
        .maybeSingle();

      const userHasBusiness = profileData?.role === 'business' || !!businessData;

      if (error || !profileData || (!userHasBusiness && !isSysAdmin)) {
        // Not a business or no profile -> sign out
        await supabase.auth.signOut();
        clearAuth();
        setAuthError('ACCESS_DENIED_NOT_BUSINESS');
      } else {
        setUser(sessionUser);
        setProfile(profileData);
        setHasBusinessAccount(userHasBusiness);
        setHasBusinessRecord(!!businessData);
        setIsAuthenticated(true);
        setAuthError(null);
      }
    } catch (err) {
      console.error('Session user handling failed:', err);
      clearAuth();
    }
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleSessionUser(session.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const fetchProfile = async (userId) => {
    // Left for backwards compatibility if needed elsewhere
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error) setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (email, password) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Fetch profile to check role
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // Profile doesn't exist — sign out and throw
        await supabase.auth.signOut();
        throw new Error('Profile not found. Contact support.');
      }

      const { data: businessData } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', data.user.id)
        .maybeSingle();

      const isSysAdmin = profileData?.role === 'admin' || profileData?.is_admin === true;
      const userHasBusiness = profileData?.role === 'business' || !!businessData;

      if (!userHasBusiness && !isSysAdmin) {
        // Not a business or admin account — sign out and throw
        await supabase.auth.signOut();
        throw new Error('ACCESS_DENIED_NOT_BUSINESS');
      }

      setProfile(profileData);
      setHasBusinessAccount(userHasBusiness);
      setHasBusinessRecord(!!businessData);
      return { ...data, profile: profileData };
    }

    return { ...data, profile: null };
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setHasBusinessAccount(false);
    setHasBusinessRecord(false);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const isSysAdmin = profile?.role === 'admin' || profile?.is_admin === true;
  const isBusiness = hasBusinessAccount;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated,
      isLoadingAuth,
      authError,
      isBusiness,
      isSysAdmin,
      hasBusinessRecord,
      login,
      loginWithGoogle,
      logout,
      fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
