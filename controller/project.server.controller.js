import { DeveloperProfile } from "../model/DeveloperProfile.js";
import { Projects } from "../model/Projects.js";
import { User } from "../model/user.js";
import { logger } from "../utils/logger.util.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import fuzzy from 'fuzzy';
dotenv.config();

// export const CreateProject = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const newProject = new Projects({
//       technology: req.body.technology,
//       estimateTime: req.body.estimateTime,
//       companyName:req.body.CompanyName,
//       creatorId: id,
//       ProjectSummary:req.body.ProjectSummary,
//       ProjectMoney:req.body.ProjectMoney,
//       ProjectDetails:req.body.byteArray,             
//     });

//     // Use await to ensure the save operation completes before sending the response
//     await newProject.save();

//     res.status(200).json({
//       ProjectCreated: true,
//       project: newProject,
//     });

//     logger.info(`Project created: ${newProject._id}`, { meta: { method: "CreateProject" } });
//   } catch (err) {
//     res.status(500).json({
//       ProjectCreated: false,
//     });
//     logger.error(`${err}`, { meta: { method: "CreateProject" } });
//   }
// };

export const CreateProject = async (req, res) => {
  const { id } = req.params;

  try {
    // console.log(req.body.byteArray);
    // Decode the base64-encoded ProjectDetails field to binary data
  

    const newProject = new Projects({
      technology: req.body.technology,
      estimateTime: req.body.estimateTime,
      companyName: req.body.CompanyName,
      creatorId: id,
      ProjectSummary: req.body.ProjectSummary,
      ProjectMoney: req.body.ProjectMoney,
      level:req.body.level,
     
    });

    // Use await to ensure the save operation completes before sending the response
    await newProject.save();

    res.status(200).json({
      ProjectCreated: true,
      project: newProject,
    });

    logger.info(`Project created: ${newProject._id}`, { meta: { method: "CreateProject" } });
  } catch (err) {
    res.status(500).json({
      ProjectCreated: false,
    });
    logger.error(`${err}`, { meta: { method: "CreateProject" } });
  }
};

export const TaskApply=async(req,res)=>{
  const { id } = req.params;
 
  try{
      const AccessToken1 = req.cookies["accessToken"];
      // const AccessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NTAyYjI2NTgwNTIyOWQ5NzFmYWU4OWEiLCJpYXQiOjE2OTQ2ODE3NDgsImV4cCI6MTY5NDY4MjY0OH0.tGdlIuBgJixVUJeO87_MqZIQVZyCcjYASw6-UjUmrfU";
      console.log(AccessToken1);
      // const AccessToken1 = req.cookies["accessToken"];
      console.log(AccessToken1);
      const userIdToAdd=jwt.verify(AccessToken1,process.env.SECRET);
        const project = await Projects.findById(
          id
        );
        console.log(userIdToAdd.uid);

        const fdeveloper=await DeveloperProfile.findOne({userId:userIdToAdd.uid});
        let ratinglevel;
        if(project.level=="Bronze"){
          ratinglevel=0;
        }
        else if(project.level=="Silver"){
          ratinglevel=20;
        }
        else if(project.level=="Gold"){
          ratinglevel=50;
        }
        else if(project.level=="Platinum"){
          ratinglevel=100;
        }
        else if(project.level=="Recommended"){
          ratinglevel=150;
        }
    if(ratinglevel>fdeveloper.rating){
      return  res.status(200).json({
          message: "you are not eligible",
          project:{},
          eligible:false,
        });
    }
    else{
                const project = await Projects.findByIdAndUpdate(
            id, // The document ID you want to update
            { $addToSet: { appliedUser: userIdToAdd.uid } }, // Use $addToSet to add the user ID to the array if it doesn't exist
            { new: true } // To return the modified document
          );

          if (project) {
            // The updated 'project' document contains the added user ID
            res.status(200).json({
              message: "User ID added to appliedUser array",
              project,
              eligible:true,
            });
          } else {
            res.status(404).json({
              message: "Project not found",
            });
          }
          logger.info(`userid added to project ${id}`,{meta:{method:"TaskApply"}})
    }
    }catch(err){
            console.error(err);
            res.status(500).json({
              message: "Internal server error",
            });
          logger.error(`${err}`, { meta: { method: "TaskApply" } });
    }
        

        
   
}



//get all the devloper who appied for the particular post 
export const GetDevelopersByProjectID=async(req,res)=>{

    const {id}=req.params;
    try{
        const FoundProject=await Projects.findById(id);
        const UserArray=FoundProject.appliedUser;
        const arrayOfDevloper = [];
        await Promise.all(
            UserArray.map(async (userId) => {
              try {
                const founduser = await DeveloperProfile.findById(userId);
                arrayOfDevloper.push(founduser);
              } catch (error) {
                console.error(`Error finding user with ID ${userId}: ${error}`);
              }
            })
          );
        console.log(arrayOfDevloper)
        res.status(200).json({arrayOfDevloper});
    }
    catch(err){
        console.log("err");
      logger.error(`${err}`, { meta: { method: "GetDevelopersByProjectID" } });

    }

}

export const GetProjectDetialsByProjectID=async(req,res)=>{
     
  try{
    
    
   const {id}=req.params;
      const project = await Projects.findById(id);

      if (project) {
        // The updated 'project' document contains the added user ID
        res.status(200).json({
          message: "Project details send",
          project,
        });
      } else {
        res.status(404).json({
          message: "Project not found",
        });
      }
      logger.info(`Project details send of project id ${id}`,{meta:{method:"GetProjectDetialsByProjectID"}})
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
      logger.error(`${err}`, { meta: { method: "GetProjectDetialsByProjectID" } });
      
    }
}

export const SearchProjectbyTechnology=async(req,res)=>{
        try {
          const { technology } = req.query;
          
          if (!technology|| technology=='') {
            const projects = await Projects.find();

              return res.status(200).json({ project: projects });
          }

          // Perform the search based on the 'technology' parameter
          const projects = await Projects.find({ technology: technology });
          logger.info(`search `,{meta:{method:"SearchProjectbyTechnology"}})
          res.status(200).json({ project: projects });
      } catch (error) {
          console.error('Error searching projects:', error);
          res.status(500).json({ error: 'Internal server error' });
          logger.error(`${err}`, { meta: { method: "SearchProjectbyTechnology" } });
      }

}

export const SearchProjectbyTechnologyAndCompany=async(req,res)=>{
  try {
    const { technology, companyName } = req.query;
    
    if ((!technology|| technology=='')&&(!companyName||companyName=='')) {
      const projects = await Projects.find();

        return res.status(200).json({ project: projects });
    }
    else if(!technology|| technology==''){
      // const projects = await Projects.find({ companyName: { $regex: new RegExp("^" + companyName + "$", "i") } });
      
      // fuzzy.filter(searchTerm, items);
      const allprojects = await Projects.find();
      const companies = allprojects.map((project) => project.companyName);
      const results = fuzzy.filter(companyName, companies);
      const matchingCompanies = results.map((result) => result.string);
      const matchingProjects = allprojects.filter((project) =>
            matchingCompanies.includes(project.companyName)
          );


          res.status(200).json({ project: matchingProjects });
    }
    else if(!companyName||companyName==''){
      // const projects = await Projects.find({ technology: { $regex: new RegExp("^" + technology + "$", "i") } });
      
      const allprojects = await Projects.find();
      const technologies = allprojects.map((project) => project.technology);
      const results = fuzzy.filter(technology, technologies);
      const matchingTechnologies = results.map((result) => result.string);
      const matchingProjects = allprojects.filter((project) =>
            matchingTechnologies.includes(project.technology)
          );
          res.status(200).json({ project: matchingProjects });
    }
    else {
        const allProjects = await Projects.find();
        const companies = allProjects.map((project) => project.companyName);
        const resultsCompany = fuzzy.filter(companyName, companies);
        const matchingCompanies = resultsCompany.map((result) => result.string);

        const technologies = allProjects.map((project) => project.technology);
        const resultsTechnology = fuzzy.filter(technology, technologies);
        const matchingTechnologies = resultsTechnology.map((result) => result.string);

        const matchingProjects = allProjects.filter(
          (project) =>
            matchingCompanies.includes(project.companyName) &&
            matchingTechnologies.includes(project.technology)
        );

        res.status(200).json({ project: matchingProjects });
    }
    
    logger.info(`search `,{meta:{method:"SearchProjectbyTechnology"}})
   
  } catch (error) {
      console.error('Error searching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
      logger.error(`${err}`, { meta: { method: "SearchProjectbyTechnology" } });
  }

}

// export const showallPostAccordingtoUser=async(req,res)=>{
//   try {
//     const { id } = req.params;
//     const fuser = await DeveloperProfile.findById(id);
//     if(fuser)
//     return res.status(404).json({ message: 'User not found' });
//     if (!fuser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userRating = fuser.rating;

//     // Define the badge-to-rating mapping
//     const badgeToRating = {
//       Bronze: 20,
//       Silver: 50,
//       Gold: 100,
//       Platinum: 150,
//       recommended: 20000, // Assuming recommended badge means no upper limit
//     };

//     // Find projects based on badge and rating criteria
//     const projects = await Projects.find({
//       $and: [
//         {
//           level: {
//             $in: Object.keys(badgeToRating).filter(
//               (badge) => userRating >= badgeToRating[badge]
//             ),
//           },
//         },
//       ],
//     });

//     res.status(200).json(projects);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// }