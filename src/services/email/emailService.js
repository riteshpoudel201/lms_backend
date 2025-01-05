import { userActivationLinkTemplate } from "./emailTemplate.js";
import { emailTransporter } from "./transport.js";

export const userActivationLink = async (obj) => {
  const transporter = emailTransporter();
  const info = await transporter.sendMail(userActivationLinkTemplate(obj));
  return info.messageId;
};
