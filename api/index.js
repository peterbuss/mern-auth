import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';  // because this is backend need to add .js;
import authRoutes from './routes/auth.route.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.log(err);
});

const app = express();

// have to allow our app to use json - from Insomnia for testing
app.use(express.json());

app.listen(3000, () => {
    console.log('Server listening on port 3000');
    
});

// Create test API r
// Path: api/index.js
/* 
app.get('/', (req, res) => {
    res.json({
        message: 'API is working',
    });
});
 */

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);



