//msg will have from, to, subject, and html
export async function Mailer(msg) {
  var nodemailer = require("nodemailer")

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
