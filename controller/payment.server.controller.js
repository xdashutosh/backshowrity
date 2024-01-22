import { instance } from "../server.js";
import crypto from "crypto";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { AssignedProject } from "../model/AssignedProject.js";
import { Projects } from "../model/Projects.js";
import {CompletedProjects} from '../model/CompletedProject.js';
import { PostNotificationafterPayment } from "./auth.server.admincontroller.js";
import { DeveloperAccounts } from "../model/DeveloperAccount.js";
import { HireAccounts } from "./HireAccount.js";
import { updateBalanceById } from "./Account.server.controller.js";
import { ProjectNotPaids } from "../model/ProjectNotPaid.js";
import { updateRatingAndBadgesOfDeveloper } from "./Badges.server.controller.js";
import Razorpay from "razorpay";
// import { Payment } from "../models/paymentModel.js";

dotenv.config();
const razorpay1 = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET ,
});

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount*100),
    currency: "INR",
  };
  const accessToken = req.cookies["accessToken"];
  const accessTokenPayload = jwt.verify(accessToken, process.env.SECRET);
  const Hireid=accessTokenPayload.uid;
  const userId=req.body.userId;
  const projectId=req.body.projectId;
 console.log(Hireid+"hire "+userId+" user "+projectId+" projectid" );
 
  const order = await instance.orders.create(options);
  console.log(order);

  const fprojects=await Projects.find({_id:projectId});
  console.log(fprojects);
  const nAssignmentProject=new ProjectNotPaids({
    Projectid:projectId,
    userId:userId,
    Hireid:Hireid,
    amount:req.body.amount,
    orderId:order.id,
    ProjectSummary:fprojects[0].ProjectSummary,
    ProjectMoney:fprojects[0].ProjectMoney,
    estimateTime:fprojects[0].estimateTime,
  })
  nAssignmentProject.save();

  // await Projects.deleteOne({_id:projectId});




  console.log("redirected"+order.id);
  res.status(200).json({
    success: true,
    order,
  });
};



export const paymentVerification = async (req, res) => {

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(razorpay_order_id);
 
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

 

  if (razorpay_signature === expectedSignature) {
    const filter = { orderId:razorpay_order_id};
    const update = { successful:true };

  // Assuming AssignedProject is your Mongoose model
  const updatedProjectNotPaids = await ProjectNotPaids.findOneAndUpdate(filter, update, {
    new: true, // To return the updated document
  });

  await Projects.deleteOne({_id:updatedProjectNotPaids.Projectid});
  const nAssignmentProject=new AssignedProject({
    Projectid:updatedProjectNotPaids.Projectid,
    userId:updatedProjectNotPaids.userId,
    Hireid:updatedProjectNotPaids.Hireid,
    amount:updatedProjectNotPaids.amount,
    orderId:updatedProjectNotPaids.orderId,
    ProjectSummary:updatedProjectNotPaids.ProjectSummary,
    ProjectMoney:updatedProjectNotPaids.ProjectMoney,
    estimateTime:updatedProjectNotPaids.estimateTime,
    successful:updatedProjectNotPaids.successful,
  })
  nAssignmentProject.save();
  await ProjectNotPaids.deleteMany({Projectid:updatedProjectNotPaids.Projectid});

  const msg=`your initial payment of ${nAssignmentProject.amount} is received you can start the project`;
  const hiremsg=`your initial payment is done of${nAssignmentProject.amount} `

   PostNotificationafterPayment(nAssignmentProject.userId,msg);
   PostNotificationafterPayment(nAssignmentProject.Hireid,hiremsg);
   
    const newDeveloperAccounts=new DeveloperAccounts({
      Projectid:nAssignmentProject.Projectid,
      userId:nAssignmentProject.userId,
      Hireid:nAssignmentProject.Hireid,
      amountinitial:nAssignmentProject.amount,
      orderIdintial:razorpay_order_id,
      ProjectSummary:nAssignmentProject.ProjectSummary,
      
    });
    await newDeveloperAccounts.save();
    
    const newHireAccounts=new HireAccounts({
      Projectid:nAssignmentProject.Projectid,
      userId:nAssignmentProject.userId,
      Hireid:nAssignmentProject.Hireid,
      amountinitial:nAssignmentProject.amount,
      orderIdintial:razorpay_order_id,
      ProjectSummary:nAssignmentProject.ProjectSummary,
      
    });
    await newHireAccounts.save();
    res.redirect(
      `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
  );
    
      
  } else {
    res.status(400).json({
      success: false,
      message: "Signature mismatch. Payment verification failed.",
    });
  }
};

export const checkout90 = async (req, res) => {
  const options = {
    amount: Number(req.body.amount*100),
    currency: "INR",
  };

 
  const order = await instance.orders.create(options);

 

  // const nCompleteProject=new CompletedProjects({
  //   Projectid:req.body.Projectid,
  //   userId:req.body.userId,
  //   Hireid:req.body.Hireid,
  //   amount:req.body.amount,
  //   orderId:order.id,
  //   ProjectSummary:req.body.ProjectSummary,
  //   ProjectMoney:req.body.ProjectMoney,
  //   estimateTime:req.body.estimateTime,
  // })
  // nCompleteProject.save();
  const ProjectNotPaid=new ProjectNotPaids({
    Projectid:req.body.Projectid,
    userId:req.body.userId,
    Hireid:req.body.Hireid,
    amount:req.body.amount,
    orderId:order.id,
    ProjectSummary:req.body.ProjectSummary,
    ProjectMoney:req.body.ProjectMoney,
    estimateTime:req.body.estimateTime,
    rating:req.body.rating,
    
  })
  await ProjectNotPaid.save();
  


  // await AssignedProject.deleteOne({Projectid:req.body.Projectid});




  // console.log("redirected"+order.id);
  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification90 = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log(razorpay_order_id);
 
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

 

  if (razorpay_signature === expectedSignature) {
    const filter = { orderId:razorpay_order_id};
  const update = { successful:true };

 
  const updatedProjectNotPaids = await ProjectNotPaids.findOneAndUpdate(filter, update, {
    new: true, // To return the updated document
  });

  await AssignedProject.deleteOne({Projectid:updatedProjectNotPaids.Projectid});

   const nCompleteProject=new CompletedProjects({
    Projectid:updatedProjectNotPaids.Projectid,
    userId:updatedProjectNotPaids.userId,
    Hireid:updatedProjectNotPaids.Hireid,
    amount:updatedProjectNotPaids.amount,
    orderId:updatedProjectNotPaids.orderId,
    ProjectSummary:updatedProjectNotPaids.ProjectSummary,
    ProjectMoney:updatedProjectNotPaids.ProjectMoney,
    estimateTime:updatedProjectNotPaids.estimateTime,
    successful:updatedProjectNotPaids.successful,
  })
  nCompleteProject.save();
  console.log(updatedProjectNotPaids.rating);

  const filterD = { Projectid:updatedProjectNotPaids.Projectid};
  const updateD = { amountfinal:updatedProjectNotPaids.amount , orderIdfinal:razorpay_order_id };

// Assuming AssignedProject is your Mongoose model
const updatedHireAccounts = await HireAccounts.findOneAndUpdate(filterD, updateD, {
  new: true, // To return the updated document
});

const filterH = { Projectid:updatedProjectNotPaids.Projectid};
const updateH = { amountfinal:updatedProjectNotPaids.amount , orderIdfinal:razorpay_order_id };

// Assuming AssignedProject is your Mongoose model
    const updatedDeveloperAccount = await DeveloperAccounts.findOneAndUpdate(filterH, updateH, {
    new: true, // To return the updated document
    });
const famount=Number(updatedDeveloperAccount.amountinitial)+Number(updatedDeveloperAccount.amountfinal);
    updateBalanceById(updatedDeveloperAccount.userId,famount)


  const msg=`your final payment of ${updatedProjectNotPaids.amount} is received you can  withdraw it `;
  const hiremsg=`your final payment is done of ${updatedProjectNotPaids.amount} `

   PostNotificationafterPayment(updatedProjectNotPaids.userId,msg);
   PostNotificationafterPayment(updatedProjectNotPaids.Hireid,hiremsg);
   
   updateRatingAndBadgesOfDeveloper(nCompleteProject.userId,updatedProjectNotPaids.rating)
   
   
   await ProjectNotPaids.deleteMany({Projectid:updatedProjectNotPaids.Projectid});

  //  const userProfile
    
      res.redirect(
        `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
      message: "Signature mismatch. Payment verification failed.",
    });
  }
};

export const getRazorKey =async(req,res)=>{
    res.status(200).json({key:process.env.RAZORPAY_API_KEY})
}




