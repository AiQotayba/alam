import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', },
    name: String,
    age: String,
    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('child', schema);