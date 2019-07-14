module.exports = function(){
    let string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZ1234567890'
    let password = ''
    for (let i = 0; i < 15; i++) {
        let random = Math.floor(Math.random() * string.length)
        password += string[random]
    }

    return password
}
