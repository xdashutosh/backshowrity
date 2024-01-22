
import { getAllAcoountDetailsByDeveloperId, getAllAcoountDetailsByHireId, getBalancedByID } from "./controller/Account.server.controller.js";
import { ShowAllAssignedProjectsByParticularHire, ShowAllAssignedProjectsToParticularDeveloper, getallCompleteProjectByProjectId, getallCompleteProjectByUserId } from "./controller/Assignment.server.controller.js";
import { StoreBlogsData,deleteblog,getAllBlogsData, getAllBlogsDataByID } from "./controller/Blogs.server.controller.js";
import { CreateNotificationwithAccountedtails, SendNotificationtoAdmin, getNotificationwithAccountedtails } from "./controller/ContactUs.server.controller.js";
import { CreateDeveloperProfile, CreateHireProfile, SearchDeveloperbyTechnologyAndName, ShowAllDeveloperProfile, ShowAllHireProfile, showAllPost, showCompanyProfileById, showDeveloperProfileById, updatePhoto } from "./controller/DeveloperProfiel.server.controller.js";
import { ShowAllPostByHire, allProjectAplliedByDeveloper } from "./controller/Hire.server.controller.js";
import { GetAllNotificationton, GetNotificationByAdmin, LoginAdmin, PostNotificationByAdmin, checktoken, deleteNotificationByAdmin, getFirstPay, setFirstPay } from "./controller/auth.server.admincontroller.js";
import {
    register,
    login,
    logout,
    refresh,
    dashboard,
    RegisterGoogle,
    LoginUserGoogle,
    registerFacebook,
    setPasswordandRole,
    resetPassword,
    setPassword,
  checkifValidchange
} from "./controller/auth.server.controller.js";
  
  import {
    resendOtp,
    verifyOtp,
  } from "./controller/otp.server.controller.js";
import { checkout, checkout90, getRazorKey, paymentVerification, paymentVerification90 } from "./controller/payment.server.controller.js";
import { CreateProject, GetDevelopersByProjectID, GetProjectDetialsByProjectID, SearchProjectbyTechnology, SearchProjectbyTechnologyAndCompany, TaskApply } from "./controller/project.server.controller.js";
import { getSettingDataByID, getidOfDeveloper } from "./controller/user.server.controller.js";
import { gettoken, sendMessage, settoken } from "./controller/Tokencontroller.js";
import { logincontroller, signupcontroller } from "./controller/Authadmin.js";

  
//   import { createSession } from "../controller/session/session.server.controller.js";
  
 export const routes = (router) => {
    router.post("/0auth/register", register);
    router.post("/0auth/login", login);
    router.post("/0auth/logout", logout);
    router.post("/0auth/refresh/:id", refresh);
    router.post("/0auth/verifyOtp", verifyOtp);
    router.post("/0auth/resendOtp", resendOtp);
    router.post("/0auth/LoginGoogle", LoginUserGoogle);
    router.post("/0auth/RegisterGoogle", RegisterGoogle);
    router.post('/0auth/registerfacebook',registerFacebook)


    router.post("/0auth/dashboard", dashboard);
    router.get(`/0auth/getDetailsByID/:id`,getSettingDataByID );
    router.post('/0auth/createProject/:id',CreateProject);
    router.post('/0auth/taskApply/:id',TaskApply);
    router.get('/0auth/GetDevelopersByProjectID/:id',GetDevelopersByProjectID);
    // router.post("/0session/createSession", createSession);
     router.get('/0auth/ShowAllPostByHire/:id',ShowAllPostByHire);

     router.get('/0auth/allProjectAplliedByDeveloper/:id',allProjectAplliedByDeveloper);
     
     router.post('/0auth/CreateDeveloperProfile/:id',CreateDeveloperProfile);
     router.post('/0auth/CreateHireProfile/:id',CreateHireProfile);

     router.get('/0auth/ShowAllHireProfile',ShowAllHireProfile);

     router.get('/0auth/ShowAllDeveloperProfile',ShowAllDeveloperProfile);
     router.get('/0auth/showDeveloperProfileById/:id',showDeveloperProfileById);
     router.put('/0auth/updateProfileById/:id',updatePhoto);
     router.get('/0auth/showCompanyProfileById/:id',showCompanyProfileById);


     router.get('/0auth/showAllPost',showAllPost)

    //  router.get('0auth/showallPosttoParticularuserrating/:id',showallPostAccordingtoUser)


     router.post('/0auth/SendNotificationtoAdmin',SendNotificationtoAdmin);
     
     router.get('/0auth/GetProjectDetialsByProjectID/:id',GetProjectDetialsByProjectID);

     router.get('/0auth/GetAllNotification',GetAllNotificationton);

    router.get('/0auth/getidOfDeveloper',getidOfDeveloper);
    router.post('/0auth/setPasswordandRole/:id',setPasswordandRole);

    // blogs 
    router.post('/0auth/AddBlogs',StoreBlogsData);
    router.get('/0auth/getAllBlogs',getAllBlogsData);
    router.get('/0auth/getAllBlogsByID/:id',getAllBlogsDataByID);
    router.get('/0auth/SearchProjectbyTechnology',SearchProjectbyTechnology)
    router.get('/0auth/SearchProjectbyTechnologyAndCompany',SearchProjectbyTechnologyAndCompany);
    router.get('/0auth/SearchDeveloperbyTechnologyAndName',SearchDeveloperbyTechnologyAndName);
    router.delete("/0auth/deleteblog/:id",deleteblog);
    router.post('/0auth/NotifyUser/:id',PostNotificationByAdmin);
  router.get('/0auth/getNotification/:id',GetNotificationByAdmin);

  // payment
  router.post('/0auth/checkout' ,checkout);
  router.post('/0auth/paymentverification' ,paymentVerification);
  router.get('/0auth/getrazerkey',getRazorKey);

  router.post('/0auth/checkout90' ,checkout90);
  router.post('/0auth/paymentverification90' ,paymentVerification90);



  router.post('/0auth/setFirstPay',setFirstPay);
  router.get('/0auth/getFirstPay',getFirstPay);


  router.get('/0auth/ShowAllAssignedProjectsByParticularHire/:id',ShowAllAssignedProjectsByParticularHire)
  router.get('/0auth/ShowAllAssignedProjectsToParticularDeveloper/:id',ShowAllAssignedProjectsToParticularDeveloper)

   router.get('/0auth/getallCompleteProjectByProjectId/:id',getallCompleteProjectByProjectId);

   router.get('/0auth/getallCompleteProjectByUserId/:id',getallCompleteProjectByUserId)

   //Acount details
   router.get('/0auth/getAllAcoountDetailsByDeveloperId/:id',getAllAcoountDetailsByDeveloperId);
   router.get('/0auth/getAllAcoountDetailsByHireId/:id',getAllAcoountDetailsByHireId);
   router.get('/0auth/getBalancedByID/:id',getBalancedByID);


   router.post('/0auth/forgetPassword',resetPassword);
   router.post('/0auth/setPassword/:id',setPassword);



   //admin
   router.post('/0auth/AdminLogin',LoginAdmin);
   router.get('/0auth/check',checktoken);
   router.delete(`/0auth/deleteNotification/:id`,deleteNotificationByAdmin);
   
 //Money
 router.post('/0auth/sendNotificationwithAccountedtails/:id',CreateNotificationwithAccountedtails);
 router.get('/0auth/getNotificationwithAccountedtails',getNotificationwithAccountedtails);
 router.get('/0auth/checkifValidchange/:id',checkifValidchange);

 //Push Nottification
 router.post("/0token/sendmsg",sendMessage);
 router.post("/0token/settoken",settoken);
 router.get("/0token/gettoken",gettoken);

 //Login signup for AdminPanel

 router.post("/0api/signup",signupcontroller);
 router.post("/0api/login",logincontroller);


  }; 

