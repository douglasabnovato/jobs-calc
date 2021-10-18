const express = require("express")
const routes = express.Router() 

const views = __dirname + "/views/";

const profile = {
    name: "Douglas",
    avatar: "https://avatars.githubusercontent.com/u/14242834?v=4",
    "monthly-budge": 5000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4, 
    "value-hour": 75
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
    },
    {
        id: 3,
        name: "Nike",
        "daily-hours": 3,
        "total-hours": 55,
        created_at: Date.now() 
    },
    {
        id: 4,
        name: "SJN",
        "daily-hours": 6,
        "total-hours": 60,
        created_at: Date.now()
    }
]

function remainingDays(job){

    const remainingDays = (job["total-hours"]/job["daily-hours"]).toFixed()
    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(remainingDays)
    const dueDateInMs = createdDate.setDate(dueDay) 
    const timeDiffInMs = dueDateInMs - Date.now() 

    const dayInMs = 1000 * 60 * 60 * 24
    const dayDiff = Math.floor(timeDiffInMs / dayInMs) 
    return dayDiff
}

routes.get("/", (request, response) => { 
    
    const updatedJobs = jobs.map((job) => {

        const remaining = remainingDays(job)
        const status = remaining <= 0 ? "Done" : "Progress"

        return {
            ...job,
            remaining,
            status,
            budget: profile["value-hour"] * job["total-hours"]
        }

    })

    response.render(views + "index", { jobs: updatedJobs })

})

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