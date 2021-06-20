const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const signInForm = require("../static/signin-form.json")
const signUpForm = require("../static/signup-form.json")
const lang = require("lodash/lang")
router.get('/form/:id', (req, res, next) => {
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
    const id = req.params.id // Проверить чтобы был строкой или чилсом
    console.log("IDDD", id, lang.isString(id))
    if (lang.isString(id) || lang.isNumber(id)) {
      console.log("ID", id)
      // Запросить таблицу из базы данных
      return res.json(signInForm)
    }
    return next(createError.Unauthorized('Unauthorized'))
})

router.post('/form/:id/update', (req, res, next) => {
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
    console.log("Обновление формы - получение артефактов после обнвления")
    res.json({
      id: "auth",
      ...signUpForm,
    })
})

module.exports = router