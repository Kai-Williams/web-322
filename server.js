/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Kai Williams       Student ID: 103714234      Date: 2024-10-18
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const legoData = require('./modules/legoSets'); 
const express = require('express'); 
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8080; 

app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about"); 
});

app.get("/404", (req, res) => {
    res.render("404"); 
});

app.get("/lego/sets", (req, res) => {
    legoData.getAllSets()
        .then(sets => res.json(sets))
        .catch(error => res.status(500).send(error));
});

app.get("/lego/sets/:set_num", (req, res) => {
    legoData.getSetByNum(req.params.set_num)
        .then(set => res.json(set))
        .catch(error => res.status(404).send(error));
});

app.get("/lego/sets/theme-demo", (req, res) => {
    legoData.getSetsByTheme("City")
        .then(sets => res.json(sets))
        .catch(error => res.status(404).send(error));
});


legoData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Initialization failed:", error);
    });

    async function run() {
        await legoData.initialize() 
    
        const allSets = legoData.getAllSets()
        console.log(allSets)
    
        const specificSet = await legoData.getSetByNum("0003977811-1")
        console.log(specificSet)
    }
    
    run().catch(console.error)