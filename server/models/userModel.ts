import mongoose, { Document } from 'mongoose';

export interface UserSchemaType extends Document {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    profilePic: string;
    likes: string[];
    following: string[];
    followers: string[];
}

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "profilePic.png" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
}
);

const User = mongoose.model("User", userSchema);
export default User;