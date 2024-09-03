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
