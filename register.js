// Import Firebase SDK functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  fetchSignInMethodsForEmail,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZXZop4nK4xk-VltfoYp-kRhsCHZ4IcYA",
  authDomain: "loginexample-5ae09.firebaseapp.com",
  projectId: "loginexample-5ae09",
  storageBucket: "loginexample-5ae09.firebasestorage.app",
  messagingSenderId: "484592425419",
  appId: "1:484592425419:web:5a1be64b4b778f2e51fe4e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// -------------------- USER LOGIN --------------------
document.querySelector("#login-submit").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.querySelector("#login-email").value;
  const password = document.querySelector("#login-password").value;

  setPersistence(auth, browserLocalPersistence)
    .then(() => signInWithEmailAndPassword(auth, email, password))
    .then(() => {
      alert("User logged in successfully!");
      window.location.href = "quizselection.html"; // Redirect to user dashboard
    })
    .catch((error) => {
      console.error("User Login Error:", error.message);
      alert("Error: " + error.message);
    });
});

// -------------------- USER REGISTER --------------------
document.querySelector("#register-submit").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.querySelector("#register-email").value;
  const password = document.querySelector("#register-password").value;

  fetchSignInMethodsForEmail(auth, email)
    .then((methods) => {
      if (methods.length > 0) {
        alert("Email already in use. Please log in instead.");
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            alert("Account created successfully!");
            window.location.href = "register.html"; // Redirect after registration
          })
          .catch((error) => {
            console.error("User Registration Error:", error.message);
            alert("Error: " + error.message);
          });
      }
    })
    .catch((error) => {
      console.error("Error Checking Email:", error.message);
      alert("Error: " + error.message);
    });
});

// -------------------- ADMIN REGISTER --------------------
document.querySelector("#admin-register-submit").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.querySelector("#admin-register-email").value;
  const password = document.querySelector("#admin-register-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save admin details in Firestore with role
      return setDoc(doc(db, "users", user.uid), { email: email, role: "admin" });
    })
    .then(() => {
      alert("Admin account created successfully!");
      window.location.href = "register.html"; // Redirect to login
    })
    .catch((error) => {
      console.error("Admin Registration Error:", error.message);
      alert("Error: " + error.message);
    });
});

// -------------------- ADMIN LOGIN --------------------
document.querySelector("#admin-login-submit").addEventListener("click", (event) => {
  event.preventDefault();

  const email = document.querySelector("#admin-login-email").value;
  const password = document.querySelector("#admin-login-password").value;

  setPersistence(auth, browserLocalPersistence) // Enable persistent login
    .then(() => signInWithEmailAndPassword(auth, email, password))
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Verify admin role
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists() && docSnap.data().role === "admin") {
        alert("Admin login successful!");
        window.location.href = "createquiz.html"; // Redirect to create quiz
      } else {
        alert("Unauthorized access. This account is not an admin.");
        auth.signOut(); // Logout unauthorized user
      }
    })
    .catch((error) => {
      console.error("Admin Login Error:", error.message);
      alert("Error: " + error.message);
    });
});
