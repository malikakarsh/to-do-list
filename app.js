const express = require('express')
const app = express()
const request = require('request')
const PORT = 4500

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));

let items = [];
let state = [];
let doneCount = 0;
app.get('/',(req,res) => {
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    }
    let date = today.toLocaleDateString("en-IN",options);
    let percentage = Math.round((doneCount/(items.length===0?1:items.length))*100);
    res.render('list', {items:items,date:date,state:state, percentage: percentage});
})

app.post('/dlt', (req, res) => {
    let toDelete = parseInt(req.body.name);
    if (state[toDelete] === 'strike'){
        doneCount--;
    }
    items.splice(toDelete, 1);
    state.splice(toDelete, 1);
    res.redirect('/');
})

app.post('/', (req, res) => {
    let item = req.body.item;
    items.push(item);
    state.push("no-strike");
    res.redirect('/');
})

app.post('/strike', (req, res) => {
    let strike = parseInt(req.body.name);
    if (state[strike] === "no-strike") {
        state[strike] = "strike";
        doneCount++;
    }
    else{
        state[strike] = "no-strike";
        doneCount--;
    }
    res.redirect('/');

})

app.listen(PORT,() => {
    console.log(`Server listening on port: ${PORT}`)
})