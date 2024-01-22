import {  AssignedProject } from "../model/AssignedProject.js";
import {CompletedProjects} from '../model/CompletedProject.js';

export const ShowAllAssignedProjectsByParticularHire=async(req,res)=>{   
    const {id}=req.params;

    try {
        const foundAssignedProjects = await AssignedProject.find({Hireid:id});
        console.log(foundAssignedProjects);
        res.status(200).json(foundAssignedProjects);
      } catch (error) {
        logger.error(err, { meta: { method: "ShowAllAssignedProjectsByParticularHire" } });
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
}
//show all hire Profile
export const ShowAllAssignedProjectsToParticularDeveloper=async(req,res)=>{
    const {id}=req.params;

  try {
      const foundAssignedProjects = await AssignedProject.find({userId:id});
      res.status(200).json(foundAssignedProjects);
    } catch (err) {
      logger.error(err, { meta: { method: "ShowAllAssignedProjectsToParticularDeveloper" } });
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
}


export const getallCompleteProjectByProjectId=async(req,res)=>{
  const {id}=req.params;
  try {
    const foundCompleteProjects = await CompletedProjects.find({Hireid:id});
    res.status(200).json(foundCompleteProjects);
  } catch (err) {
    logger.error(err, { meta: { method: "getallCompleteProjectByProjectId" } });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getallCompleteProjectByUserId=async(req,res)=>{
  const {id}=req.params;
  try {
    const foundCompleteProjects = await CompletedProjects.find({userId:id});
    res.status(200).json(foundCompleteProjects);
  } catch (err) {
    logger.error(err, { meta: { method: "getallCompleteProjectByUserId" } });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}