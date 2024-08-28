/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

import { Mailer } from "integrations/mailer"

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/auth/reset-password?token=${token}`

  const msg = {
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

  //send the email
  Mailer(msg)
}
