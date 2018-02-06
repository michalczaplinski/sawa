module.exports = {
    "extends": ["airbnb", "prettier"],
    "plugins": [
        "react",
        "import",
        "prettier"
    ],
    "rules": {
        "prettier/prettier": "error",
        "react/jsx-filename-extension": "off",
        "react/no-unused-state": "off",
        "react/no-array-index-key": "off",
        "import/no-extraneous-dependencies": "off",
        "jsx-a11y/anchor-is-valid": "off",
        "jsx-a11y/alt-text": "off"
    }
};