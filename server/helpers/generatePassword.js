module.exports = {
    generatePassword(name) {
        return name + Math.floor(Math.random() * (999999 - 100000 +1)) + 100000
    }
}