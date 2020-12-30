import { UserSchemaType } from './userModel';
import { ChatSchemaType } from './chatModel';

import mongoose from 'mongoose';

export interface ChatMessageSchemaType extends Document {
    _id: string;
    sender: UserSchemaType,
    content: string,
    chat: ChatSchemaType,
    readBy: UserSchemaType[],
}

const chatMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, {
    timestamps: true
}
);

const Message = mongoose.model("Message", chatMessageSchema);
export default Message;