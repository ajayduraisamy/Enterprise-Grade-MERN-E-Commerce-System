import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    mobile: string;
    address: string;
    pincode: string;
    role: "user" | "admin";

    cart: {
        product: mongoose.Types.ObjectId;
        quantity: number;
    }[];
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        mobile: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 10
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        pincode: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 6
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        
        cart: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", UserSchema);
