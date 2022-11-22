const mongoose = require('mongoose')
const imageStoreSchema = mongoose.Schema({
image:{
type:String,
required:[true,'please add an Image']

}



},{
    timestamps:true
})
//Indexing

imageStoreSchema.index({text:'text'})

//wildcard indexing 
// goalSchema.index({"&**":'text'})



module.exports = mongoose.model('ImageStore',imageStoreSchema);