import { userActivatedEmailTemplate, userActivationLinkTemplate } from "./emailTemplate.js";
import { emailTransporter } from "./transport.js";

export const userActivationLink = async (obj) => {
  const transporter = emailTransporter();
  const info = await transporter.sendMail(userActivationLinkTemplate(obj));
  return info.messageId;
};
export const userActivatedLoginLink = async (obj) => {
  const transporter = emailTransporter();
  const info = await transporter.sendMail(userActivatedEmailTemplate(obj));
  return info.messageId;
};
