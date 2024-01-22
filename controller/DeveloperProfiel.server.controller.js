import { CompanyProfile } from "../model/CompanyProfile.js";
import { DeveloperProfile } from "../model/DeveloperProfile.js";
import { Projects } from "../model/Projects.js";
import { User } from "../model/user.js";
import { logger } from "../utils/logger.util.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
import fuzzy from 'fuzzy';





//update and create the developer profile
export const CreateDeveloperProfile = async (req, res) => {
  const { id } = req.params;
  const { img } = req.body;

  const cloudImg = await cloudinary.uploader.upload(img, {
    folder: "DeveloperProfileBanner",
  });


  try {
    const user = await User.findById(id);
    let updatedProfile;
    const foundProfile = await DeveloperProfile.findOne({ userId: id });

    if (!foundProfile) {
      const newDeveloper = await new DeveloperProfile({
        userId: id,
        email: user.email,
        country: req.body.country,
        city: req.body.city,
        summary: req.body.summary,
        experience:req.body.experience,
        skill: req.body.skill,
        mobile: req.body.mobile,
        name: req.body.name,
        linkdin:req.body.linkdin,
        website:req.body.website,
        jobtitle:req.body.jobtitle,
        imageBanner: {
          publicId: cloudImg.public_id,
          url: cloudImg.secure_url,
        }

      });
      updatedProfile = await newDeveloper.save();
    }
    else {
      let updateData = {
        email: user.email,
        country: req.body.country,
        city: req.body.city,
        summary: req.body.summary,

        skill: req.body.skill,
        mobile: req.body.mobile,
        name: req.body.name,
      };


      updatedProfile = await DeveloperProfile.findOneAndUpdate({ userId: id }, updateData,
        { new: true, });
    }

    res.status(200).json(updatedProfile);


  } catch (err) {
    logger.error(err, { meta: { method: "CreateDeveloperProfile" } });
    console.log(error);
    res.status(500).json({
      message: "Intenal server error",
    });
  }

}



export const CreateHireProfile = async (req, res) => {
  const { id } = req.params;

  const { img } = req.body;
  console.log(img);
  const cloudImg = await cloudinary.uploader.upload(img, {
    folder: "HireProfileBanner",
  });

  try {
    const user = await User.findById(id);
    let updatedProfile;
    const foundProfile = await CompanyProfile.findOne({ userId: id });

    if (!foundProfile) {
      const newHire = await new CompanyProfile({
        userId: id,
        email: user.email,
        country: req.body.country,
        city: req.body.city,
        summary: req.body.summary,
        mobile: req.body.mobile,
        name: req.body.name,
        image: {
          publicId: cloudImg.public_id,
          url: cloudImg.secure_url,
        }

      });
      updatedProfile = await newHire.save();
    }
    else {
      let updateData = {
        email: user.email,
        country: req.body.country,
        city: req.body.city,
        summary: req.body.summary,
        mobile: req.body.mobile,
        name: req.body.name,
      };


      updatedProfile = await CompanyProfile.findOneAndUpdate({ userId: id }, updateData,
        { new: true, });
    }

    res.status(200).json(updatedProfile);


  } catch (err) {
    logger.error(err, { meta: { method: "CreateHireProfile" } });
    console.log(error);
    res.status(500).json({
      message: "Intenal server error",
    });
  }
}



export const ShowAllDeveloperProfile = async (req, res) => {


  try {
    const developerProfiles = await DeveloperProfile.find();
    res.status(200).json(developerProfiles);
  } catch (error) {
    logger.error(err, { meta: { method: "ShowAllDeveloperProfile" } });
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
//show all hire Profile
export const ShowAllHireProfile = async (req, res) => {


  try {
    const CompanyProfile1 = await CompanyProfile.find();
    res.status(200).json(CompanyProfile1);
  } catch (err) {
    logger.error(err, { meta: { method: "ShowAllCompanyProfile" } });
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

//show all the task
export const showAllPost = async (req, res) => {
  try {
    const allProject = await Projects.find();
    res.status(200).json(allProject);
  } catch (error) {
    logger.error(err, { meta: { method: "showAllPost" } });
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//show the developer profile by id
export const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { img } = req.body;
    console.log(img);
    const developer = await DeveloperProfile.findOne({ userId: id });
    console.log(developer);
    if (developer?.imageProfile) {
      await cloudinary.uploader.destroy(developer.imageProfile.public_id);
    }
    const cloudImg = await cloudinary.uploader.upload(img, {
      folder: "DeveloperPhoto",
    });
    developer.image = {
      publicId: cloudImg.public_id,
      url: cloudImg.secure_url,
    }

    await developer.save();
    return res.status(200).send("Saved photo succesfully");

  } catch (e) {

    return res.status(500).send(e.message);
  }
}
export const showDeveloperProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const devloper = await DeveloperProfile.find({ userId: id });
    res.status(200).json(devloper);
  } catch (error) {
    logger.error(err, { meta: { method: "showDeveloperProfileById" } });
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

}


//show the compnayProfile  by id
export const showCompanyProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const devloper = await CompanyProfile.find({ userId: id });
    res.status(200).json(devloper);
  } catch (error) {
    logger.error(err, { meta: { method: "showCompanyProfileById" } });
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }

}



export const SearchDeveloperbyTechnologyAndName = async (req, res) => {
  try {
    const { technology, Name } = req.query;

    if ((!technology || technology == '') && (!Name || Name == '')) {
      const developers = await DeveloperProfile.find();

      return res.status(200).json({ developer: developers });
    }
    else if (!technology || technology == '') {

      const allDevelopers = await DeveloperProfile.find();
      const developers = allDevelopers.map((dev) => dev.name);
      const results = fuzzy.filter(Name, developers);
      const matchingdev = results.map((result) => result.string);
      const matchingDevelopers = allDevelopers.filter((developer) =>
        matchingdev.includes(developer.name)
      );


      res.status(200).json({ developer: matchingDevelopers });

      // const developers = await DeveloperProfile.find({ name: { $regex: new RegExp("^" + Name + "$", "i") } });
      //     res.status(200).json({ developer: developers });
    }
    else if (!Name || Name == '') {
      const developers = await DeveloperProfile.find();

      const filteredDevelopers = developers.filter((developer) => {
        return developer.skill.some((skill) => skill.toLowerCase() === technology.toLowerCase());
      });

      res.status(200).json({ developer: filteredDevelopers });
      // const developers = await DeveloperProfile.find({ technology: { $regex: new RegExp("^" + technology + "$", "i") } });
      //     res.status(200).json({ developer: developers });
    }
    else {


      const allDevelopers = await DeveloperProfile.find();
      const developers = allDevelopers.map((dev) => dev.name);
      const results = fuzzy.filter(Name, developers);
      const matchingdev = results.map((result) => result.string);


      const filteredDevelopers = allDevelopers.filter((developer) => {
        return developer.skill.some((skill) => skill.toLowerCase() === technology.toLowerCase());
      });

      const matchdev = filteredDevelopers.filter((dev) => {
        return matchingdev.includes(dev.name);
      });




      res.status(200).json({ developer: matchdev });
    }

    // Perform the search based on the 'technology' parameter

    logger.info(`search `, { meta: { method: "SearchDeveloperbyTechnologyAndName" } })

  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
    logger.error(`${error}`, { meta: { method: "SearchDeveloperbyTechnologyAndName" } });
  }

}