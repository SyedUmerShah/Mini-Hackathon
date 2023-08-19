import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyAfU9kk1Ouzj7nEeQGuIRWAZDRly6kWlm0",
  authDomain: "hackathon-0001.firebaseapp.com",
  projectId: "hackathon-0001",
  storageBucket: "hackathon-0001.appspot.com",
  messagingSenderId: "922430114972",
  appId: "1:922430114972:web:a15224e130b05272a5f159"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let email = document.getElementById("email");
let password = document.getElementById("password");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");
let loginBtn = document.getElementById("login-btn");


onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user)
    window.location.replace("dashboard.html")
  } else {
    loginBtn.addEventListener("click", () => {
      if (email.value.trim() === "") {
        passwordError.innerText = "";
        emailError.innerText = "Please enter your email";
      }
      else if (password.value.trim() === "") {
        emailError.innerText = ""
        passwordError.innerText = "Please enter your password";
      }
      else {
        emailError.innerText = "";
        passwordError.innerText = "";
        signInWithEmailAndPassword(auth, email.value, password.value)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            if (error.message == "Firebase: Error (auth/invalid-email).") {
              emailError.innerText = "Invalid email";
            }
            else if (error.message == "Firebase: Error (auth/wrong-password).") {
              passwordError.innerText = "Wrong password";
            }
            else if (error.message == "Firebase: Error (auth/user-not-found).") {
              passwordError.innerText = "Invalid email or password";
            }
          });
      }
    })
  }
});

// function logout() {
//   signOut(auth).then(() => {
//     console.log("Sign-out successful.")
//   }).catch((error) => {
//     // An error happened.
//   });
//   }
//   logout();