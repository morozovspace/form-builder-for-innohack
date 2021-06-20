const express = require('express')
const router = express.Router()
const signInForm = require("../static/signin-form.json")
const signUpForm = require("../static/signup-form.json")
router.get('/signin-form', (req, res, next) => {
    /* 	#swagger.tags = ['User']
        #swagger.description = 'Endpoint to sign in a specific user' */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/AddUser" }
    } */

    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    res.json({
      id: "signIn",
      ...signInForm,
    })
})
router.get('/signup-form', (req, res, next) => {
    /* 	#swagger.tags = ['User']
        #swagger.description = 'Endpoint to sign in a specific user' */

    /*	#swagger.parameters['obj'] = {
            in: 'body',
            description: 'User information.',
            required: true,
            schema: { $ref: "#/definitions/AddUser" }
    } */

    /* #swagger.security = [{
            "apiKeyAuth": []
    }] */
    res.json({
      id: "signUp",
      ...signUpForm,
    })
})

module.exports = router