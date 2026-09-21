const express = require('express');
const Router = express.Router();

Router.get ('/',(req,res)=>{
    res.send("student portal");
})
Router.get ('/info',(req,res)=>{
    res.send("student info");
})
Router.get ('/studentis',(req,res)=>{
    res.send("student portal");
})
Router.get ('/notification',(req,res)=>{
    res.send("notifications");
})

module.exports =Router;