import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({
        message: 'API is working',
    });
};

// update user

export  const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account!"));
    }

    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture
                }
            },
            { new: true }
        );
        console.log("ran update user - returned");
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);  // do not send the password back
    } catch(error) {
        console.log("Error in update user caught");
        next(error);
    } 
};
