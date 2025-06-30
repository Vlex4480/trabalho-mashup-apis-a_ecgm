require('dotenv').config();
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

var database;
app.listen(5038,() =>{
    console.log('Server is running on port 5038 ' + process.env.MONGO_URI);
    MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(client => {
            database = client.db(process.env.DATABASE_NAME);
            console.log('Connected to database:',process.env.DATABASE_NAME);
        })
        .catch(error => console.error('Database connection error:', error));
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  const jwt = require('jsonwebtoken');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.post('/api/user/register',async (req, res) => {
    try {
        const { username, password } = req.query;
        
        console.log('Registering user:', req);

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        /* password hash */
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const usersCollection = database.collection('user');
        const existingUser = await usersCollection.findOne({ u_username:username });

        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const newUser = { u_username: username, u_password: hashedPassword };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.post('/api/user/login', async (req, res) => {
    try {
        const { username, password } = req.query;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const usersCollection = database.collection('user');
        const user = await usersCollection.findOne({ u_username: username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const bcrypt = require('bcrypt');
        const isPasswordValid = await bcrypt.compare(password, user.u_password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful',token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/searches', authenticateToken, async (req, res) => {
  const { type, query } = req.body;
  const collection = database.collection('searches');
  await collection.insertOne({
    userId: req.user.userId,
    type,
    query,
    timestamp: new Date()
  });
  res.status(201).json({ message: 'Busca salva' });
});

// Buscar histórico
app.get('/api/searches', authenticateToken, async (req, res) => {
  const collection = database.collection('searches');
  const history = await collection.find({ userId: req.user.userId }).toArray();
  res.json(history);
});