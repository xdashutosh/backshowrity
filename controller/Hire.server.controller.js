
import { Projects } from "../model/Projects.js";
import { User } from "../model/user.js";
import { logger } from "../utils/logger.util.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const ShowAllPostByHire=async(req,res)=>{
    const {id}=req.params;

    try{
        const projects= await Projects.find({ creatorId: id });
        if(projects){
            res.status(200).json({
                message:"all task Post by Hire",
                projects,
            });
        }
        else{
            res.status(404).json({
                message:"Project not found",
            });
        }
        logger.info(`all projects of ${id}`,{meta:{method:"showAllPostByHire"}})
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Intenal server error",
        });
    }

}

// show all the project applied by a particular developer
export const allProjectAplliedByDeveloper= async(req,res)=>{

  const {id}=req.params;
  try{
    const projectFound=await Projects.find({ appliedUser: { $in: [id] } });
    
    res.status(200).json({
        message:"All Projects Apllied by developer",
        projectFound,
    });
    logger.info(`All Projects Apllied by developer${id}`,{meta:{method:'allProjectAplliedByDeveloper'}})
  }catch(error){
    console.log(error);
    res.statu(500).json({
        message:"Internal server error",
    })
  }
    
}



// export const showAllDeveloper=(req,res)=>{
//     try{
//         const DeveloperFound=await User.find({})
//     }
// }


