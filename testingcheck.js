const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');
const fs = require('fs').promises;
var firebaseConfig = {
    apiKey: "AIzaSyBmb0TAnTBB3dlzAg5EZmy_pf3tfGikbgE",
    authDomain: "monkeyslist-promoters.firebaseapp.com",
    projectId: "monkeyslist-promoters",
    storageBucket: "monkeyslist-promoters.appspot.com",
    messagingSenderId: "1077736306396",
    appId: "1:1077736306396:web:0331e814abc18fae28e619",
    measurementId: "G-VWXHY3J50F"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp);

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();

async function fetchUsersFromFirebase() {
    const usersCollection = collection(firestoreDb, 'users');
    const querySnapshot = await getDocs(usersCollection);
    const users = [];

    querySnapshot.forEach(doc => {
        users.push(doc.data());
    });

    return users;
}

async function saveUsersToMySQL(users) {
    for (let user of users) {
        // Save user to MySQL
        await prisma.user.create({
            data: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                password: user.password,
                allpostslist: user.allpostslist
            }
        });

        // Write the allpostslist to a JSON file
        try {
            await fs.writeFile(`${user.uid}_allpostslist.json`, JSON.stringify(user.allpostslist, null, 2));
            console.log(`allpostslist for ${user.uid} has been saved to a JSON file.`);
        } catch (error) {
            console.error('Error writing file:', error);
        }
    }
}

app.get('/syncUsers', async (req, res) => {
    try {
        const firebaseUsers = await fetchUsersFromFirebase();
        await saveUsersToMySQL(firebaseUsers);
        res.status(200).send('Users synced successfully');
    } catch (e) {
        console.error('Error syncing users:', e);
        res.status(500).send('Error syncing users');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});