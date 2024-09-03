//msg will have from, to, subject, and html
import nodemailer from "nodemailer"
import * as aws from "@aws-sdk/client-ses"

export async function Mailer(msg) {
  const pass = process.env.EMAIL_PASS

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "staple.helpdesk@gmail.com", // your email
      pass: pass, // set up local password
    },
  })

  transporter.sendMail(msg, function (err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
}

export async function Amazon(msg) {
  const ses = new aws.SES({
    apiVersion: "2010-12-01",
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY, // must have IAM user with creds
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  })

  const transporter = nodemailer.createTransport({
    SES: { ses, aws },
  })

  try {
    const info = await transporter.sendMail(msg)
    console.log("Email sent:", info)
  } catch (err) {
    console.error("Error sending email:", err)
  }
}
