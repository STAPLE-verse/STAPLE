//msg will have from, to, subject, and html
import nodemailer from "nodemailer"

export async function Mailer(msg) {
  const pass = process.env.EMAIL_PASS

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "staple.helpdesk@gmail.com",
      pass: pass,
    },
  })

  transporter.sendMail(msg, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
}
