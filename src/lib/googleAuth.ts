import { supabase } from './supabase';

/**
 * Sign in with Google OAuth
 * Uses Supabase Auth with Google provider
 */
export async function signInWithGoogle() {
  try {
    // Get the current origin for the redirect
    const redirectTo = `${window.location.origin}/auth/callback`;
    
    console.log('Initiating Google OAuth with redirect:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error('Google OAuth error:', error.message);
      throw error;
    }

    if (!data.url) {
      throw new Error('No OAuth URL returned from Supabase');
    }

    console.log('OAuth URL generated:', data.url);
    return data;
  } catch (err: any) {
    console.error('Failed to initiate Google OAuth:', err);
    throw new Error(err.message || 'Failed to start Google sign-in');
  }
}

/**
 * Sign in with GitHub OAuth
 */
export async function signInWithGithub() {
  try {
    const redirectTo = `${window.location.origin}/auth/callback`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectTo,
      },
    });

    if (error) {
      console.error('GitHub OAuth error:', error.message);
      throw error;
    }

    return data;
  } catch (err: any) {
    console.error('Failed to initiate GitHub OAuth:', err);
    throw new Error(err.message || 'Failed to start GitHub sign-in');
  }
}

/**
 * Handle OAuth callback
 * This processes the session after redirect from OAuth provider
 */
export async function handleAuthCallback() {
  try {
    // Supabase automatically handles the URL hash for OAuth callbacks
    // We just need to get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth callback error:', error.message);
      throw error;
    }

    if (session?.user) {
      console.log('Successfully authenticated:', session.user.email);
      return session.user;
    }

    return null;
  } catch (err) {
    console.error('Failed to handle auth callback:', err);
    return null;
  }
}

/**
 * Exchange auth code for session (PKCE flow)
 * Used when code is returned in URL instead of hash
 */
export async function exchangeCodeForSession(code: string) {
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Code exchange error:', error.message);
      throw error;
    }

    return data.user;
  } catch (err) {
    console.error('Failed to exchange code:', err);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error.message);
      return null;
    }

    return user;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

/**
 * Debug OAuth configuration
 * Logs helpful information for troubleshooting
 */
export function debugOAuthConfig() {
  const config = {
    origin: window.location.origin,
    callbackUrl: `${window.location.origin}/auth/callback`,
    currentUrl: window.location.href,
    hasHash: !!window.location.hash,
    hasCode: new URLSearchParams(window.location.search).has('code'),
  };
  
  console.log('OAuth Debug Info:', config);
  return config;
}