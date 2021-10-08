const express = require("express")
const routes = express.Router()

routes.get("/", (request, response) => {
    return response.sendFile(__dirname + "/views/index.html")
})

routes.get("/index.html", (req, res) => {
    return res.redirect("/")
})

module.exports = routes;