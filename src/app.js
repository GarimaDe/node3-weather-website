const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(path.join(__dirname,'../public'))


const app = express()
const port = process.env.PORT ||3000

//Define path for Express config
const publicDirectoryPath =path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')




app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//Setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('',(req, res )=>{
    res.render('index' , {
        title : 'Index page',
        author : 'Garima De'
    })
})

app.get('/help', (req,res)=>{

    res.render('help' , {
        title : 'Help!!!!!! ',
        author : 'Garima De',
        helpText : 'This page is designed to help'
    })
})


app.get('/about', (req,res)=>{
    res.render('about' , {
        title : 'About page',
        author : 'Garima De'
    })
 
})


app.get('/weather', (req,res)=>{

    if(!req.query.address)
    {
        return res.send({
            error : "You must provide an address"
        })
    }

    geocode(req.query.address,  (error, {latitude, longitude, location} = { }) =>{

        if(error)
        {
            return res.send({error})
        }

        forecast(latitude,longitude, (error, forecastData) =>{

            if(error)
            {
                res.send({error})
            }

            res.send({

                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res)=>{
    if(!req.query.search)
    {
        return res.send({
            error : "You must provide a search term"
        })
    }   
        console.log(req.query.search);
        res.send({
            products : []
        })
    
})


app.get('/help/*', (req,res)=>{
    res.render('error', {
        errorMessage : 'Help article Not found',
        title : 'Error',
        author : 'Ria'
    })
})


app.get('*', (req,res)=>{
    res.render('error', {
        errorMessage : 'Page Not found',
        title : 'Error',
        author : 'Ria'
    })
})


app.listen(port, ()=>{
    console.log('Server is up on port'+ port)
})

