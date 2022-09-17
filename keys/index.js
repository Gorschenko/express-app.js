if (process.env.NODE_ENV === 'producation') {
    module.exports = require('./keys.prod')
} else {
    module.exports = require('./keys.dev')
}