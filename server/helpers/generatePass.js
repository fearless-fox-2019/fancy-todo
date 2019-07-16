module.exports = () => {
    let dict = '1234567890abcdefghijklmnopqrstuvwxyz'
    let result = ''
    for (let i = 0; i < 40; i++) {
        let randomIdx = Math.floor(Math.random() * dict.length)
        result += dict[randomIdx]
    }
    return result
}