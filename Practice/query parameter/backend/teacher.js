const express = require('express');
const Router = express.Router();

Router.get ('/',(req,res)=>{
    res.send(" teacher portal");
})
Router.get ('/info',(req,res)=>{
    res.send("teacher info");
})
Router.get ('/teacher',(req,res)=>{
    res.send("student portal");
})
Router.get ('/teacher notification',(req,res)=>{
    res.send("notifications");
})

module.exports =Router;