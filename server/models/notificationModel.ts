import mongoose, { Document, Model } from 'mongoose';

export interface notificationSchemaType extends Document {
    // declare any instance methods here
    userTo: string;
    userFrom: string;
    notificationType: string;
    opened: boolean;
    entityId: string;
}

export interface notificationModelInterface extends Model<notificationSchemaType> {
    //  // declare any static methods here
    insertNotification(userTo: string, userFrom: string, notificationType: string, entityId: string): Promise<notificationSchemaType>;
}



const notificationSchema = new mongoose.Schema({
    userTo: { type: mongoose.Types.ObjectId, ref: "User" },
    userFrom: { type: mongoose.Types.ObjectId, ref: "User" },
    notificationType: String,
    opened: { type: Boolean, default: false },
    entityId: mongoose.Types.ObjectId // 이것은 만약 어떤사람이 follow버튼을 누르면 follow에관한 entity가 되고 like를 누르면 like를 누른 user의 entity가 되는 그런 역할을 한다.

}, {
    timestamps: true
});

notificationSchema.statics.insertNotification = async (userTo: string, userFrom: string, notificationType: string, entityId: string) => {
    const data = {
        userTo: userTo,
        userFrom: userFrom,
        notificationType: notificationType,
        entityId: entityId,
    };
    try {
        await Notification.deleteOne(data)
    } catch (error) {
        console.log("Error: ", error)
    }


    return Notification.create(data as notificationSchemaType).catch(error => console.log('Error: ', error));
}

const Notification: notificationModelInterface = mongoose.model<notificationSchemaType, notificationModelInterface>("Nofification", notificationSchema);

export default Notification;