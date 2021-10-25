const Database = require("./config");

const initDb = {

    async init(){

        const db = await Database(); 

        try {
            
            await db.exec(`CREATE TABLE profile (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                avatar TEXT, 
                monthly_budget INT,
                days_per_week INT,
                hours_per_day INT,
                vacation_per_day INT,
                value_hour INT
            )`);  
            
            await db.exec(`CREATE TABLE jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT, 
                daily_hours INT,
                total_hours INT,
                created_at DATETIME 
            )`); 
            
            await db.run(`INSERT INTO profile(
                name,
                avatar, 
                monthly_budget,
                days_per_week,
                hours_per_day,
                vacation_per_day,
                value_hour ) VALUES (
                "Jakeline",
                "https://avatars.githubusercontent.com/u/14242834?v=4",
                8000,
                5,
                5,
                4,
                110
            );`); 
            
            await db.run(`INSERT INTO jobs(
                name, 
                daily_hours,
                total_hours,
                created_at ) VALUES (
                "Pizzaria Guloso",
                2,
                1,
                1617514376018 
            );`);

            await db.run(`INSERT INTO jobs(
                name, 
                daily_hours,
                total_hours,
                created_at ) VALUES (
                "OneTwo Project",
                3,
                47,
                1617514376018
            );`); 
            
            await db.close();
            
        }catch(error){ console.log(error.message) }  
      
    } 
 
}

initDb.init(); 
