export const activationTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Activate Your Account</title>
</head>

<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">

<tr>
<td style="background:#4f46e5;padding:20px;text-align:center;color:white;font-size:22px;font-weight:bold;">
Yobae
</td>
</tr>

<tr>
<td style="padding:40px 30px;color:#333;line-height:1.6;text-align:center;">

<h2 style="margin-top:0;">Hello {{name}} 👋</h2>

<p>
Thank you for signing up for <strong>Yobae</strong>.
Please confirm your email address to activate your account.
</p>

<div style="margin:35px 0;">
<a href="{{activationLink}}"
style="
background:#4f46e5;
color:#ffffff;
padding:14px 28px;
text-decoration:none;
border-radius:6px;
font-weight:bold;
display:inline-block;
font-size:16px;
">
Activate Your Account
</a>
</div>

</td>
</tr>

<tr>
<td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#888;">
© ${new Date().getFullYear()} Yobae. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
