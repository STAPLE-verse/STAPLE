export function createForgotPasswordMsg(to, resetUrl) {
  return {
    from: "STAPLE <app@staple.science>",
    to,
    subject: "Your Password Reset Instructions",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: `
    <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>

<h3>Your Password Reset Instructions</h3>

You requested a new password for your STAPLE account. <a href="${resetUrl}">Click here to set a new password.</a>
<p>
If you need more help, you can reply to this email to create a ticket.
<p>
Thanks,
<br>
STAPLE Help Desk

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
  }
}

export function createSignUpMsg(email) {
  return {
    from: "STAPLE <app@staple.science>",
    to: email.toLowerCase().trim(),
    subject: "STAPLE Account Created",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
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
  }
}

export function createNewInvitation(values, currentUser, projectmember) {
  return {
    from: "STAPLE <app@staple.science>",
    to: values.email,
    subject: "STAPLE Project Invitation",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: `
    <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>

    <h3>STAPLE Project Invitation</h3>

        You've been invited to collaborate on a STAPLE project by
        ${currentUser!.username}. STAPLE is project management software that
        allows you to document your research project to improve transparency. If you
        wish to join the project, please log in at: https://app.staple.science/. You
        can join the project by clicking on Invitations on the sidebar menu and click "Accept"
        or decline the project invitation by clicking "Decline".
        <p>
        If you want to join the project, but have an account under a different
        email, you can log in or create an account with your desired email. Then
        click Invitations on the sidebar menu and click "Accept by Code". You would
        use code: "${projectmember.invitationCode}" to add this project.
        <p>
        If you need more help, you can reply to this email to create a ticket.
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
  }
}

export function createReassignmentInvitation(values, currentUser, projectMember) {
  return {
    from: "STAPLE <app@staple.science>",
    to: values.email,
    subject: "STAPLE Project Reassignment Invitation",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: `
    <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>

    <h3>STAPLE Project Reassignment Invitation</h3>

        Hello,
        <p>
        You've been invited to rejoin a STAPLE project by ${
          currentUser!.username
        }. This project was previously associated with your account but has since been marked as inactive.
        <p>
        If you'd like to rejoin the project, please log in at: https://app.staple.science/.
        You can find this invitation in the "Invitations" section of the sidebar menu and either accept or decline the reassignment.
        <p>
        If you need more help, you can reply to this email to create a support ticket.
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
  }
}

export function createEditPasswordMsg(currentUser) {
  return {
    from: "STAPLE <app@staple.science>",
    to: currentUser!.email,
    subject: "STAPLE Password Change",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: `
    <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>

      <h3>STAPLE Password Change</h3>

      This email is to notify you that you recently updated your
      password. If you did not make this change, please
      contact us immediately.
      <p>
      If you need more help, you can reply to this email to create a ticket.
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
  }
}

export function createEditProfileMsg(user) {
  return {
    from: "STAPLE <app@staple.science>",
    to: user!.email,
    subject: "STAPLE Profile Change",
    replyTo: "STAPLE Help <staple.helpdesk@gmail.com>",
    html: `
    <html>
    <body>
    <center><img src="https://raw.githubusercontent.com/STAPLE-verse/STAPLE-verse.github.io/main/pics/staple_email.jpg"
alt="STAPLE Logo" height="200"></center>


      <h3>STAPLE Profile Change</h3>

      This email is to notify you that you recently updated your
      profile information. If you did not make this change, please
      contact us immediately.
      <p>
      If you need more help, you can reply to this email to create a ticket.
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
  }
}
