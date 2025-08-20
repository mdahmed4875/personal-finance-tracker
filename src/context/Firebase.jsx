import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { doc, getDoc, setDoc, getFirestore,updateDoc,arrayUnion } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_uBQd6yxxxvo96h7N8CQFrC_3mLZ9sqA",
  authDomain: "financly-86fb7.firebaseapp.com",
  projectId: "financly-86fb7",
  storageBucket: "financly-86fb7.firebasestorage.app",
  messagingSenderId: "788458731339",
  appId: "1:788458731339:web:0e560bd350658ca994dace"
};

//  Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//  Create Context
const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

//  Authentication object
const firebaseAuth = getAuth(firebaseApp);
//  Firestore database object
const firestoreDB = getFirestore(firebaseApp);

//  Google provider
const googleProvider = new GoogleAuthProvider();

//  Provider component
export const FirebaseProvider = (props) => {
  const [user,setUser]=useState(null);
  useEffect(()=>{
     const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); 
  },[])
  const saveUserToDB = async (user) => {
    try {
      const userRef = doc(firestoreDB, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          uid: user.uid,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error saving user to DB:", error.message);
      throw error; // rethrow so calling function can handle it
    }
  };
  //saving income transaction
  const addIncome=async(userId, incomeData) => {
    try {
      if(!userId)throw new Error("User ID is required");
      if(!incomeData || !incomeData.amount) {
        throw new Error("Income data must include amount and source");
      }
      const userRef=doc(firestoreDB, "users", userId);
      await updateDoc(userRef, {
        incomes: arrayUnion({
          id:Date.now().toString(),
          ...incomeData,
          date: new Date().toISOString(),
        }),
      });
      console.log("Income added successfully");
      return { success: true, error: null };
    } catch (error) {
      console.error("Error adding income:", error.message);
      return { success: false, error: error.message };
    }
  };
  //saving expense transaction
  const addExpense = async (userId, expenseData) => {
    try {
      if (!userId) throw new Error("User ID is required");
      if (!expenseData || !expenseData.amount) {
        throw new Error("Expense data must include amount and category");
      }
      const userRef = doc(firestoreDB, "users", userId);
      await updateDoc(userRef, {
        expenses: arrayUnion({
          id: Date.now().toString(),
          ...expenseData,
          date: new Date().toISOString(),
        }),
      });
      console.log("Expense added successfully");
      return { success: true, error: null };
    } catch (error) {
      console.error("Error adding expense:", error.message);
      return { success: false, error: error.message };
    }
  };

  //  Signup with email & password
  const signup = async (email, password) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await saveUserToDB(userCredentials.user);
      return { user: userCredentials.user, error: null };
    } catch (error) {
      console.error("Signup error:", error.message);
      return { user: null, error: error.message };
    }
  };

  //  Login with email & password
  const login = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      return { user: userCredentials.user, error: null };
    } catch (error) {
      console.error("Login error:", error.message);
      return { user: null, error: error.message };
    }
  };

  //  Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      await saveUserToDB(result.user);
      return { user: result.user, error: null };
    } catch (error) {
      console.error("Google login error:", error.message);
      return { user: null, error: error.message };
    }
  };

  //  Logout
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      return { success: true, error: null };
    } catch (error) {
      console.error("Logout error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signup,
        login,
        loginWithGoogle,
        logout,
        addIncome,
        addExpense,
        firebaseAuth,
        firestoreDB,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
