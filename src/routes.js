const express = require("express")
const routes = express.Router() 

const views = __dirname + "/views/";

const profile = {
    name: "Douglas",
    avatar: "https://avatars.githubusercontent.com/u/14242834?v=4",
    "monthly-budge": 5000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now()
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    }
]

routes.get("/", (request, response) => response.render(views + "index", { jobs }))
routes.get("/job", (request, response) => response.render(views + "job"))
routes.get("/job/edit", (request, response) => response.render(views + "job-edit"))
routes.get("/profile", (request, response) => response.render(views + "profile", { profile }))

routes.post("/job", (request, response) => {
    const lastId = jobs[jobs.length - 1]?.id || 1;
    jobs.push({
        id: lastId + 1,
        name: request.body.name,
        "daily-hours":request.body["daily-hours"],
        "total-hours": request.body["total-hours"],
        created_at: Date.now()
    })
    return response.redirect("/")
})
 
module.exports = routes;