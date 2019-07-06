const path = require('path');

module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "plugins": ["prettier"],
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "config": path.join(__dirname, 'webpack.config.js')
            }
        }
    },
    "rules": {
        "no-console": ["error", { "allow": ["warn", "error"] }],
        "prettier/prettier": "error",
        "import/no-extraneous-dependencies": [
            "error",
            {
                "devDependencies": ["main/**/**.test.js"],
                "optionalDependencies": ["main/**/**.test.js"],
                "peerDependencies": ["main/**/**.test.js"]
            }
        ],
        "react/prop-types": ["warn"]
    }
}
