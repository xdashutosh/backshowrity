import { User } from "../model/user.js";
import { logger } from "../utils/logger.util.js";
import jwt from 'jsonwebtoken';


export const getSettingDataByID = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id); // Await the promise
  
      if (!user) {
        return res.status(400).json({
          userExists: false,
        });
      }
  
      const userData = {
        password: user.password,
        email: user.email,
       
      };
  
      return res.status(200).json({
        userData,
      });
    } catch (err) {
      // Log the error
      logger.error(`${err}`, { meta: { method: "getSettingDataByID" } });
      return res.status(500).json({
        error: 'An error occurred while fetching user data',
      });
    }
  };


  export const getidOfDeveloper=async(req,res)=>{
    try{
          const accessToken = req.cookies["accessToken"];
          if(!accessToken){
            logger.warn("No access tooken", { meta: { method: "getidOfDeveloper" } });
            return res.status(401).json({
              authenticated: false,
              tokenExists: false,
            });
          }
          
          const accessTokenPayload = jwt.verify(accessToken, process.env.SECRET);
          const userid=accessTokenPayload.uid;
          const fuser=await User.findOne({_id:userid});
          console.log(fuser);
          return res.status(200).json({
            authenticated:true,
            id:userid,
            role:fuser.role,
            
          })
    }
    catch(err){
      logger.error(err, { meta: { method: "getidOfDeveloper" } });
      return res.status(401).json({
        authenticated: false,
      });
    }
  }