const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')

const app = express()
app.use(express.json())
app.use(cors())

const port = 8000
const oldbApiKey = '7a1a5a'

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //CHANGE THIS, DON'T COMMIT #################################################################################
    password:"", 
    //#########################################################################################################
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

    con.query(`insert into users values(${null},${username},${password},false)`,(err,result)=>{
        if(err)
            {
                console.log(err);
            } else {
                res.send('User added');
            } 
    });
});

// Add film
app.post('/addfilm',(req,res)=>{
    const filmTitle = req.body.filmTitle;
    const director = req.body.director;
    const description = req.body.description;
    const actors = req.body.actors;

    con.query(`insert into films values(${null},${filmTitle},${director},${description},${actors},false)`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send('Film added')
            }
    })
})

// Create review for a film
app.post('/addreview',(req,res)=>{
    const userID = req.body.userID;
    const filmID = req.body.filmID;
    const starRating = req.body.starRating;
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;

    con.query(`insert into posts values(${null},${filmID},${userID},${starRating},${postTitle},${postBody},false)`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send('Posted')
            }
    });
    
});

// GET data from the database ##############################################################################################

// Authenticate login attempt
app.get('/login',(req,res)=>{
    const input_userName = req.query.username;
    const input_password = req.query.password;

    con.query(`select * from users where username = "${input_userName}"`,(err,result)=>{
        if(err)
            {
                console.log(err)
                res.send("Invalid username or password")

            } else {
                if (result[0].password == input_password && result[0].deleted === 0) {
                    res.json(result[0])
                } else {
                    res.send("Invalid username or password")
                }
            }
    });
});

// Get usernames and IDs for all users that have not been deleted
app.get('/getallusers',(req,res)=>{

    con.query(`select user_id, username from users where deleted = false `,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get film data from a single film by title
app.get('/getfilm/:filmtitle',(req,res)=>{
    const filmID = req.params.filmtitle;

    con.query(`select * from films where film_id in ${filmID}`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get details for all films
app.get('/getallfilms',(req,res)=>{

    con.query(`select * from films where deleted = false`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get all reviews by a single user
app.get('/getreviewsbyuser/:userid',(req,res)=>{
    const userID = req.params.userid;

    con.query(`select * from posts where user_id in ${userID}`,(err,result)=>{
        if(err)
            {
                console.log(err)
            } else {
                res.send(result)
            }
    });
});

// Get all reviews for a single film
app.get('/getreviewsbyfilm/:filmid',(req,res)=>{
    const userID = req.params.userid;

    con.query(`select * from posts where film_id in ${filmID}`,(err,result)=>{
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