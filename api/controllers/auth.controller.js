import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    console.log(req.body);
    const { userName, email, password } =  req.body ;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({message: "User created successfully"});
    } catch(error) {
        //res.status(500).json(error.message); - replaced by next
        next(error); // - replaced by errorHandler
        //next(errorHandler(300, "something went wrong"));
    }
};

export const signin = async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body ;

    try {
        const validUser = await User.findOne({ email: email });
        if(!validUser) 
            return next(errorHandler(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) 
            return next(errorHandler(401, 'wrong credentials'));
        // add token to browser cookie
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc ;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate})
            .status(200)
            .json(rest);
    } catch(error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        console.log("In google"); 
        console.log("req body", req.body);
        //const user = await User.findOne({ email: req.body.email });
        const userEmail = req.body.email;
        console.log("userEmail", userEmail);
        if(userEmail) {
            let r1 = Math.floor(Math.random() * 10000);
            const token = jwt.sign({ id: r1 }, process.env.JWT_SECRET);   
            //const { password: hashedPassword, ...rest } = user._doc;
            const { email: email, ...rest } = req.body;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            console.log("token, expiry date",  token,expiryDate);
            res.cookie('access_token', token, { 
                httpOnly: true, 
                expires: expiryDate})
                .status(200).json(req.body);
            console.log("cookie set");
        } else {
            console.log("nu - 1");
            const generatedPassword = Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
                // 8 digits + 8 digits
            console.log("nu - 2");
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            console.log("nu - 3");
            //let n2 = req.user.name.split(" ").join("").toLowerCase() ;
            //        Math.floor(Math.random() * 10000).toString() ;
            let n2 = "Test name".split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString();
            let e2 = n2 + "@gmail.com";
            console.log("n2", n2, e2);
            const newUser = new User({ 
                userName: n2, 
                email: e2, 
                password: hashedPassword,
                profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" });
            console.log("newUser 4", newUser);

            await newUser.save();
            console.log("nu saved- 5");            

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);   
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000); // 1 hour
            res.cookie('access_token', token, { 
                httpOnly: true, 
                expires: expiryDate}).status(200).json(rest);
            console.log("nu - 6");
        }
    } catch(error) {
        console.log("error", error);
        next(error);
    }
};