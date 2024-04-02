const express = require('express');
const cors = require('cors'); // Import cors module
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors()); 

// Endpoint to create a new post
app.post('/posts', cors(), async (req, res) => {
    try {
        const { botId, platformName, raidLink, url, content, tag, uploadedIMGURL } = req.body;
        const newPost = await prisma.post.create({
            data: {
                botId,
                platformName,
                raidLink,
                url,
                content,
                tag,
                uploadedIMGURL
            },
        });
        res.json(newPost);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Endpoint to get all posts
app.get('/getallposts', cors(), async (req, res) => {
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
