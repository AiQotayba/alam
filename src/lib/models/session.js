import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    course_id: String,
    title: String,
    time_start: String,
    date_start: String,
    completion: { type: Boolean, default: false },

    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('sessions', schema);
