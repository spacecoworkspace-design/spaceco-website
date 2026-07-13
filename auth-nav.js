// Shared across every public page: shows "Sign In" in the nav for
// anonymous visitors, or "My Dashboard" for a logged-in client. Loaded
// on every page via <script src="auth-nav.js">. Does nothing else —
// doesn't touch any page content, only the two nav elements marked
// data-auth="guest" / data-auth="member".
(function () {
  var SUPABASE_URL = 'https://vfevpvfaeiwltixgdmln.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmZXZwdmZhZWl3bHRpeGdkbWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1Nzk1OTksImV4cCI6MjA5MzE1NTU5OX0.6cdMfW5rfVD_vA7nI-K6OjLKQrnsTJZflT7QXG4uyF4';

  // A single, shared Supabase client for the whole page. Pages that need
  // their own Supabase calls (account.html, dashboard.html) should use
  // window.getSpacecoClient() instead of creating a second client —
  // two clients on the same storage key causes Supabase's "Multiple
  // GoTrueClient instances" warning and can genuinely hang the tab.
  window.getSpacecoClient = function () {
    if (!window.__spacecoSb) {
      window.__spacecoSb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window.__spacecoSb;
  };

  function setNavState(isLoggedIn) {
    document.querySelectorAll('[data-auth="guest"]').forEach(function (el) {
      el.style.display = isLoggedIn ? 'none' : '';
    });
    document.querySelectorAll('[data-auth="member"]').forEach(function (el) {
      el.style.display = isLoggedIn ? '' : 'none';
    });
  }

  async function checkSession() {
    try {
      var sb = window.getSpacecoClient();
      var { data } = await sb.auth.getSession();
      setNavState(!!data.session);
    } catch (e) {
      console.warn('auth-nav: session check failed', e);
    }
  }

  if (window.supabase) {
    checkSession();
  } else {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload = checkSession;
    document.head.appendChild(s);
  }
})();
