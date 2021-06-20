const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const signInForm = require("../static/signin-form.json")
const signUpForm = require("../static/signup-form.json")
const covid19 = require("../static/covid19-form.json")
const marafon = require("../static/marafon-form.json")
const lang = require("lodash/lang")
router.get('/calc', (req, res, next) => {
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
  return res.json({
    params: {
      options: [
        {
          label: "10.05.2020",
          value: "10.05.2020",
        },
        {
          label: "15.05.2020",
          value: "15.05.2020",
        },
        {
          label: "14.06.2020",
          value: "14.06.2020",
        },
      ],
    }
  })
  // return next(createError.NotFound('Not found predefined form'))
})
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
    if (lang.isString(id) || lang.isNumber(id)) {
      console.log("ID", id)
      // Запросить таблицу из базы данных
      if (id === "covid19") {
        return res.json(covid19)
      } else if (id === "marafon") {
        return res.json(marafon)
      } else if (id === "signInForm") {
        return res.json(signInForm)
      }
      else if (id === "signUpForm") {
        return res.json(signUpForm)
      }
    }
    return next(createError.NotFound('Not found predefined form'))
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