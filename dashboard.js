import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, onSnapshot, addDoc, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAfU9kk1Ouzj7nEeQGuIRWAZDRly6kWlm0",
    authDomain: "hackathon-0001.firebaseapp.com",
    projectId: "hackathon-0001",
    storageBucket: "hackathon-0001.appspot.com",
    messagingSenderId: "922430114972",
    appId: "1:922430114972:web:a15224e130b05272a5f159"
};



let publishBtn = document.getElementById("post-btn")
let blogHeading = document.getElementById("post-heading")
let blog = document.getElementById("post-text")
let blogContainer = document.getElementById("blogs");



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let profBtn = document.getElementById("profile-btn")


onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        function getData() {
            onSnapshot(doc(db, "Users", uid), (doc) => {
                let imgUrl = doc.data().imgurl;
                onSnapshot(collection(db, uid), (data) => {
                    data.forEach((doc) => {
                        console.log(doc.data());
                        blogContainer.innerHTML += `
                 <div class="blogs-head">
                    <img src="${imgUrl}" alt="">
                    <h4>${doc.data().blogheading}</h4>
                </div>
                <div class="blogs-body">
                    <p>${doc.data().blog}</p>
                </div> 
                `
                    });
                })
            })
        }
        getData();

        publishBtn.addEventListener("click", async () => {
            if (blogHeading.value.trim() != "" && blog.value != "") {
                try {
                    const docRef = await addDoc(collection(db, uid), {
                        blogheading: blogHeading.value,
                        blog: blog.value
                    });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        })
    } else {
        console.log("User signed out")
    }
});
profBtn.addEventListener("click", () => {
    console.log("HELLO")
    location.pathname = "/profile.html"
    event.preventDefault()
})

let logout = document.getElementById("logout")
logout.addEventListener("click",()=>{
    event.preventDefault()
  signOut(auth).then(() => {
    console.log("Sign-out successful.")
    window.location.replace("index.html")


  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
  }
)
