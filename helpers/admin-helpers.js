const db=require('../dbconnection/connection');
const collections=require('../dbconnection/collections');
const bcrypt=require('bcrypt');
const objectId=require('mongodb').ObjectId;

module.exports={
    userverification:()=>{
        return new Promise(async(resolve,reject)=>{
            let requests=await db.get().collection(collections.Verification_COLLECTION).find().toArray()
            resolve(requests)
        })
    },
  userverificationaction:(uid)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collections.Verification_COLLECTION).deleteOne({_id:objectId(uid)})
            resolve()
        })
    },
    Userstatusupdate:(username,status)=>{
        return new Promise(async(resolve,reject)=>{
          if(status==='Rejected'){
            await db.get().collection(collections.USER_COLLECTION).updateOne({Username:username},{
              $unset:{
                Status:""
             }
      
           })
            resolve() 
          }else{
            await db.get().collection(collections.USER_COLLECTION).updateOne({Username:username},{
              $set:{
                Status:status
             }
           })
            resolve() 
          }
       
      
                              
          })
        
      }
}