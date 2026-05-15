const requiredEnvs = [
    "MONGO_URI",
    "JWT_SECRET",
    "SENDER_EMAIL",
    "EMAIL_PASSWORD",
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
] as const;

export function validateEnv() {
    const missing: string[] = [];
    for (const env of requiredEnvs) {
        if (!process.env[env]) missing.push(env);
    }
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
}
