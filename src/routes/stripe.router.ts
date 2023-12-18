import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";

const StripeRouter = Router();
StripeRouter.post("/payment", authMiddleware, (req, res)=>{
    const { phoneNumber, email, amount} = req.body
    try{
            console.log(amount)
            res.send({result : 'success',url : 'session_url'})
    }catch(err){
            console.log(err)
            res.send({result : 'failed'})
    }

});
export default StripeRouter;
