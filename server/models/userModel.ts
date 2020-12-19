import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "profilePic.png" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
}, {
    timestamps: true
}
);

const User = mongoose.model("ChatUser", userSchema);
export default User;