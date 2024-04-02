const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
const express = require('express');

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBmb0TAnTBB3dlzAg5EZmy_pf3tfGikbgE",
    authDomain: "monkeyslist-promoters.firebaseapp.com",
    projectId: "monkeyslist-promoters",
    storageBucket: "monkeyslist-promoters.appspot.com",
    messagingSenderId: "1077736306396",
    appId: "1:1077736306396:web:0331e814abc18fae28e619",
    measurementId: "G-VWXHY3J50F"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const app = express();
class CurrentUser {
    constructor({ uid, email, displayName, password, allpostslist }) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.password = password;
        this.allpostslist = allpostslist;
    }

    // Method to create a new instance with some properties changed
    copyWith({ uid, email, displayName, password, allpostslist }) {
        return new CurrentUser({
            uid: uid ?? this.uid,
            email: email ?? this.email,
            displayName: displayName ?? this.displayName,
            password: password ?? this.password,
            allpostslist: allpostslist ?? this.allpostslist
        });
    }
}
app.get('/getAllUsers', async (req, res) => {
    try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const users = [];

        querySnapshot.forEach(doc => {
            try {
                // Replace CurrentUser with your user mapping logic
                const user = new CurrentUser(doc.data());
                users.push(user);
            } catch (e) {
                console.error('Error mapping document to CurrentUser:', e);
            }
        });

        res.status(200).json(users);
    } catch (e) {
        console.error('Error getting users from Firestore:', e);
        res.status(500).send('Error fetching users');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
