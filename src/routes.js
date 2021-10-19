const express = require("express")
const routes = express.Router() 

const views = __dirname + "/views/";

const Profile = {

    data: { 
        name: "Douglas",
        avatar: "https://avatars.githubusercontent.com/u/14242834?v=4",
        "monthly-budge": 5000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4, 
        "value-hour": 75 
    },

    controllers: {
        index(){
            return resizeBy.render(views + "profile", { profile: Profile.data })
        },

        update(request, response){

            const data = request.body;
            const weeksPerYear = 52;
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
            const weeksTotalHours = data["hours-per-day"] * data["hours-per-week"];
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;

            const valueHhour = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return response.redirect("/profile")
        },
    } 

}

const Job = {

    data: [
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
    ],

    controllers: {
        index(request, response){
            
            const updatedJobs = Job.data.map((job) => {
        
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? "Done" : "Progress"
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: profile["value-hour"] * job["total-hours"]
                }
        
            })
        
            response.render(views + "index", { jobs: updatedJobs }) 

         },

         create(request, response){
            return response.render(views + "job") 
         },

         save(request, response){
            const lastId = Job.data[Job.data.length - 1]?.id || 1;
            jobs.push({
                id: lastId + 1,
                name: request.body.name,
                "daily-hours":request.body["daily-hours"],
                "total-hours": request.body["total-hours"],
                created_at: Date.now()
            })
            return response.redirect("/")
         }
    },

    services: {
        remainingDays(job){

            const remainingDays = (job["total-hours"]/job["daily-hours"]).toFixed()
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay) 
            const timeDiffInMs = dueDateInMs - Date.now() 
        
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs) 
            return dayDiff
        
        }
    }
} 

routes.get("/", Job.controllers.index) 
routes.get("/job", Job.controllers.create)
routes.post("/job", Job.controllers.save)
routes.get("/job/edit", (request, response) => response.render(views + "job-edit"))
routes.get("/profile", Profile.controllers.index) 
 
module.exports = routes;
