export function clientWelcomeEmail({
  firstName,
  clientReference,
}: {
  firstName: string
  clientReference: string
}) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="40">
<tr>
<td align="center">

<table width="620" style="background:white;border-radius:18px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,.08);">

<tr>
<td style="background:#0f172a;padding:40px;text-align:center;">

<h1 style="margin:0;color:white;">
POG Advisory
</h1>

<p style="margin-top:10px;color:#cbd5e1;">
Client Portal
</p>

</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin-top:0;">
Welcome, ${firstName}
</h2>

<p>
Your client portal has been created successfully.
</p>

<p>
Use the reference below whenever you sign in.
</p>

<div style="
margin:35px 0;
padding:25px;
background:#eff6ff;
border-radius:14px;
text-align:center;
">

<div style="
font-size:13px;
color:#64748b;
text-transform:uppercase;
letter-spacing:2px;
">
Client Reference
</div>

<div style="
margin-top:15px;
font-size:34px;
font-weight:bold;
letter-spacing:4px;
color:#1565C0;
">

${clientReference}

</div>

</div>

<p>

To access your portal:

</p>

<ol>

<li>Visit https://www.pogadvisoryportal.co.za</li>

<li>Enter your Client Reference</li>

<li>A verification code will be emailed to you</li>

<li>Enter the verification code</li>

</ol>

<p>

No password is required.

</p>

<p>

Kind regards,

<br><br>

<strong>
POG Advisory Team
</strong>

</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
}
