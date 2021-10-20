const express = require("express")
const routes = express.Router() 
const ProfileController = require("./controllers/ProfileController")

const Profile = {

    

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
            name: "Dabn",
            "daily-hours": 5,
            "total-hours": 59,
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
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
        
            }) 
        
            return response.render("index", { jobs: updatedJobs }) 

         },

         create(request, response){
            return response.render("job") 
         },

         save(request, response){

            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({
                id: lastId + 1,
                name: request.body.name,
                "daily-hours":request.body["daily-hours"],
                "total-hours": request.body["total-hours"],
                created_at: Date.now()
            })

            return response.redirect("/")
         },

         show(request, response){

            const jobId = request.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job){ return response.send("Job not Found!")}

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            return response.render("job-edit", { job })

         },

         update(request, response){ 

            const jobId = request.params.id
            const job = Job.data.find(job => Number(job.id) === Number(jobId))

            if(!job){ return response.send("Job not Found!")}

            const updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                
                if(Number(job.id) === Number(jobId)){
                    job = updatedJob
                }

                return job
            })

            response.redirect("/job/" + jobId)
         },

         delete(request, response){
                
            const jobId = request.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            response.redirect("/")
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
        
        },

        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
} 

routes.get("/", Job.controllers.index) 

routes.get("/job", Job.controllers.create)
routes.post("/job", Job.controllers.save)

routes.get("/job/:id", Job.controllers.show)
routes.post("/job/:id", Job.controllers.update)
routes.post("/job/delete/:id", Job.controllers.delete)

routes.get("/profile", ProfileController.index) 
routes.post("/profile", ProfileController.update) 
 
module.exports = routes;
