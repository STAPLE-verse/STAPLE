import { Resend } from "resend"

const resend = new Resend("re_UdenWRoM_AzxEcvRP53YAiif2MxcBLQRz")

await resend.emails.send({
  from: "STAPLE <app@staple.science>",
  to: "aggieerin@gmail.com",
  subject: "STAPLE Account Created",
  reply_to: "staple.helpdesk@gmail.com",
  html: `
      <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>

      <h3>Welcome to STAPLE</h3>

      You requested a STAPLE account at https://app.staple.science.
      You may now log in to your account.
      <p>
      If you need more help or did not request an account,
      you can reply to this email to create a ticket.
      <p>
      Thanks,
      <br>
      STAPLE HelpDesk

      <div style='mso-element:para-border-div;border:none;border-bottom:solid #BFC3C8 1.0pt;
mso-border-bottom-alt:solid #BFC3C8 .75pt;padding:0in 0in 0in 0in'>

<p class=MsoNormal style='margin-top:6.0pt;margin-right:0in;margin-bottom:6.0pt;
margin-left:0in;line-height:0%;border:none;mso-border-bottom-alt:solid #BFC3C8 .75pt;
padding:0in;mso-padding-alt:0in 0in 0in 0in'><o:p>&nbsp;</o:p></p>

</div>

<p style='margin-top:6.0pt;margin-right:0in;
margin-bottom:6.0pt;margin-left:0in;text-align:center;line-height:normal'>
STAPLE: Science Tracking Across Project Lifespans

<p style='margin-top:6.0pt;margin-right:0in;
margin-bottom:6.0pt;margin-left:0in;text-align:center;line-height:normal'>
https://staple.science

<p style='margin-top:6.0pt;margin-right:0in;
margin-bottom:6.0pt;margin-left:0in;text-align:center;line-height:normal'>
staple.helpdesk@gmail.com

</div>
</body>
</html>
    `,
})
