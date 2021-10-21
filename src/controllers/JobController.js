const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")


module.exports = { 

    index(request, response){
        
        const updatedJobs = Job.get().map((job) => {
    
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? "Done" : "Progress"
    
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"])
            }
    
        }) 
    
        return response.render("index", { jobs: updatedJobs }) 

     },

     create(request, response){
        return response.render("job") 
     },

     save(request, response){

        const lastId = Job.get()[Job.get().length - 1]?.id || 1;

        Job.get().push({
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
        const job = Job.get().find(job => Number(job.id) === Number(jobId))

        if(!job){ return response.send("Job not Found!")}

        job.budget = JobUtils.calculateBudget(job, Profile.get()["value-hour"])

        return response.render("job-edit", { job })

     },

     update(request, response){ 

        const jobId = request.params.id
        const job = Job.get().find(job => Number(job.id) === Number(jobId))

        if(!job){ return response.send("Job not Found!")}

        const updatedJob = {
            ...job,
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"],
        }

        const newJobs = Job.get().map(job => {
            
            if(Number(job.id) === Number(jobId)){
                job = updatedJob
            }

            return job
        })

        Job.update(newJobs)

        response.redirect("/job/" + jobId)
     },

     delete(request, response){
            
        const jobId = request.params.id 

        Job.delete(jobId)

        response.redirect("/")

     }
     
}  