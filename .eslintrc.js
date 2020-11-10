module.exports = {
    env: {
        es2021: true,
        node: true,
        browser: true,
        mocha: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'indent': ['error', 4],
        'quote-props': ['error', 'consistent'],
        'no-console': 'off',
        'no-restricted-syntax': [
            'error',
            {
                'selector': 'CallExpression[callee.object.name="console"][callee.property.name!=/^(log|warn|error|info|trace)$/]',
                'message': 'Unexpected property on console object was called',
            },
        ],
    },
};
