module.exports.parseLanguages = language => {
    return [language + '.ejs', language[0].toUpperCase() + language.slice(1)];
};