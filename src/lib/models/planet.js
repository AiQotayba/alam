


import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    image: String,
    name: String,
    description: String,
    courses: [String],
    active: Boolean,
    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('planet', schema);