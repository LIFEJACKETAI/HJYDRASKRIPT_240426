import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { debugOAuthConfig } from '../lib/googleAuth';

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Debug info
        const debug = debugOAuthConfig();
        setDebugInfo(debug);
        console.log('Processing auth callback...', debug);

        // Check for error in URL (Google OAuth error)
        const params = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(location.hash.replace('#', ''));
        
        const error = params.get('error') || hashParams.get('error');
        const errorDescription = params.get('error_description') || hashParams.get('error_description');
        
        if (error) {
          console.error('OAuth error from provider:', error, errorDescription);
          setStatus('error');
          setErrorMessage(`${error}: ${errorDescription || 'Unknown error'}`);
          return;
        }

        // Check for auth code (PKCE flow)
        const code = params.get('code');
        if (code) {
          console.log('Auth code found, exchanging for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Code exchange failed:', exchangeError);
            setStatus('error');
            setErrorMessage(`Authentication failed: ${exchangeError.message}`);
            return;
          }

          if (data.user) {
            console.log('Successfully authenticated via code exchange:', data.user.email);
            setUser(data.user);
            setStatus('success');
            
            // Redirect after a brief delay to show success
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
            return;
          }
        }

        // Check for access_token in hash (implicit flow)
        const accessToken = hashParams.get('access_token');
        if (accessToken) {
          console.log('Access token found in hash');
          
          // Supabase should have automatically set the session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            setStatus('error');
            setErrorMessage(`Session error: ${sessionError.message}`);
            return;
          }

          if (session?.user) {
            console.log('Successfully authenticated:', session.user.email);
            setUser(session.user);
            setStatus('success');
            
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
            return;
          }
        }

        // If we get here, check for existing session anyway
        console.log('No tokens in URL, checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.email);
          setUser(session.user);
          setStatus('success');
          
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
          return;
        }

        // No session found
        setStatus('error');
        setErrorMessage('No authentication data found. Please try signing in again.');
        
      } catch (err: any) {
        console.error('Unexpected error during auth callback:', err);
        setStatus('error');
        setErrorMessage(`Unexpected error: ${err.message || 'Unknown error'}`);
      }
    };

    processAuthCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md text-center"
      >
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10 shadow-2xl">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full animate-pulse" />
                <div className="absolute inset-1 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Completing Sign In</h2>
              <p className="text-gray-400">Please wait while we authenticate you...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-green-400">Success!</h2>
              <p className="text-gray-400">You&apos;re signed in. Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-red-400">Sign In Failed</h2>
              <p className="text-gray-400 mb-4">{errorMessage}</p>
              
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                <p className="text-sm text-red-300 mb-2">
                  <strong>Common fixes:</strong>
                </p>
                <ul className="text-sm text-gray-400 text-left space-y-1 list-disc list-inside">
                  <li>Make sure the redirect URI in Google Cloud Console matches exactly</li>
                  <li>Check that your Supabase site URL is configured correctly</li>
                  <li>Try signing in again</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Sign In
              </button>

              {debugInfo && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                    Debug Information
                  </summary>
                  <pre className="mt-2 p-3 bg-black/50 rounded text-xs text-gray-500 overflow-x-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}