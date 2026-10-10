import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, signOut, onAuthStateChanged, db, doc, getDoc } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shetsathi_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Retrieve ID token for API headers
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('shetsathi_token', idToken);

          // Fetch user profile from Firestore if available
          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const fsData = userDoc.data();
              const profile = {
                id: fbUser.uid,
                name: fsData.name || fbUser.displayName || fbUser.phoneNumber || 'शेतकरी मित्र',
                phone: fsData.phone || fbUser.phoneNumber || '',
                email: fsData.email || fbUser.email || '',
                location: fsData.location || 'Maharashtra',
                preferred_language: fsData.preferred_language || 'mr',
                preferred_crops: fsData.preferred_crops || 'Onion, Sugarcane'
              };
              setUser(profile);
              localStorage.setItem('shetsathi_user', JSON.stringify(profile));
            } else {
              const fallbackProfile = {
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.phoneNumber || 'शेतकरी मित्र',
                phone: fbUser.phoneNumber || '',
                email: fbUser.email || '',
                location: 'Maharashtra',
                preferred_language: 'mr',
                preferred_crops: 'Onion, Sugarcane'
              };
              setUser(fallbackProfile);
              localStorage.setItem('shetsathi_user', JSON.stringify(fallbackProfile));
            }
          } catch (e) {
            console.warn("Firestore doc fetch fallback:", e);
          }
        } catch (err) {
          console.error("Firebase ID token error:", err);
        }
      } else {
        // Fallback to local token / backend session if Firebase Auth is not active
        const savedToken = localStorage.getItem('shetsathi_token');
        const savedUser = localStorage.getItem('shetsathi_user');
        if (savedToken && savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
          } catch (e) {
            setUser(null);
            setToken(null);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = (tokenStr, userData) => {
    setToken(tokenStr);
    setUser(userData);
    localStorage.setItem('shetsathi_token', tokenStr);
    localStorage.setItem('shetsathi_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut warning:", e);
    }
    setToken(null);
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('shetsathi_token');
    localStorage.removeItem('shetsathi_user');
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    localStorage.setItem('shetsathi_user', JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, token, loading, loginUser, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
