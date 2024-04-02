const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
    try {
        const { botId } = req.body; // Add other fields as per your model
        const newPost = await prisma.post.create({
            data: {
                botId,
            },
        });
        res.json(newPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});




app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
