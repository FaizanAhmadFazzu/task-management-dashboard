import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";



export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select("-password");
            next();
        } catch (err) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not Authorized. no token")
    }
});




export const verifyAdmin = asyncHandler(async (req, res, next) => {
    protect(req, res, () => {
        if (req?.user?.isAdmin) {
            next();
        } else {
            res.status(401);
            throw new Error("You can't perform this action.")
        }
    })
})