const js = require("@eslint/js")
const globals = require("globals")
const prettier = require("eslint-config-prettier")

module.exports = [
    // 1. Files/folders ESLint should never look at
    {
        ignores: ["node_modules/**", "uploads/**", "dist/**"]
    },

    // 2. ESLint's own recommended rules (catches real bugs)
    js.configs.recommended,

    // 3. Project-specific settings for our backend files
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs", // we use require/module.exports
            globals: {
                ...globals.node // process, __dirname, console, etc. are known globals
            }
        },
        rules: {
            // unused vars = warning, but ignore ones deliberately prefixed with "_"
            // (e.g. Express error-handler's required 4th `next` arg that we don't call)
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "no-undef": "error", // using an undefined variable = error
            "no-console": "off" // console.log allowed (we still use it)
        }
    },

    // 4. Turn off any ESLint rules that fight with Prettier's formatting
    prettier
]
