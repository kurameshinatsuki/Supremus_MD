const {zokou}=require("../framework/zokou")


zokou({nomCom:"restart",categorie:"MON-BOT",reaction:"🆗"},async(dest,z,com)=>{
  
const{repondre,ms,dev,superUser}=com;

  if(!superUser)
  {
    return repondre("This command is for owner only");
  }

  const {exec}=require("child_process")

    repondre("*✨redémarrage...*");

  exec("pm2 restart all");
  

})
