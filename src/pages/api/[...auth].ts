import { passportAuth } from "@blitzjs/auth"
import { Strategy as OrcidStrategy } from "passport-orcid"
import db from "db"
import { api } from "src/blitz-server"

export default api(
  passportAuth(({ ctx, req, res }) => ({
    successRedirectUrl: "/main",
    errorRedirectUrl: "/main",
    strategies: [
      {
        strategy: new OrcidStrategy(
          {
            sandbox: process.env.ORCID_CLIENT_SANDBOX === "false",
            clientID: process.env.ORCID_CLIENT_ID,
            clientSecret: process.env.ORCID_CLIENT_SECRET,
            callbackURL: `${process.env.APP_ORIGIN}/api/auth/orcid/callback`,
          },
          async function (accessToken, refreshToken, params, profile, done) {
            try {
              const user = await db.user.update({
                where: {
                  id: ctx.session.$publicData.userId!,
                },
                data: {
                  orcid: params.orcid,
                },
              })
            } catch (e) {
              console.log(e)
            }

            return done(null, { publicData: ctx.session.$publicData })
          }
        ),
      },
    ],
  }))
)
