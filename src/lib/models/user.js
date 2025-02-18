import mongoose, { Schema } from 'mongoose';

let schema = new Schema({
    fullname: String,
    email: { type: String },
    phone: { type: String },
    password: String,

    coins: { type: Number, default: 0 },

    verification: {
        state: { type: Boolean, default: false },
        code: { type: Number, default: null },
    },

    typeUser: { type: [String], default: ["family"], enum: ["admin", "teacher", "family"] },

    create_at: { type: Number, default: new Date() },
});

mongoose.models = {};
export default mongoose.model('user', schema);