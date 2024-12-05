import { Router } from "express";
import { userLogin,userSignup } from "../controller/user.controller.js";
import validator from "../middelware/validate.middleware.js"
const router = Router();

router.post("/register",userSignup);

router.post("/login",userLogin)
// get monthly bill

//get user details

export default router;
