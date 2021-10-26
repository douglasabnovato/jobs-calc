const Profile = require('../model/Profile')

module.exports = {

    async index(req, res) {
      
      return res.render("profile", { profile: await Profile.get() })

    },

    async update(req, res) {
      
      const data = req.body // req.body para pegar os dados 
      const weeksPerYear = 52 // definir quantas semanas tem num ano: 52 
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"] ) / 12 // remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
      const weekTotalHours  = data["hours-per-day"] * data["days-per-week"] // total de horas trabalhadas na semana
      const monthlyTotalHours = weekTotalHours * weeksPerMonth // horas trabalhadas no mês
      const valueHour = data["monthly-budget"] / monthlyTotalHours // qual será o valor da minha hora?
      const profile = await Profile.get()

      await Profile.update({
        ... profile,
        ...req.body,
        "value-hour": valueHour
      })

      return res.redirect('/profile')

    }
  }