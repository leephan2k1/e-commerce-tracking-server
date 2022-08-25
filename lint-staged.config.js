module.exports = {
    // Run type-check on changes to JS files
    '**/*.js?(x)': () => 'yarn js',
    // Run ESLint on changes to JavaScript/TypeScript files
    '**/*.(ts|js)?(x)': (filenames) => `yarn lint . ${filenames.join(' ')}`,
};
