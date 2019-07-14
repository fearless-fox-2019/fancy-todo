module.exports = (objDate) => {
    let year = objDate.getFullYear()
    let month = objDate.getMonth()
    let date = objDate.getDate()

    let newDate = date + '-' + (month + 1) +'-' + year
    return newDate
}