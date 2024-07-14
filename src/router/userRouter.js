import express from 'express'
import { signin,login,resetToken, getUserId,resetPassword, resetUser } from '../controller/userController.js';

const userRouter=express.Router();
userRouter.post("/sign-in",signin)
userRouter.post("/log-in",login)
userRouter.post("/reset-token",resetToken)
userRouter.get("/get-userId/:userId",getUserId)
userRouter.put("/reset-password/:userId",resetPassword)
userRouter.put("/put-user/:userId",resetUser)
export default userRouter