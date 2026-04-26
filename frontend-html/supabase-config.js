(function () {
  // Put your real anon key below.
  // The project URL is already set from your Supabase project ref.
  const url = 'https://ccqgjofhhfnfdrujskgx.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcWdqb2ZoaGZuZmRydWpza2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTc1MzQsImV4cCI6MjA3Njk3MzUzNH0.i2fEcPH8-GrPLxLjt3u2bDlAYAKqntdBNak60oKLObc';

  // Expose every common variable name used by your pages/scripts.
  window.SUPABASE_URL = url;
  window.supabaseUrl = url;
  window.__SUPABASE_URL__ = url;

  window.SUPABASE_ANON_KEY = anonKey;
  window.supabaseAnonKey = anonKey;
  window.supabaseKey = anonKey;
  window.__SUPABASE_ANON_KEY__ = anonKey;

  window.SUPABASE_CONFIG = {
    url,
    anonKey,
  };

  // Auto-create the client when the Supabase CDN script is already loaded.
  const looksFilled =
    typeof anonKey === 'string' &&
    anonKey.trim() &&
    !/PASTE_YOUR_SUPABASE_ANON_KEY_HERE|YOUR_SUPABASE_ANON_KEY/i.test(anonKey);

  if (
    looksFilled &&
    window.supabase &&
    typeof window.supabase.createClient === 'function' &&
    !window.supabaseClient
  ) {
    window.supabaseClient = window.supabase.createClient(url, anonKey);
  }
})();