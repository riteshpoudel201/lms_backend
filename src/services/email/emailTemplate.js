export const userActivationLinkTemplate = ({ email, name, url }) => {
  const message = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Action Required - Activate your new account.",
    text: `Hello ${name}, follow the link to activate your account. ${url}`,
    html: `<p>Hello , ${name}</p>
<br/>
<p>Your account has been created. Click the button below to activate your account.</p>
<a href=${url}>
<button style="background: green; color:white; padding: 2rem 1rem">Activate Now</button></a>
<br/>
<br/>
With Regards,
Library Management System
`,
  };
  return message;
};
