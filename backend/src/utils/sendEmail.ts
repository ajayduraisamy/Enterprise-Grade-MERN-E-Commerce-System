import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
    retries = 2
) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await transporter.sendMail({
                from: `"LuxeCart" <${process.env.SENDER_EMAIL}>`,
                to,
                subject,
                html
            });
            return;
        } catch (err) {
            console.error(`Email attempt ${attempt}/${retries} failed:`, err);
            if (attempt === retries) throw new Error("Email sending failed after retries");
            await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
    }
};
