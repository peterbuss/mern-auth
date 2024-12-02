import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';  // because this is backend need to add .js;
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';
//import cors from 'cors';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();  // will find dynamic dir name

const app = express();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,  'client', 'dist', 'index.html'));
});

// have to allow our app to use json - from Insomnia for testing
app.use(express.json());

app.use(cookieParser());

// cors middleware
/* 
const corsOptions = { 
    // origin:'https://abc.onrender.com',
    AccessControlAllowOrigin: '*',  
    origin: '*',  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
};
app.use(cors(corsOptions));
 */
//app.use(cors({ credentials: true }));

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

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;  // use 500 if no code (internal server error)
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

