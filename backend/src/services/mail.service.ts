import {Resend} from "resend";
import "dotenv/config";

const resend = new Resend (process.env.RESEND_API_KEY);

const from = process.env.SENDER!

export const sendInviteEmail =async(email:string, first_name: string , inviteLink: string, ) =>{ 
    const {data, error} =await resend.emails.send({
  from,
  to:  email , // ["delivered@resend.dev"],
  subject: "You've been invited to join BookMe",
  html: `<h1>Hi, ${first_name}!</h1><p>Click <a href="${inviteLink}">here</a> to set up your account. Link expires in 24hours.</p>`,
  text: `You're invited to join BookMe as a staff member! Visit the link to set up your account: ${inviteLink}`,
});

if (error) {
  console.error(`Error sending email to ${email}:`, error)
    return {status:400, success:false, message: "Error delivering staff invite email"}
}
console.log("Email sent, Resend ID:", data!.id)
return {status:200, success:true, message: `Staff invite email delivered successfully`, data, emailId: data.id!}
}