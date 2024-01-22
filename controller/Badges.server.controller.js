import { DeveloperProfile } from "../model/DeveloperProfile.js"
import { logger } from "../utils/logger.util.js";


export const updateRatingAndBadgesOfDeveloper=async(id,rate)=>{

    try{
            const userfound=await DeveloperProfile.findOne({userId:id});

            let frating=userfound.rating;
            
            if(Number(rate)==0){
                 frating=frating-5;
            }
            else if(Number(rate)==1){
                frating=frating+2;
            }
            else if(Number(rate)==2){
                frating=frating+4;
            }
            else if(Number(rate)==3){
                frating=frating+6;
            }
            else if(Number(rate)==4){
                frating=frating+8;
            }
            else{
                frating=frating+10;
            }
            

            // urating=Number(urating)+Number(rate);
            let ubadge;
            if(frating>150){
                ubadge="Recommended";
            }
            else if(frating>100){
                ubadge="Platinum";
            }
            else if(frating>50){
                ubadge='Gold';
            }
            else if(frating>20){
                ubadge='Silver';
            }
            else{
                ubadge='Bronze';
            }
        
        let urating=""+frating+"";
            const updatedProfile = await DeveloperProfile.findOneAndUpdate(
                { userId: id },
                { rating: frating , badges: ubadge },
                { new: true } // Return the updated document
            );
        
            if (updatedProfile) {
                // Successfully updated the profile, you can do further processing here
                console.log("Updated DeveloperProfile:", updatedProfile);
            } else {
                // Handle the case where the profile was not found or the update failed
                console.error("DeveloperProfile not found or update failed");
            }
            logger.info(`User upadted: `, { meta: { method: "updateRatingAndBadgesOfDeveloper" } });
    
    }
    catch(err){
        logger.error(`${err}`, { meta: { method: "updateRatingAndBadgesOfDeveloper" } });
    }
  



}