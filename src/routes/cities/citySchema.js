const mongoose = require ("mongoose");
const Schema = mongoose.Schema

const CitySchema = new Schema({
    city:{
        type:String,
        required: [true, 'please provide a city name']
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    longt:{
        type:Number,
        // required:[true, 'please provide a longitude']
    },
    latitude:{
        type:Number,
        // required:[true, 'please provide a latitude']
    }

})

const CityModel = mongoose.model('city', CitySchema)
module.exports = CityModel