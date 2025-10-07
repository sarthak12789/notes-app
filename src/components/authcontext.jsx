import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseclient";

const Authcontext = createContext();

export const Authcontextprovider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  //  Signup *******
  const signupnewuser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  //  Signin *******
  const signinuser = async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Signin error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error during signin:", err);
      return { success: false, error: err.message };
    }
  };

  // Get session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  //  Sign out
  const signout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Signout error:", error.message);
    }
  };

  return (
    <Authcontext.Provider
      value={{ session, signupnewuser, signinuser, signout }}
    >
      {children}
    </Authcontext.Provider>
  );
};

export const userAuth = () => {
  return useContext(Authcontext);
};
