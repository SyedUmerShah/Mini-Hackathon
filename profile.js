import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updateEmail, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, onSnapshot, doc, updateDoc,  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref,uploadBytesResumable,getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
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
const storage = getStorage()

let backbtn = document.getElementById("back-btn")
backbtn.addEventListener("click",()=>{
  window.location="dashboard.html"
event.preventDefault()
})
let pName = document.getElementById("name")
let editNameBtn = document.getElementById("name-btn")


let oldPassErr = document.getElementById("o-p-e")
let newPassErr = document.getElementById("r-p-e")

let oldPassword = document.getElementById("old-pass")
let newPassword = document.getElementById("new-pass")
let repeatPassword = document.getElementById("repeat-pass")
let updateBtn = document.getElementById("update-btn")
let imgSet = document.getElementById('profile-pic')

let file = document.getElementById("file")
let picUpdate = document.getElementById("update-pic-btn")

onAuthStateChanged(auth,(user) => {
  if (user) {
    const uid = user.uid;
    console.log(user);

    function getData() {
            onSnapshot(doc(db, "Users", uid), (doc) => {
              imgSet.src = doc.data().imgurl
              pName.value = doc.data().fullname;
              updateBtn.addEventListener("click", ()=> {
                if(newPassword.value.trim() === "" && repeatPassword.value === "") {}
                else if(oldPassword.value != doc.data().oldpassword) {
                  newPassErr.innerText = "";
                  oldPassErr.innerText = "Enter correct password";
                  
                }
                else if(newPassword.value != repeatPassword.value) {
                  incorrectOldPass.innerText = "";
                  incorrectRepeatPass.innerText = "";
                  incorrectRepeatPass.innerText = "Password is not same";
                }
                else {
                  updatePassword(user, newPassword.value).then(()=> {
                    newPassErr.innerText = "";
                    oldPassErr.innerText = "";
                    console.log("Update successful.");

                    
                    updatePass(uid,newPassword.value);

                  }).catch((error) => {
                   console.log(error.message);
                   if (error.message == "Firebase: Error (auth/requires-recent-login).") {
                    signOut(auth).then(() => {
                      location.pathname = "/index.html";
                    }).catch((error) => {
                    console.log("An error happened.");
                    });
                   }
                  });
                }
              })

              const uploadFile = (file) => {
                return new Promise((reslove, reject) => {
                    const mountainsRef = ref(storage, `images/${file.name}`);
                    const uploadTask = uploadBytesResumable(mountainsRef, file);
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case 'paused':
                                    console.log('Upload is paused');
                                    break;
                                case 'running':
                                    console.log('Upload is running');
                                    break;
                            }
                        },
                        (error) => {
                            reject(error)
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                reslove(downloadURL);
                            });
                        }
                    );
                })
              }


              picUpdate.addEventListener("click", async()=>{
                try {
                  const res = await uploadFile(file.files[0])
                  console.log('URL', res)
                  
                  updateImgUrl(uid,res)
              }
              catch (err) {
                  console.log('err-->', err)
              }
              
              })

            });
          }
          getData();

    editNameBtn.addEventListener("click",async()=>{
      if(pName.readOnly) {
        pName.readOnly = false;
      pName.focus();
      }else if (pName.value.trim() != "") {
        pName.blur();
        pName.readOnly = true
        await updateDoc(doc(db, "Users", uid), {
          fullname: pName.value
        });
      }
    })

  } else {
    console.log("User is signed out");
  }
});
async function updatePass(id,newpassword) {
  await updateDoc(doc(db, "Users", id), {
   oldpassword: newpassword
});
}
async function updateImgUrl(id,url) {
  await updateDoc(doc(db, "Users", id), {
   imgurl: url
});
}



























































