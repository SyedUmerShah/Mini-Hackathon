import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
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

const db = getFirestore(app);

let fullName = document.getElementById("fullname");
let phone = document.getElementById("phone");
let email = document.getElementById("email");
let password = document.getElementById("password");
let oldPassword;
let fullnameError = document.getElementById("fullname-error");
let phoneError = document.getElementById("phone-error");
let emailError = document.getElementById("email-error");
let passwordError = document.getElementById("password-error");
let signupBtn = document.getElementById("signup-btn");

signupBtn.addEventListener("click", async () => {
  if (fullName.value.trim() === "") {
    phoneError.innerText = "";
    fullnameError.innerText = "What's your name?";
  }
  else if (phone.value.trim() === "") {
    fullnameError.innerText = "";
    phoneError.innerText = "Enter your phone number";
  }
  else {
    fullnameError.innerText = "";
    phoneError.innerText = "";
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        emailError.innerText = "";
        passwordError.innerText = "";
        const user = userCredential.user;
        oldPassword=password.value
        console.log("Signed in =>", user);
        await setDoc(doc(db, "Users", user.uid), {
          fullname: fullName.value,
          phone: phone.value, 
          oldpassword: oldPassword
        });
      })
      .catch((error) => {
        console.log(error.message)
        if (error.message == "Firebase: Error (auth/invalid-email).") {
          passwordError.innerText = "";
          emailError.innerText = "invalid-email";
        } else if (error.message == "Firebase: Error (auth/missing-email).") {
          passwordError.innerText = ""
          emailError.innerText = "Enter your email"
        }
        else if (error.message == "Firebase: Error (auth/missing-password).") {
          emailError.innerText = "";
          passwordError.innerText = "Enter your password";
        }
        else if(error.message == "Firebase: Error (auth/email-already-in-use).") {
          passwordError.innerText = "";
          emailError.innerText = "This email is already in use";
        }
      });
  }
})