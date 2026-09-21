// @ts-check
const path = require("path")
const { withBlitz } = require("@blitzjs/next")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  webpack: (webpackConfig) => {
    // @staple-verse/form-studio is linked via `file:../form-studio` for local
    // development. Because it lives outside this project's node_modules,
    // webpack resolves its `react`/`react-dom` imports against form-studio's
    // own node_modules instead of STAPLE's, loading a second React copy and
    // breaking hooks ("resolveDispatcher() is null"). Force every resolution
    // to STAPLE's single React instance regardless of which node_modules tree
    // the importer lives in. Safe to keep once form-studio moves back to a
    // pinned release, since it's a no-op when there is only one copy anyway.
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime"),
    }
    return webpackConfig
  },
}

module.exports = withBlitz(config)
