const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.PORT
const oldbApiKey = process.env.APIKEY
const mysqlPassword = process.env.MYSQLPASS

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: mysqlPassword, 
    database: 'FilmApp'
})

con.connect((err)=>{
   if(err)
    {
        console.log(err)
    } else {
        console.log('Connected')
    } 
})

// POST user, film and review data to the database #############################################################

// Add a user
app.post('/adduser',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    con.query(`insert into users values(${null},"${username}","${password}",false)`,(err,result)=>{
        if(err)
            {
                console.log(err);
            } else {
                res.send('User added');
            } 
    });
});

// Create review for a film
app.post('/addreview',(req,res)=>{

    const userID = req.body.userid;
    const filmID = req.body.filmid;
    const starRating = req.body.starrating;
    const postTitle = req.body.reviewtitle;
    const postBody = req.body.reviewbody;

    con.query(`insert into posts values(${null},"${filmID}",${userID},${starRating},"${postTitle}","${postBody}",curtime(),false)`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send('Posted')
            }
    });
    
});

// Authenticate login attempt ###################################################################################
app.get('/login',(req,res)=>{
    const input_userName = req.query.username;
    const input_password = req.query.password;

    con.query(`select * from users where username = "${input_userName}"`,(err,result)=>{

        if(err)
            {
                console.log(err)
                res.send(false)
            } else {
                if (result.length < 1) {
                    res.send(false)
                } else {
                    if (result[0].password == input_password && result[0].deleted === 0) {
                        const userData = new Object()
                        userData.userID = result[0].user_id
                        userData.username = result[0].username
                        res.send(userData)
                    } else {
                        res.send(false)
                    }
                }
            }
    });
});

// GET data from the database ##############################################################################################

// Get username from userID
app.get('/getusername',(req,res)=>{
    const userID = req.query.userid
    con.query(`select username from users where user_id = ${userID} and deleted = false `,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get details for all films
app.get('/getfilms',async (req,res)=>{
    const searchTerm = req.query.searchterm
    const filmdata = await fetch(`http://omdbapi.com/?apikey=${oldbApiKey}&s=${searchTerm}&type=movie`)
        res.send(await filmdata.json())
    });

// Get details for a single films
app.get('/getfilm',async (req,res)=>{
    const filmID = req.query.filmid
    const filmdata = await fetch(`http://omdbapi.com/?apikey=${oldbApiKey}&i=${filmID}&type=movie`)
        res.send(await filmdata.json())
    });

// Get all reviews
app.get('/getallreviews',(req,res)=>{

    con.query(`select * from posts where deleted = false`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get all reviews for a single film
app.get('/getreviews/',(req,res)=>{
    const filmID = req.query.filmid;

    con.query(`select * from posts where film_id = "${filmID}"`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

app.get('/',(req,res)=>{

});

// Set app to listen for requests ################################################################################
app.listen(port,(err)=>{
    if(err)
        {
            console.log(err)
        } else {
            console.log('App listening on port ' + port)
        } 
})