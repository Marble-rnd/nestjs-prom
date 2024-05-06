module.exports = {
  "env": {
    "node": true,
    "es2021": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint", "import"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "quotes": ["error", "single", { "avoidEscape": true }], // Corresponds to TSLint's quotemark
    "sort-keys": ["off"], // Equivalent to object-literal-sort-keys
    "import/order": ["off"], // Corresponds to ordered-imports
    "no-console": ["warn"], // Corresponds to no-console, set to warn to avoid errors
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "leadingUnderscore": "forbid" // Equivalent to interface-name
      }
    ],
    "eol-last": ["off"], // Corresponds to eofline
    "linebreak-style": ["off"], // Corresponds to linebreak-style
    "@typescript-eslint/ban-types": ["off"], // Corresponds to ban-types
    "max-classes-per-file": ["off"], // Corresponds to max-classes-per-file
    "@typescript-eslint/member-ordering": ["off"], // Corresponds to member-ordering
    "@typescript-eslint/no-var-requires": ["off"], // Corresponds to no-var-requires
    "@typescript-eslint/lines-between-class-members": ["off"], // Corresponds to one-line
    "@typescript-eslint/array-type": ["off"], // Corresponds to array-type
  }
}
;
