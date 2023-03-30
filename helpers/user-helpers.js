var db=require('../dbconnection/connection');
var collections=require('../dbconnection/collections');
const bcrypt=require('bcrypt')
var otpgenerator=require('otp-generator');
var nodemailer=require('nodemailer');
const objectId=require('mongodb').ObjectId

module.exports={
    Signup:async(userData)=>{
      userData.Password=await bcrypt.hash(userData.Password,10)

        return new Promise(async(resolve,reject)=>{
            
            
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data)=>{
              console.log(data);  
              resolve()

                

                                
            })
            
        })
        
    },
    VerifyOtp:(mailid)=>{
        return new Promise(async(resolve,reject)=>{
            let otp=otpgenerator.generate(6,{upperCaseAlphabets:false,specialChars:false,lowerCaseAlphabets:false})

            var transporter =  nodemailer.createTransport({
              service: 'gmail',
              host: "smtp.ethereal.email",
              auth: {
                user: 'mirror.pvltd@gmail.com',
                pass: 'hdutmjcpavatkhfb'
              }
            });
            
            var mailOptions = {
              from: 'mirror.pvltd@gmail.com',
              to: mailid,
              subject: 'Verify Mirror registration using this otp.Dont share with anyone',
              text: otp
            };
            
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                
                console.log(error);
              } else {
                
                
                
                resolve({respo:true,otp:otp});
              }
            })
            
                
            
            
        })
    },
    Login:(userData)=>{
      return new Promise(async(resolve,reject)=>{
         
          let response={}
          let user=await db.get().collection(collections.USER_COLLECTION).findOne({ Emailid:userData.Email })
         
          if(user){
              bcrypt.compare(userData.Password,user.Password).then((status)=>{
                  if(status){
                      response.user=user
                      response.status=true;
                      resolve(response)
                  }
                  else{
                      resolve({status:false})
                  }

              })
          }else{
              resolve({status:false})
          }


      })
  },
  userSearch:(userName)=>{
    return new Promise(async(resolve,reject)=>{
       let user=await db.get().collection(collections.USER_COLLECTION).find({Username : {$regex: userName }}).toArray()

      if(user.length!=0){
        resolve({found:true,user})
      }
      else{
        resolve({found:false})
        
      }

    })
  },
  mailidSearch:(mailid)=>{
    return new Promise(async(resolve,reject)=>{
       let user=await db.get().collection(collections.USER_COLLECTION).find({Emailid : {$regex: mailid }}).toArray()

      if(user.length!=0){
        resolve({found:true})
      }
      else{
        resolve({found:false})
        
      }

    })
  },
  findalluser:()=>{
    return new Promise(async(resolve,reject)=>{
       let users=await db.get().collection(collections.USER_COLLECTION).find().toArray()

       
        resolve(users)
        
      

    })
  },  
  uploadPhotos:(photoDetails,username)=>{
    let photoObj={
      Title:photoDetails.title,
      Description:photoDetails.description,
      username:username,
      Like:0
    }
    return new Promise(async(resolve,reject)=>{
      await db.get().collection(collections.PHOTOS_COLLECTION).insertOne(photoObj).then((data)=>{
        resolve(data.insertedId)


      })
    })

  },
  findPhoto:(photoid)=>{
    return new Promise(async(resolve,reject)=>{
      let photos=await db.get().collection(collections.PHOTOS_COLLECTION).findOne({_id:objectId(photoid)})
      resolve(photos);
      
    })
  },
  viewPhotos:()=>{
    return new Promise(async(resolve,reject)=>{
      let photos=await db.get().collection(collections.PHOTOS_COLLECTION).find().toArray()
      resolve(photos)
    })
  },
  profile:(username)=>{
    return new Promise(async(resolve,reject)=>{
      let photos=await db.get().collection(collections.PHOTOS_COLLECTION).find({username:username}).toArray()
      resolve(photos)
    })
  },
  updatephoto:(photoid,photodetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collections.PHOTOS_COLLECTION).updateOne({ _id:objectId(photoid)},{
            $set:{
                Title:photodetails.Title,
                Description:photodetails.Description
            }
        }).then((response)=>{
            resolve()
        })
    })
    
},
  removePhoto:(photoid)=>{
    return new Promise(async(resolve,reject)=>{
      db.get().collection(collections.PHOTOS_COLLECTION).deleteOne({_id:objectId(photoid)}).then(()=>{
        resolve()
      })
      
    })
  },

  Message:(data,username)=>{
   
    var sender=username;
    var reciver=data.reciver;     
    let users=[sender,reciver]
    let usersrev=[reciver,sender]
    return new Promise(async(resolve,reject)=>{
        let chat=await db.get().collection(collections.MESSAGE_COLLECTION).findOne({$or:[{users:users},{users:usersrev}]})

        if(chat){
        
            db.get().collection(collections.MESSAGE_COLLECTION).updateOne({$or:[{users:users},{users:usersrev}]},{
               
                    $push:{"message":data}
                
            }).then(()=>{
                resolve()
            })
      
        }else{
            let msgObj={
               users:users,
              message:[data]
            }
            db.get().collection(collections.MESSAGE_COLLECTION).insertOne(msgObj).then((response)=>{
                resolve()
            })
           }
        
    })
},
Messagehistory:(sender,reciver)=>{
  let users=[sender,reciver]
  let usersrev=[reciver,sender]
  return new Promise(async(resolve,reject)=>{
      let chat=await db.get().collection(collections.MESSAGE_COLLECTION).findOne({$or:[{users:users},{users:usersrev}]})
      if(chat){
        resolve(chat.message)
      }
      else{
        resolve({chat:false})
      }
  })
},
FollowUser:(user,follow)=>{

  return new Promise(async(resolve,reject)=>{
      let following=await db.get().collection(collections.Following_COLLECTION).findOne({user:user})
      let followers=await db.get().collection(collections.Followers_COLLECTION).findOne({user:follow})
      if(followers){
        let presentfollowers=followers.followers
        if(!presentfollowers.includes(user)){
          await db.get().collection(collections.Followers_COLLECTION).updateOne({user:follow},{
               
          $push:{followers:user}
      
        })
        }
        
      }else{
        let followersobj={
          user:follow,
          followers:[user]
        }
         await db.get().collection(collections.Followers_COLLECTION).insertOne(followersobj)
      }
      if(following){
        let presentfollowing=following.following
        if(!presentfollowing.includes(follow)){
          db.get().collection(collections.Following_COLLECTION).updateOne({user:user},{
               
          $push:{following:follow}
      
        }).then(()=>{
           resolve({follow:true})
        })
        }else{
          resolve()
        }
        
      }else{
        let followingobj={
          user:user,
          following:[follow]
        }
        db.get().collection(collections.Following_COLLECTION).insertOne(followingobj).then(()=>{
          resolve({follow:true})
        })
      }
  })
},
unFollowUser:(user,unfollow)=>{

  return new Promise(async(resolve,reject)=>{
      let following=await db.get().collection(collections.Following_COLLECTION).findOne({user:user})
      let followers=await db.get().collection(collections.Followers_COLLECTION).findOne({user:unfollow})
     
        let presentfollowers=followers.followers
        let presentfollowing=following.following
        if(presentfollowers.includes(user)){
          await db.get().collection(collections.Followers_COLLECTION).updateOne({user:unfollow},{
               
          $pull:{followers:user}
      
        })
        }else{
          resolve()
        }
      
       
        if(presentfollowing.includes(unfollow)){
          db.get().collection(collections.Following_COLLECTION).updateOne({user:user},{
               
          $pull:{following:unfollow}
      
        }).then(()=>{
           resolve({unfollow:true})
        })
        }else{
          resolve()
        }  
  })
},
Followers:(username)=>{

  return new Promise(async(resolve,reject)=>{
    let followers=await db.get().collection(collections.Followers_COLLECTION).findOne({user:username})
      if(followers){
        resolve(followers.followers)
      }
      else{
        resolve([])
      }
  })
},
Following:(username)=>{

  return new Promise(async(resolve,reject)=>{
    let following=await db.get().collection(collections.Following_COLLECTION).findOne({user:username})
      if(following){
        resolve(following.following)
      }
      else{
        resolve([])
      }
  })
}
}

