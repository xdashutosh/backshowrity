import { Blogs } from "../model/Blogs.js";
import { logger } from "../utils/logger.util.js";
import { error, success } from "../utils/sendfunction.js";
import { v2 as cloudinary } from "cloudinary";
export const StoreBlogsData = async (req, res) => {
  try {
    const { img } = req.body;
 console.log(img);
    const cloudImg = await cloudinary.uploader.upload(img, {
      folder: "Blogimg",
    });

    const newBlog = new Blogs({
      Heading1: req.body.Heading1,
      Desc1: req.body.Desc1,
      subHeading1: req.body.subHeading1,
      subdesc1: req.body.subdesc1,
      subHeading2: req.body.subHeading2,
      subdesc2: req.body.subdesc2,
      subHeading3: req.body.subHeading3,
      subdesc3: req.body.subdesc3,
      subHeading4: req.body.subHeading4,
      subdesc4: req.body.subdesc4,
      image: {
        publicId:cloudImg.public_id, 
        url: cloudImg.secure_url,
      },
    });
    await newBlog.save();
    logger.info("Blog saved", { meta: { method: "StoreBlogsData" } });
    res.status(200).json({
      Blog: "Success",
    });
  } catch (err) {
    logger.error(`${err}`, { meta: { method: "StoreBlogsData" } });
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getAllBlogsData = async (req, res) => {
  try {
    const nblogs = await Blogs.find();

    logger.info("Blog send", { meta: { method: "getAllBlogsData" } });
    res.status(200).json({
      Blog: nblogs,
    });
  } catch (err) {
    logger.error(`${err}`, { meta: { method: "getAllBlogsData" } });
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getAllBlogsDataByID = async (req, res) => {
  try {
    const { id } = req.params;
    const nblogs = await Blogs.findById(id);

    logger.info("Blog send", { meta: { method: "getAllBlogsDataByID" } });
    res.status(200).json({
      Blog: nblogs,
    });
  } catch (err) {
    logger.error(`${err}`, { meta: { method: "getAllBlogsDataByID" } });
    res.status(500).json({ error: "An error occurred" });
  }
};

export const deleteblog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send(error(401, "Id is required"));  
    }

    const data = await Blogs.deleteOne({ _id: id });

    return res.send(success(200, "Blog deleted successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

