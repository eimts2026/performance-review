const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: process.env.VITE_FIRESTORE_API_KEY,
    authDomain: process.env.VITE_FIRESTORE_AUTH_TOKEN,
    projectId: process.env.VITE_FIRESTORE_PROJECT_ID,
    storageBucket: process.env.VITE_FIRESTORE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIRESTORE_MESSAGING_SENDERID,
    appId: process.env.VITE_FIRESTORE_APPID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);