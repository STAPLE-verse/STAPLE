export function createForgotPasswordMsg(to, resetUrl) {
  return {
    from: "staple.helpdesk@gmail.com",
    to,
    subject: "Your Password Reset Instructions",
    html: `
      <h3>Reset Your Password</h3>

      You requested a new password for your STAPLE account. <a href="${resetUrl}">Click here to set a new password.</a>
      <p>
      If you need more help, you can reply to this email to create a ticket.
      <p>
      Thanks,
      <br>
      STAPLE HelpDesk
    `,
  }
}

export function createSignUpMsg(email) {
  return {
    from: "staple.helpdesk@gmail.com",
    to: email.toLowerCase().trim(),
    subject: "STAPLE Account Created",
    html: `
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
    `,
  }
}

export function createNewInvitation(values, currentUser, contributor) {
  return {
    from: "staple.helpdesk@gmail.com",
    to: values.email,
    subject: "STAPLE Project Invitation",
    html: `
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
        use code: "${contributor.invitationCode}" to add this project.
        <p>
        If you need more help, you can reply to this email to create a ticket.
        <p>
        Thanks,
        <br>
        STAPLE HelpDesk
      `,
  }
}

export function createEditPasswordMsg(currentUser) {
  return {
    from: "staple.helpdesk@gmail.com",
    to: currentUser!.email,
    subject: "STAPLE Password Change",
    html: `
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
    `,
  }
}

export function createEditProfileMsg(user) {
  return {
    from: "staple.helpdesk@gmail.com",
    to: user!.email,
    subject: "STAPLE Profile Change",
    html: `
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
    `,
  }
}
