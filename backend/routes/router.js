import { Router } from "express";
import { signup,login } from "../controllers/authcontroller.js";
import { createproblem,getproblembyid,getallproblems,deleteproblem,update } from "../controllers/problemcontroller.js";
import {runcode,judge} from "../controllers/compilercontroller.js"
const router = Router();



router.post("/signup", signup);
router.post("/login", login);
router.post("/createproblem", createproblem);
router.get("/getallproblems", getallproblems);
router.get("/getproblembyid/:id",getproblembyid);
router.delete("/deleteproblem/:id",deleteproblem);
router.post("/run",runcode);
router.post("/submit",judge);
router.put("/update/:id",update);




export default router;