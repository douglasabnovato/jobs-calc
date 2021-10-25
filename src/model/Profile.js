const Database = require("../db/config");

let data = {
  name: "Douglas",
  avatar: "https://avatars.githubusercontent.com/u/14242834?v=4",
  "monthly-budget": 6000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
  "value-hour": 110,
};

module.exports = { 
    
    async get(){

        const db = await Database(); 
 
        const data2 = await db.get(`SELECT * FROM profile`);

        await db.close();

        console.log(data2);

        return data;
    },

    update(newData){
        data = newData;
    }
}