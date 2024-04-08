const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');

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

// user registeration
app.post('/register', async (req, res) => {
  const { email, displayName, password } = req.body;
  // Validate email
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  // Set up password validation schema
  const schema = new passwordValidator();
  schema
    .is().min(8)                                    // Minimum length 8
    .has().uppercase()                              // Must have uppercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols();                               // Must have at least one symbol
  // Validate password
  if (!schema.validate(password)) {
    return res.status(400).json({ error: 'Password does not meet the criteria' });
  }
  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        displayName,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  
  // Login user
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Validate email
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
  
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      // If user not found or password doesn't match, return error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // If login successful, return success message or token
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
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
