import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    title: String,
    description: String,
    url: String,
    image: String,
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'child',
    }],


    count: {
        coin: Number,
        session: Number
    },
    date: {
        start: Number,
        total: Number,
        end: Number
    },

    completion: { type: Boolean, default: false },

    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('courses', schema);