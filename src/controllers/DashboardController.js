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
    
        return response.render("index", { jobs: updatedJobs, profile: Profile.get() }) 
    
    } 

} 
