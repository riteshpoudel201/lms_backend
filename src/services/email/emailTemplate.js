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

export const userActivatedEmailTemplate = ({ email, name, url }) => {
  const message = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Action Required - Activate your new account.",
    text: `Hello ${name}, your account has been successfully activated and you may proceed to login using url below./n ${url}`,
    html: `<p>Hello , ${name}</p>
<br/>
<p>Your account has been activated. Click the button below to login to your account.</p>
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

export const otpNotificationEmailTemplate = ({ email, name, otp }) => {
  const message = {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your One-Time Password (OTP) for Verification",
    text: `Hello ${name},\n\nYour One-Time Password (OTP) for verification is: ${otp}.\n\nThis OTP is valid for 10 minutes. Please do not share it with anyone.\n\nWith Regards,\nLibrary Management System`,
    html: `<p>Hello ${name},</p>
<br/>
<p>Your One-Time Password (OTP) for verification is:</p>
<h2 style="color: green; font-size: 2rem; font-weight: bold;">${otp}</h2>
<br/>
<p>This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
<br/>
<p>With Regards,</p>
<p><strong>Library Management System</strong></p>`,
  };
  return message;
};
