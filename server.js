const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

// Endpoint to create a new post
app.post('/posts', async (req, res) => {
    try {
        const { botId, platformName, currentDate, raidLink, url, content, tag, uploadedIMGURL } = req.body; // Add other fields as per your model
        const newPost = await prisma.post.create({
            data: {
                botId,
                platformName,
                currentDate,
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

// return all data from db 
app.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get data by botID
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

// bulk data insert into DB
app.post('/manyposts', async (req, res) => {
    try {
        const postData = req.body;

        if (!postData) {
            // If no data is provided in the request body, respond with status 400
            return res.status(400).json({ error: "No data provided" });
        }

        let newPosts;

        if (Array.isArray(postData)) {
            // If postData is an array, process each item
            const postsData = postData.map(post => ({
                botId: post.botId,
                platformName: post.platformName,
                currentDate: post.currentDate,
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
            const { botId, platformName, currentDate, raidLink, url, content, tag, uploadedIMGURL } = postData;
            newPosts = await prisma.post.create({
                data: { botId, platformName, currentDate, raidLink, url, content, tag, uploadedIMGURL },
            });
        }

        // Respond with status 200 and the created posts
        res.status(200).json(newPosts);
        console.log("newpost" , newPosts);
    } catch (error) {
        // Log internal server error to console
        console.error("Internal Server Error:", error);
    
        // Respond with status 500 and an error message
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// const port = process.env.PORT || 8080;

// app.listen(port, '0.0.0.0', () => {
//     console.log(`App listening at http://localhost:${port}`)
// });
