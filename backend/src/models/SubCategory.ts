import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
    name: string;
    category: mongoose.Types.ObjectId;
    offerPercent?: number;   // ✅ Only sub-category offer
}

const SubCategorySchema = new Schema<ISubCategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        offerPercent: {
            type: Number,
            min: 1,
            max: 90
        }
    },
    {
        timestamps: true
    }
);


SubCategorySchema.index({ name: 1, category: 1 });

export default mongoose.model<ISubCategory>(
    "SubCategory",
    SubCategorySchema
);
