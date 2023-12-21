import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    title: String,
    bio: String,
    image: String,
    price: String,
    duration: String,
    register: String,
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    phone: Number,
    part: [{
        title: String,
        about: String,
        Sort: Number,
        typeView: String,
        image: String,
    }],
    sort: Number,
    display:Boolean,

    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('course-ads', schema);