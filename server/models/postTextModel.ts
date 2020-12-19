import mongoose, { Document } from 'mongoose';

export interface postSchemaType extends Document {
    content: string;
    postedBy: string;
    pinned?: boolean;
    likes: string[];
    replies: replySchemaType[];
}

export interface replySchemaType {
    repliedBy: string;
    comment: string;
}

const replySchema = new mongoose.Schema({
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true }
}, {
    timestamps: true,
})

const postSchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pinned: Boolean,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],

}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

export default Post;