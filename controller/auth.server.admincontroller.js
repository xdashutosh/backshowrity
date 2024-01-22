import { Admin } from "../model/Adminuser.js";
import { CONTACTUS } from "../model/ContactUs.js";
import { FirstPayment } from "../model/FirstPayment.js";
import { Notification } from "../model/Notification.js";
import { logger } from "../utils/logger.util.js";
import jwt from 'jsonwebtoken';



export const GetAllNotificationton = async (req, res) => {
    try {
      const Notification = await CONTACTUS.find();
      
      logger.info("All notifications sent", { meta: { method: "GetAllNotificationton" } });
      
      res.status(200).json({
        notifications: Notification
      });
    } catch (err) {
      logger.error(`${err}`, { meta: { method: "GetAllNotificationton" } });
      res.status(500).json({ error: 'An error occurred' });
    }
  }
  

  export const PostNotificationByAdmin = async (req, res) => {
    try {
      const {id}=req.params;
      const { Message}=req.body;
      const newNotification=new Notification({
        userId:id,
        msg:Message,
      })

     await newNotification.save();
      
      
      logger.info(" notifications Post", { meta: { method: "PostNotificationByAdmin" } });
      
      res.status(200).json({
        notifications: newNotification
      });
    } catch (err) {
      logger.error(`${err}`, { meta: { method: "PostNotificationByAdmin" } });
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  export const PostNotificationafterPayment =async(id ,message)=> {
    try {
      
      
      const newNotification=new Notification({
        userId:id,
        msg:message,
      })

     await newNotification.save();
      
      
      logger.info(" notifications Post", { meta: { method: "PostNotificationafterPayment" } });
      
      
    } catch (err) {
      logger.error(`${err}`, { meta: { method: "PostNotificationafterPayment" } });
      
    }
  }



  export const GetNotificationByAdmin = async (req, res) => {
      try {
        const {id}=req.params;
        
        const newNotification= await Notification.find({userId: id }).sort({ createdAt: -1 });

        res.status(200).json({
          Notification: newNotification,
        });
        
        
        logger.info(" notifications get", { meta: { method: "GetNotificationByAdmin" } });
        
      
      } catch (err) {
        logger.error(`${err}`, { meta: { method: "GetNotificationByAdmin" } });
        res.status(500).json({ error: 'An error occurred' });
      }
  }

export const deleteNotificationByAdmin = async (req, res) => {
    try {
      const {id}=req.params;
      const notificationid=req.body.notificationId;
      const fnotification=await Notification.findOne({_id:notificationid});
      console.log(fnotification);
      await Notification.deleteOne({ _id: notificationid });

      res.status(204).send();
      
      
      logger.info(" notifications deleted", { meta: { method: "deleteNotificationByAdmin" } });
      
    
    } catch (err) {
      logger.error(`${err}`, { meta: { method: "deleteNotificationByAdmin" } });
      res.status(500).json({ error: 'An error occurred' });
    }
}

  export const setFirstPay=async(req,res)=>{
    try{
           const {firstpay}=req.body;
           await FirstPayment.deleteMany({}); 

           const newpay = new FirstPayment({
            FirstPay: firstpay, // Replace with the actual data you want to save
          });
          
         await  newpay.save();

          res.status(200).json({
            value:"changed",
          })
          logger.info(" firstpayment chnaged", { meta: { method: "setFirstPay" } });
    }
    catch(err){
      logger.error(`${err}`, { meta: { method: "setFirstPay" } });
    }
  }


  export const getFirstPay=async(req,res)=>{
    try{
           
           

      const fpay = await FirstPayment.findOne();

      if (!fpay) {
        return res.status(404).json({
          error: "No data found",
        });
      }
             

          

          res.status(200).json({
            firstpay:fpay.FirstPay,
          })
          logger.info(" getFirstPay", { meta: { method: "getFirstPay" } });
    }
    catch(err){
      logger.error(`${err}`, { meta: { method: "getFirstPay" } });
    }
  }

export const LoginAdmin=async(req,res)=>{


        try{
          const fAdmin = await Admin.findOne({ email: req.body.email });
        
          if (fAdmin === null) {
            return res.status(400).json({
              userExists: false,
            });
          }
        
          
        
          try {
            if (req.body.password==fAdmin.password) {
              const params = {
                uid: fAdmin._id.toString(),
              };
        
              const newAccessToken = jwt.sign(params, process.env.SECRET, {
                expiresIn: "15m",
              });
        
              const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
                expiresIn: "30d",
              });
        
              // generateDatabaseToken(user._id.toString(), newRefreshToken);
              
        
              res.cookie("refreshToken", newRefreshToken, {
                // httpOnly: true,
                // sameSite: "none",
                // secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
        
              res.cookie("accessToken", newAccessToken, {
                // httpOnly: true,
                // sameSite: "none",
                // secure: true,
                maxAge: 7*24*60 * 60 * 1000, // 7 days
              });
        
              res.status(200).json({
                userExists: true,
                userVerified: true,
                accessToken: newAccessToken,
                uid:fAdmin._id.toString(),
                
              });
            } else {
              logger.warn("Admin creds wrong", { meta: { method: "LoginAdmin" } });
              res.status(401).json({
                userExists: true,
                userVerified: true,
                isPasswordTrue: false,
              });
            }
          } catch (err) {
            logger.error(err, { meta: { method: "LoginAdmin" } });
            res.status(500).json({
              userExists: false,
              userVerified: false,
            });
          }
    }
    catch(err){
      logger.error(err, { meta: { method: "login" } });
      res.status(500).json({
        userExists: false,
        userVerified: false,
      });
    }
  }

  export const checktoken=async(req,res)=>{
    res.status(200).json({
      chcek:true,
    });
  }