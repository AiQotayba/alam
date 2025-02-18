import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    child_id: { type: mongoose.Schema.Types.ObjectId, ref: 'child', },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sessions', },

    feedback: String,
    absence: { type: Boolean, default: false },
    view: Boolean,
    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('attendance', schema);