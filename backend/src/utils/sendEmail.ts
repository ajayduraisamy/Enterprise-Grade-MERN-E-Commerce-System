import nodemailer from "nodemailer";

export const sendEmail = async (
    to: string,
    subject: string,
    html: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"MERN Ecommerce" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html
        });

        console.log(" Verification email sent");

    } catch (err) {
        console.error(" Email Error:", err);
        throw new Error("Email sending failed");
    }
};
