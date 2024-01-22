import { CONTACTUS } from "../model/ContactUs.js";
import { MoneyNotifications } from "../model/MoneyNotification.js";
import { logger } from "../utils/logger.util.js";



export const SendNotificationtoAdmin=async(req,res)=>{

    try{
         const newQuery=new CONTACTUS({
            email:req.body.email,
            msg:req.body.msg
         })  
         await newQuery.save();
         logger.info("Notiaction send", { meta: { method: "SendNotificationtoAdmin" } });
         res.status(200).json({
            NotificationSend:"Success"
          })
    }catch (err) {
      logger.error(`${err}`, { meta: { method: "SendNotificationtoAdmin" } });
    }

  }

  export const CreateNotificationwithAccountedtails=async(req,res)=>{
     const {id}=req.params;    
    
      try{
          let newnotification=await new MoneyNotifications({
            userId:id,
            IFSC :req.body.IFSC,
            AccountNumber: req.body.AccountNumber,
            AccountName:req.body.AccountName,
          })

          await newnotification.save();
          res.status(200).json({
            NotificationSend:"Success"
          });
          logger.info("Notiaction send", { meta: { method: "CreateNotificationwithAccountedtails" } });
        }catch(err){
          logger.error(`${err}`, { meta: { method: "CreateNotificationwithAccountedtails" } });
        }
  }


  export const getNotificationwithAccountedtails=async(req,res)=>{
     
   
     try{
         const fNotification=await MoneyNotifications.find().sort({ createdAt: 1 });;


         
         res.status(200).json({
           Notification:fNotification
         });
         logger.info("Notiaction send", { meta: { method: "getNotificationwithAccountedtails" } });
       }catch(err){
         logger.error(`${err}`, { meta: { method: "getNotificationwithAccountedtails" } });
       }
 }


