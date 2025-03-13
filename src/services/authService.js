// Configure your Google OAuth details
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // You'll need to get this from Google Developer Console

export const configureGoogleAuth = () => {
  // Load the Google API script
  const loadGoogleScript = () => {
    // Load the Google API script if it's not already loaded
    if (!window.gapi) {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/platform.js";
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  };

  // Initialize Google Sign-In
  const initializeGoogleSignIn = () => {
    window.gapi.load("auth2", () => {
      window.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
      });
    });
  };

  loadGoogleScript();
};

export const signInWithGoogle = async () => {
  try {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    
    // Get user profile information
    const profile = googleUser.getBasicProfile();
    const token = googleUser.getAuthResponse().id_token;
    
    const userData = {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
      token
    };
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const auth2 = window.gapi.auth2.getAuthInstance();
    await auth2.signOut();
    localStorage.removeItem('user');
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};