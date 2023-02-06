const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url="mongodb+srv://Anandhu:688541@cluster0.a3tzjdd.mongodb.net/?retryWrites=true&w=majority"
    // const url='mongodb://127.0.0.1:27017'
    const dbname='mirror'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)

        state.db=data.db(dbname)
        done()

    })

    
}

module.exports.get=function(){
    return state.db
}