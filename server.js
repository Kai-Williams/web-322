/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kai Williams      Student ID: 103714234      Date: 2024-11-20
*
* Published URL: https://web-322-git-main-kai-williams-projects.vercel.app/
*
********************************************************************************/

const express = require('express')

const path = require('path')
const legoData = require("./modules/legoSets") 
const app = express()
const port = process.env.PORT || 8080


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "views")))

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.get('/lego/sets', (req, res) => {
  legoData.initialize()
    .then(() => {
      return legoData.getAllSets()
    })
    .then((sets) => {
      res.render('sets', { sets })
    })
    .catch((err) => {
      console.error('Error fetching sets:', err)
      res.status(500).send('Error fetching sets')
    })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})


app.get('/lego/set/:num', (req, res) => {
  legoData.initialize()
    .then(() => {
      const setNum = req.params.num
      return legoData.getSetByNum(setNum)
    })
    .then((set) => {
      res.render('set', { set })
    })
    .catch((err) => {
      console.error('Error fetching set details:', err)
      res.status(404).render('404', { message: `Set not found with set_num: ${req.params.num}` })
    })
})

app.get('/lego/addSet', (req, res) => {
  legoData.getAllThemes()
    .then(themeData => {
      res.render('addSet', { themes: themeData })
    })
    .catch(err => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` })
    })
})

app.post('/lego/addSet', (req, res) => {
  legoData.addSet(req.body)
    .then(() => {
      res.redirect('/lego/sets')
    })
    .catch(err => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` })
    })
})

app.get('/lego/editSet/:num', (req, res) => {
  const setNum = req.params.num

  Promise.all([legoData.getSetByNum(setNum), legoData.getAllThemes()])
    .then(([setData, themeData]) => {
      res.render('editSet', { set: setData, themes: themeData })
    })
    .catch((err) => {
      res.status(404).render('404', { message: `Unable to retrieve data: ${err}` })
    })
})


app.post('/lego/editSet', (req, res) => {
  const set_num = req.body.set_num
  const setData  = req.body

  legoData.editSet(set_num, setData)
    .then(() => {
      res.redirect(`/lego/sets`)
    })
    .catch((err) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` })
    })
})

app.get('/lego/deleteSet/:num', (req, res) => {
  const setNum = req.params.num

  legoData.deleteSet(setNum)
    .then(() => {
      res.redirect('/lego/sets')
    })
    .catch((err) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` })
    })
})