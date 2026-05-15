import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
    admin: mongoose.Types.ObjectId;
    action: "CREATE" | "UPDATE" | "DELETE";
    resource: string;
    resourceId?: string;
    details: Record<string, unknown>;
    ip?: string;
    createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["CREATE", "UPDATE", "DELETE"], required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now }
});

AuditLogSchema.index({ admin: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1 });

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
