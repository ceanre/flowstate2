/* global firebase */

const firebaseConfig = {
  apiKey: "AIzaSyCIw9iypfuHmqGz1CE-RwG9ZmJz7PauEqY",
  authDomain: "flowstate-uk.firebaseapp.com",
  projectId: "flowstate-uk",
  storageBucket: "flowstate-uk.firebasestorage.app",
  messagingSenderId: "296867354772",
  appId: "1:296867354772:web:0b8b0b0435518b74493c81",
  measurementId: "G-E74CRMP2D1",
};

const adminEmail = "prod.ceanre@gmail.com";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(firebaseApp);
const auth = firebase.auth();
const db = firebase.firestore();

const loginButton = document.getElementById("login-button");
const createProfileButton = document.getElementById("create-profile-button");

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

loginButton?.addEventListener("click", async () => {
  await auth.signInWithPopup(provider);
});

createProfileButton?.addEventListener("click", async () => {
  const username = window.prompt("Choose your @username (min 3 chars)");
  if (!username || username.length < 3) {
    return;
  }

  const clean = username.startsWith("@") ? username : `@${username}`;
  const currentUser = auth.currentUser;
  if (!currentUser) {
    window.alert("Sign in first.");
    return;
  }

  await db.collection("users").doc(currentUser.uid).set(
    {
      username: clean,
      displayName: currentUser.displayName,
      photoBase64: currentUser.photoURL,
      verified: currentUser.email === adminEmail,
      lastUsernameChange: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
});

// Example collections for the platform
const collections = {
  articles: db.collection("articles"),
  comments: db.collection("comments"),
  polls: db.collection("polls"),
  followers: db.collection("followers"),
  notifications: db.collection("notifications"),
  analytics: db.collection("analytics"),
};

window.flowstate = {
  auth,
  db,
  collections,
  analytics,
};
