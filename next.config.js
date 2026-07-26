// @ts-check
const { withBlitz } = require("@blitzjs/next")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  transpilePackages: ["@staple-verse/form-studio"],
}

module.exports = withBlitz(config)
