import nodemailer from "nodemailer";

export const emailRegistry= async (data)=>{
    const {email,name,token} =data;

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_URL,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    });

    const info = await transport.sendMail({
        from:'"Project-Manager" <accounts@projects.com>',
        to:email,
        subject:"Project Manager - Validate your account",
        text:"Validate your account in Project Manager",
        html:`<p>Hi ${name}:</p>
        <p>Your account is almost ready to use, confirm in the next link: <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Account</a></p>
        <br/>
        <p>If you did not create this account, ignore this message.</p>`
    });
};

export const emailRecoverPass= async(data)=>{
    const {email,name,token} =data;

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_URL,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
    });

    const info = await transport.sendMail({
        from:'"Project-Manager" <accounts@projects.com>',
        to:email,
        subject:"Project Manager - Change and recover your password",
        text:"Recover your password",
        html:`<p>Hi ${name}:</p>
        <br/>
        <p>To reset your password use the link below: <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Recover Password</a></p>
        <br/>
        <p>If you did not ask to recover your password, ignore this message.</p>`
    });
};