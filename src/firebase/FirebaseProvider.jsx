// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  Timestamp,
  getDocs,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBjh5AxnAZkXGTeut9FiY2R7Aj3bX-s5wU",
  authDomain: "invoice-management-app-674cc.firebaseapp.com",
  projectId: "invoice-management-app-674cc",
  storageBucket: "invoice-management-app-674cc.appspot.com",
  messagingSenderId: "934956012149",
  appId: "1:934956012149:web:63415f9b2c5d1b08311e3c",
  measurementId: "G-40SXWWEGMS",
};

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore(app);

const FirebaseProvider = ({ children }) => {
  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error(
          "Email is already in use, Please register with another email"
        );
      }
      throw error; // Throw other errors to be caught in the handleSubmit function
    }
  };

  const signinUserWithEmailAndPassword = (email, password) => {
    try {
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        throw new Error("Wrong Password");
      }
      if (error.code === "auth/user-not-found") {
        throw new Error("User not found");
      }
      throw error; // Throw other errors to be caught in the handleSubmit function
    }
  };
  const uploadImage = async (filename, file) => {
    const storageRef = ref(storage, `${filename}-${Date.now()}`);
    await uploadBytesResumable(storageRef, file);

    const downloadedURL = await getDownloadURL(storageRef);

    return downloadedURL;
  };

  const updateUserProfile = (newUser, displayName, photoURL) => {
    updateProfile(newUser.user, {
      displayName: displayName,
      photoURL: photoURL,
    });
  };

  const setUserData = async (newUser, displayName, email, photoURL) => {
    return await setDoc(doc(db, "users", newUser.user.uid), {
      uid: newUser.user.uid,
      displayName: displayName,
      email: email,
      photoURL: photoURL,
    });
  };

  const addNewInvoice = async (to, phone, address, products, total, uid) => {
    await addDoc(collection(db, "invoices"), {
      to: to,
      phone: phone,
      address: address,
      products: products,
      total: total,
      date: Timestamp.fromDate(new Date()),
      uid: uid,
    });
  };

  const getAllInvoices = async (uid) => {
    const q = query(collection(db, "invoices"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot;
  };

  const deleteInvoice = async (id) => {
    return await deleteDoc(doc(db, "invoices", id));
  };

  const logoutUser = async () => {
    return await signOut(auth);
  };
  return (
    <FirebaseContext.Provider
      value={{
        app,
        auth,
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        logoutUser,
        uploadImage,
        updateUserProfile,
        setUserData,
        addNewInvoice,
        getAllInvoices,
        deleteInvoice,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
