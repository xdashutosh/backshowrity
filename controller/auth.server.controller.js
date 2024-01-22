
import bcrypt  from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import {logger} from '../utils/logger.util.js';
import {User} from '../model/user.js';
import {RefreshToken} from '../model/refreshToken.js';
import { generateOtp } from './otp.server.controller.js';

dotenv.config();

export const resetPassword = async(req,res)=>{
  const currentUser = await User.findOne({ email: req.body.email });
   if(!currentUser){
     return res.status(200).json({
       userExists:false,
     })
   }
  
  generateOtp(currentUser.email, currentUser._id.toString());
  
  return res.status(200).json({
    uid:currentUser._id.toString(),
    userExists:true,
  })

}

export const register = async (req, res) => {
    const currentUser = await User.findOne({ email: req.body.email });
    if (currentUser && currentUser.confirmed)
      return res.status(201).json({
        userVerified: true,
      });
  
    if (currentUser && !currentUser.confirmed) {
      generateOtp(currentUser.email, currentUser._id.toString());
      return res.status(200).json({
        userVerified: false,
        uid: currentUser._id.toString(),
      });
    }
  
    try {
      const hashedpassword = await bcrypt.hash(req.body.password, 10);
      const email = req.body.email;
      const username =req.body.username;
      const newUser = new User({
        email: email,
        password: hashedpassword,
        username : username,
        role:req.body.role,
      });
  
      await newUser.save();
      generateOtp(email, newUser._id.toString());
  
      res.status(200).json({
        userVerified: false,
        uid: newUser._id.toString(),
      });
  
      logger.info(`User created: ${email}`, { meta: { method: "register" } });
    } catch (err) {
      res.status(500).json({
        userVerified: false,
      });
      logger.error(`${err}`, { meta: { method: "register" } });
    }
  };

  // export const RegisterGoogle=async(req,res)=>{
  //   const {username , email }=req.body;
  //   const currentUser = await User.findOne({ email: req.body.email });

  //   if (currentUser && currentUser.confirmed)
  //     return res.status(201).json({
  //       userVerified: true,
  //     });

  //     if (currentUser && !currentUser.confirmed) {
  //       generateOtp(currentUser.email, currentUser._id.toString());
  //       return res.status(200).json({
  //         userVerified: false,
  //         uid: currentUser._id.toString(),
  //       });
  //     }
      
  //   console.log(email);
  
  //   try {
  //    // Create a new User instance using the User model
  //    const password='sdkjhjkdsfddsf'
  //    const confirmed=true
  //    const newUser = new User({
  //      username,
  //      email,
  //      password,
  //      confirmed,

  //    });
  
  //    // Save the new user to the database
  //    await newUser.save();
  //    generateOtp(email, newUser._id.toString());

  //    res.status(200).json({
  //     userVerified: false,
  //     uid: newUser._id.toString(),
  //   });
  //   logger.info(`User created: ${email}`, { meta: { method: "RegisterGoogle" } });
  
    
  //  } catch (error) {
  //    console.error('Error creating user:', error);
  //    res.status(500).json({ error: 'Failed to create user' });
  //  }
  
  // }


  
export const login = async (req, res) => {
 
    try{
          const user = await User.findOne({ email: req.body.username });
        
          if (user === null) {
            return res.status(400).json({
              userExists: false,
            });
          }
        
          if (!user.confirmed) {
            return res.status(401).json({
              uid:user._id.toString(),
              userExists: true,
              userVerified: false,
            });
          }
        
          try {
            if (await bcrypt.compare(req.body.password, user.password)) {
              const params = {
                uid: user._id.toString(),
              };
        
              const newAccessToken = jwt.sign(params, process.env.SECRET, {
                expiresIn: "15m",
              });
        
              const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
                expiresIn: "30d",
              });
        
              generateDatabaseToken(user._id.toString(), newRefreshToken);
              
        
              res.cookie("refreshToken", newRefreshToken, {
                // httpOnly: true,
                // sameSite: "none",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
        
              res.cookie("accessToken", newAccessToken, {
                // httpOnly: true,
                // sameSite: "none",
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 15 mins
              });

              
        
              res.status(200).json({
                userExists: true,
                userVerified: true,
                accessToken: newAccessToken,
                uid:user._id.toString(),
                role:user.role,
              });
            } else {
              logger.warn("User creds wrong", { meta: { method: "login" } });
              res.status(401).json({
                userExists: true,
                userVerified: true,
                isPasswordTrue: false,
              });
            }
          } catch (err) {
            logger.error(err, { meta: { method: "login" } });
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
    
  };
  
  export const dashboard = async (req, res) => {
    try {
      const authHeaders = req.headers["authorization"];
      const clientAccessToken = authHeaders && authHeaders.split(" ")[1];
      // const clientAccessToken = req.cookies['accessToken']
      // logger.info(clientAccessToken, { method: 'dashboard' })
      if (!clientAccessToken) {
        return res.status(401).json({
          authenticated: false,
        });
      }
  
      const payload = jwt.verify(clientAccessToken, process.env.SECRET);
  
      if (!payload) {
        return res.status(401).json({
          authenticated: false,
        });
      }
  
      const user = User.findOne({ _id: payload.uid });
  
      if (!user) {
        return res.status(401).json({
          authenticated: false,
          userExists: false,
        });
      }
  
      res.status(200).json({
        authenticated: true,
      });
    } catch (err) {
      logger.error(`${err}`, { meta: { method: "dashboard" } });
      res.status(500).json({
        authenticated: false,
        userExists: false,
      });
    }
  };
  

  export const foregtPassword=async(req,res)=>{

  }
 



  export const refresh = async (req, res) => {
    try {
      const { id } = req.params;
      const refreshToken = req.cookies["refreshToken"];

  
      if (!refreshToken) {
        logger.warn("RefreshToken deleted", { meta: { method: "refresh" } });
        return res.status(400).json({
          authenticated: false,
          tokenExists: false,
        });
      }
      const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const userid=refreshPayload.uid
    console.log(userid)
      if (!verifyRefreshToken(userid ,refreshToken )) {
        logger.warn("Refresh tokens does not match", {
          meta: { method: "refresh" },
        });
        return res.status(401).json({
          authenticated: false,
        });
      }
  
      // cc
  
      // if (!refreshPayload) {
      //   return res.status(401).json({
      //     authenticated: false,
      //   });
      // }
  
      const params = {
        uid: userid,
      };
      const newAccessToken = jwt.sign(params, process.env.SECRET, {
        expiresIn: "15m",
      });
  
      const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
      });
  
      generateDatabaseToken(id, newRefreshToken);
  
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
        maxAge: 15 * 60 * 1000, // 15 mins
      });
  
      res.status(200).json({
        authenticated: true,
        accessToken: newAccessToken,
        refreshToken:newRefreshToken,
      });
    } catch (err) {
      logger.error(err, { meta: { method: "refresh" } });
      return res.status(401).json({
        authenticated: false,
      });
    }
  };
  
  
  export const verifyRefreshToken=async (userId,clientRefreshToken)=>{
    try{
          const databaseToken = await RefreshToken.findOne({
            userId: userId,
          });
              if (!databaseToken) {
                return false;
              } else if (databaseToken.refreshToken === clientRefreshToken) {
                return true;
              }
    } catch (err) {
      logger.error(err, { meta: { method: "verifyRefreshToken" } });
    }
  }
  
  // creates new refresh token or updates the current refresh token into the database
  export const generateDatabaseToken = async (userId, refreshToken) => {
    try {
      const currentRefreshToken = await RefreshToken.findOne({ userId: userId });
  
      if (currentRefreshToken === null) {
        const newDatabaseToken = new RefreshToken({
          refreshToken: refreshToken,
          userId: userId,
        });
  
        newDatabaseToken.save();
      } else {
        await RefreshToken.updateOne(
          { userId: userId },
          { refreshToken: refreshToken },
        );
      }
    } catch (err) {
      logger.error(err, { meta: { meta: { method: "generateDatabaseToken" } } });
    }
  };
  
  export const logout = async (req, res) => {
    res.cookie("refreshToken", "", {
      maxAge: 0,
    });
    res.cookie("accessToken", "", {
      maxAge: 0,
    });
    res.status(200).json({
      authenticated: false,
      accessToken: "",
    });
  };

 

  ////google
 

  export const setPasswordandRole=async(req,res)=>{
    try{
      const {id}=req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
     
        user.role = req.body.role;
      
  
      
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedpassword;
      
  
      await user.save();
      logger.info(`User updated: `, { meta: { method: "setPasswordandRole" } });
      res.status(200).json({user});
    }
    catch(err){
      logger.error(err, { meta: { method: "setPasswordandRole" } });
      console.log(err);
    }
  }

  export const setPassword=async(req,res)=>{
    try{
      const {id}=req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
     
       
      
  
      
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedpassword;
      
  
      await user.save();
      logger.info(`User updated: `, { meta: { method: "setPasswordandRole" } });
      res.status(200).json({user});
    }
    catch(err){
      logger.error(err, { meta: { method: "setPasswordandRole" } });
      console.log(err);
    }
  }



 export const LoginUserGoogle = async (req, res) => {
    try {
      const { email, username } = req.body;
      console.log(email);
      const user = await User.findOne({ email: email });
  
      if (user) {
        
          // const token=signToken({payload:foundUser._id})  ;
          // console.log(token);
          const params = {
            uid: user._id.toString(),
          };
          // res.status(200).json({ UserId: foundUser._id  });

          const newAccessToken = jwt.sign(params, process.env.SECRET, {
            expiresIn: "15m",
          });
    
          const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
            expiresIn: "30d",
          });
    
          generateDatabaseToken(user._id.toString(), newRefreshToken);
          
    
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
            maxAge: 15 * 60 * 1000, // 15 mins
          });
    
          res.status(200).json({
            userExists: true,
            userVerified: true,
            accessToken: newAccessToken,
            uid:user._id.toString(),
            role:user.role,
          });
      } else {
       return res.status(401).json({ error: 'User not found or unauthorized' });
      }
    } catch (error) {
      console.error('Error in LoginUser:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

 export const RegisterGoogle=async(req,res)=>{
    const {username , email }=req.body;
    const currentUser = await User.findOne({ email: req.body.email });

    if (currentUser)
    {   
      const params = {
        uid: currentUser._id.toString(),
      };

      const newAccessToken = jwt.sign(params, process.env.SECRET, {
        expiresIn: "15m",
      });

      const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
        expiresIn: "30d",
      });

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
        maxAge: 15 * 60 * 1000, // 15 mins
      });

         res.status(201).json({
          userVerified: true,
          role:currentUser.role,
          uid:currentUser._id.toString(),
        });

    }
    else{
            try {
          // Create a new User instance using the User model
          const password='sdkjhjkdsfddsf'
          const confirmed=true
          const newUser = new User({
            username,
            email,
            password,
            confirmed:true,

          });
        
          // Save the new user to the database
          await newUser.save();
          

        res.status(200).json({
            userVerified: false,
            uid: newUser._id.toString(),
          });

          logger.info(`User created: ${email}`, { meta: { method: "RegisterGoogle" } });
        
          
        } catch (error) {
          console.error('Error creating user:', error);
          res.status(500).json({ error: 'Failed to create user' });
        }
    }
  }




export const registerFacebook=async(req,res)=>{
    const { username, email } = req.body;
    
  try {
      const user = await User.findOne({ email: email });

        if(user==null){
          const password = 'sdkjhjkdsfddsf'; // You may generate a secure password
            
            const newUser = new User({
              username,
              email,
              password,
              confirmed:true,
            });
            await newUser.save();
            res.status(200).json({
              userVerified: false,
              uid: newUser._id.toString(),
            });
  
            logger.info(`User created: ${email}`, { meta: { method: "registerFacebook" } });
        }
        else{

          const params = {
            uid: user._id.toString(),
          };
    
          const newAccessToken = jwt.sign(params, process.env.SECRET, {
            expiresIn: "15m",
          });
    
          const newRefreshToken = jwt.sign(params, process.env.REFRESH_SECRET, {
            expiresIn: "30d",
          });
          generateDatabaseToken(user._id.toString(), newRefreshToken);
          console.log(newAccessToken);
          res.cookie("refreshToken", newRefreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
    
          res.cookie("accessToken", newAccessToken, {
            maxAge: 15 * 60 * 1000, // 15 mins
          });

          
    
          res.status(200).json({
            userExists: true,
            userVerified: true,
            accessToken: newAccessToken,
            uid:user._id.toString(),
          });



    }     
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
      }
  }


export const checkifValidchange=async(req,res)=>{
    try{
        const { id } = req.params;
        const accessToken = req.cookies["accessToken"];
        let payload= jwt.verify(accessToken, process.env.SECRET);
        if(payload.uid==id){
          res.status(200).json({
            verify:true,
          })
        }
        else{
          res.status(200).json({
            verify:false,
          })
        }

    }
    catch(err){
      logger.error(err, { meta: { method: "refresh" } });
      console.log(err);
    }

  }
