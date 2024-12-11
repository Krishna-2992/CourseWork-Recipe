const express = require('express');
const cors = require('cors'); // Import cors
const { MongoClient, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);
let db;

client.connect().then(() => {
    db = client.db('social_network');
    console.log('Connected to MongoDB');
});

// Register User
app.post('/M0012345/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await db.collection('users').insertOne({ username, password });
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login User
app.post('/M0012345/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.collection('users').findOne({ username, password });
        if (user) res.json({ message: 'Login successful' });
        else res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get All Recipes
app.get('/M0012345/recipes', async (req, res) => {
    try {
        const recipes = await db.collection('recipes').find().toArray();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Add Recipe
app.post('/M0012345/recipes', async (req, res) => {
    const { title, description, ingredients } = req.body;
    try {
        const newRecipe = {
            title,
            description,
            ingredients,
            likes: 0,
            likedBy: [],
            createdAt: new Date(),
        };
        await db.collection('recipes').insertOne(newRecipe);
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add recipe' });
    }
});

// Like a Recipe (Handle One Like Per User)
app.put('/M0012345/recipes/:id/like', async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.body.userId; // Pass the userId in the request
    try {
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(recipeId) });

        if (recipe.likedBy.includes(userId)) {
            return res.status(400).json({ error: 'You can like a recipe only once.' });
        }

        await db.collection('recipes').updateOne(
            { _id: new ObjectId(recipeId) },
            {
                $inc: { likes: 1 },
                $push: { likedBy: userId },
            }
        );
        res.json({ message: 'Recipe liked successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to like recipe.' });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/M0012345`));
