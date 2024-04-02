const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
    try {
        const { botId,
            platformName,
            raidLink ,
            url ,
            content ,
            tag ,
            uploadedIMGURL } = req.body; // Add other fields as per your model
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

app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.get('/posts/by-bot/:botId', async (req, res) => {
    try {
        const botId = parseInt(req.params.botId);
        if (isNaN(botId)) {
            return res.status(400).send('Bot ID must be a number');
        }

        const posts = await prisma.post.findMany({
            where: {
                botId: botId
            }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.post('/manyposts', async (req, res) => {
    try {
        const postData = req.body;
        let newPosts;

        if (Array.isArray(postData)) {
            // If postData is an array, process each item
            const postsData = postData.map(post => ({
                botId: post.botId,
                platformName: post.platformName,
                raidLink: post.raidLink,
                url: post.url,
                content: post.content,
                tag: post.tag,
                uploadedIMGURL: post.uploadedIMGURL,
            }));

            newPosts = await prisma.$transaction(
                postsData.map(postData => prisma.post.create({ data: postData }))
            );
        } else {
            // If postData is a single object, process it directly
            const { botId, platformName, raidLink, url, content, tag, uploadedIMGURL } = postData;
            newPosts = await prisma.post.create({
                data: { botId, platformName, raidLink, url, content, tag, uploadedIMGURL },
            });
        }

        res.json(newPosts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
