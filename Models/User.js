const mongoose = require('mongoose');
const  Schema  = mongoose.Schema;

const UserShema= new Schema({
    name:{
    type: String,
    require: true,
},
email:{
    type:String,
    require:true,
    unique:true
},
password:{
    type:String,
    require:true
},
role:{
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
    }
});
const UserModel = mongoose.model('user',UserShema);
module.exports = UserModel