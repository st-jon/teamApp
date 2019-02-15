const passwordValidator = require('password-validator')
const validator = require("email-validator")

// PASSWORD VALIDATION
let PasswordValidator = new passwordValidator()
 
PasswordValidator
.is().min(8)                                    // Minimum length 8
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces


// REGISTER FORM VALIDATION
validateForm = (body) => {
    if (!body.username) {
        return 'Please provide a username'
    }
    if(!body.firstName) {
        return 'Please provide your first name'
    }
    if(!body.lastName) {
        return 'Please provide your last name'
    }
    if (!validator.validate(body.email)) {
        return 'please provide a valid email'
    }

    let password = body.password
    if (password) {
        let validation = PasswordValidator.validate(password, { list: true })

        if (validation.includes('min')) {
            return 'Password must be at least 8 characters'
        } else if (validation.includes('uppercase')) {
            return 'Password must contains uppercase character'
        } else if (validation.includes('lowercase')) {
            return 'Password must contains lowercase character'
        } else if (validation.includes('digits')) {
            return 'Password must contains at least one digit'
        } else if (validation.includes('spaces')){
            return 'Password cannot have space inside'
        } 
    }

    return
}


module.exports = { PasswordValidator, validateForm }