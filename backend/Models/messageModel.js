const mongoose = require ('mongoose')
 const messageSchema = mongoose.Schema({
    from:{
        type:String,
        required:[true,'messages must come from a particular logged in student '],
        ref:'Student'
    },
to:{
type:String,
},
message: {
    type: String,
    required:[true,'message destination should be provided']

  },

 }, 
 
 {

    timestamps:true
 })

 messageSchema.index({to:'text'})

 module.exports = mongoose.model('Message',messageSchema);