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
    }
}