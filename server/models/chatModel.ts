import { MessageSchemaType } from './messageModel';
import { UserSchemaType } from './userModel';
import mongoose, { Document } from 'mongoose';

export interface ChatSchema extends Document {
    chatName: string;
    isGroupChat: boolean;
    users: UserSchemaType[];
    latestMessage: MessageSchemaType[];
}

const chatSchema = new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

}, {
    timestamps: true
}
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;