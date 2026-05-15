import AuditLog from "../models/AuditLog";

interface AuditParams {
    adminId: string;
    action: "CREATE" | "UPDATE" | "DELETE";
    resource: string;
    resourceId?: string;
    details?: Record<string, unknown>;
    ip?: string;
}

export const logAudit = async (params: AuditParams) => {
    try {
        await AuditLog.create({
            admin: params.adminId,
            action: params.action,
            resource: params.resource,
            resourceId: params.resourceId,
            details: params.details || {},
            ip: params.ip
        });
    } catch (err) {
        console.error("Audit log error:", err);
    }
};
