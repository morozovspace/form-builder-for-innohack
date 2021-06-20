const express = require('express')
const admin = require('firebase-admin')
const router = express.Router()

router.get('/create', (req, res, next) => {
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
    try {
      console.log("HELLO")
      const userRecord = await admin
        .auth()
        .createUser({
          email: 'user@example.com',
          emailVerified: false,
          phoneNumber: '+11234567890',
          password: 'secretPassword',
          displayName: 'John Doe',
          photoURL: 'http://www.example.com/12345678/photo.png',
          disabled: false,
        })
      } catch(e) {
          return next(e)
      }
})

router.route('/users/:id').get(authorize, (req, res) => {
    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint to get a specific user.' 
    const users = []
    const data = users.find(e => e.id === req.params.id)

    /* #swagger.responses[200] = { 
      schema: { "$ref": "#/definitions/User" },
      description: "User registered successfully." } */
    res.status(200).json({
        data: [],
        message: 'Successfully found'
    })
})

module.exports = router