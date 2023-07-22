import mongoose from 'mongoose';

const { DB: DBname } = process.env && process.env

export const connect = async () => {
    try {
        mongoose.connect(DBname)
            .then(() => {
                console.log("Database connected!");
            })
    } catch (err) {
        console.error("Something went wrong connecting to database");
        console.error(err);
    }
}

// DBmodels

import user from "@/lib/models/user";
export const User = user

import courses from "@/lib/models/courses";
export const Courses = courses

import session from "@/lib/models/session";
export const Session = session

import child from "@/lib/models/child";
export const Child = child

import attendance from "@/lib/models/attendance";
export const Attendance = attendance
