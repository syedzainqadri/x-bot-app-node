const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

async function createUser(uid, email, displayName, password, allpostslist) {
    const newUser = await prisma.user.createUser({
        data: {
            uid,
            email,
            displayName,
            password,
            allpostslist,
        },
    });
    return newUser;
}

app.post('/create-user', async (req, res) => {
    try {
        const { uid, email, displayName, password, allpostslist } = req.body;
        const newUser = await createUser(uid, email, displayName, password, allpostslist);
        res.json({ user: newUser });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
