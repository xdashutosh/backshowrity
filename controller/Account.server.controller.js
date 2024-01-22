import { AccountBalances } from "../model/AccountBalance.js";
import { DeveloperAccounts } from "../model/DeveloperAccount.js";
import { logger } from "../utils/logger.util.js";
import { HireAccounts } from "./HireAccount.js";



export const getAllAcoountDetailsByDeveloperId = async (req, res) => {
    try {
        const{id}=req.params;
        // console.log(id);
        const fDeveloperAccounts = await DeveloperAccounts.find({userId:id});
        res.status(200).json(fDeveloperAccounts);
      } catch (error) {
        logger.error(error, { meta: { method: "getAllAcoountDetailsByDeveloperId" } });
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    
};


export const getAllAcoountDetailsByHireId = async (req, res) => {
  try {
      const{id}=req.params;
      console.log(id);
      const fHireAccounts = await HireAccounts.find({Hireid:id});
      res.status(200).json(fHireAccounts);
    } catch (error) {
      logger.error(error, { meta: { method: "getAllAcoountDetailsByHireId" } });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  
};

export const updateBalanceById=async(userId , money)=>{
  try {
    
    
    const existingBalance = await AccountBalances.findOne({ userId });

    if (existingBalance) {
     
      existingBalance.Balance = Number(existingBalance.Balance) + Number(money);
      await existingBalance.save();
      
    } else {
      // If it doesn't exist, create a new AccountBalance document
      const newBalance = new AccountBalances({ userId, Balance: money });
      await newBalance.save();
      
    }
  } catch (error) {
    logger.error(error, { meta: { method: "updateBalanceById" } });
   
  }
}


export const getBalancedByID= async (req, res) => {
  try {
      const{id}=req.params;
      console.log(id);
      const fuserAccount = await AccountBalances.find({userId:id});
      res.status(200).json(fuserAccount);
    } catch (error) {
      logger.error(error, { meta: { method: "getBalancedByID" } });
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
};
