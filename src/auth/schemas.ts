import { z } from "zod"

export const email = z
  .string()
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const password_confirm = z
  .string()
  .min(10)
  .max(100)
  .transform((str) => str.trim())

export const Signup = z
  .object({
    email,
    password,
    username: z.string().min(3),
    password_confirm,
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ["password_confirm"],
    message: "Passwords do not match",
  })

export const UsernameExist = z.object({
  email,
  username: z.string().min(3),
})

export const Tos = z.object({
  tos: z.boolean().refine((value) => value === true, {
    message: "The terms of service must be accepted to continue.",
  }),
})

export const Login = z.object({
  email,
  password: z.string(),
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z
  .object({
    currentPassword: z.string(),
    newPassword: password,
    newPasswordRepeat: password,
  })
  .refine((data) => data.newPassword === data.newPasswordRepeat, {
    path: ["newPasswordRepeat"],
    message: "Passwords do not match",
  })
