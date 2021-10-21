const Job = require("../model/Job")
const JobUtils = require("../utils/JobUtils")
const Profile = require("../model/Profile")

module.exports = {

    index(request, response){

        let statusCount = {
            progress: 0,
            done: 0,
            total: Job.get().length,
        }
        
        let jobTotalHours = 0;
        
        const updatedJobs = Job.get().map((job) => {
    
            const remaining = JobUtils.remainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";

            statusCount[status] += 1;

            jobTotalHours = status == "progress" ? jobTotalHours + Number(job["daily-hours"]) : jobTotalHours 
    
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, Profile.get()["value-hour"])
            }
    
        }) 

        const freeHours = Profile.get()["hours-per-day"] - jobTotalHours;
    
        return response.render("index", { jobs: updatedJobs, profile: Profile.get(), statusCount: statusCount, freeHours: freeHours }) 
    
    } 

} 
