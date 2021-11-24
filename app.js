const express = require ('express')
const bodyParser = require ('body-parser')
const path = require ('path')
const cookieParser = require('cookie-parser')




const app = express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const port = 8080


app.use(express.static('public'))
app.set('view engine', 'ejs')

//controller
const usersController = require('./controllers/usersController')

// routing index
app.get('/', (req, res) => {

    if (req.cookies.auth){
        res.redirect('play')
    } else {
        res.render('index', {
            "title" : "Traditional Games"
        })
    }
    
})

app.get('/logout', (req, res) => {

    res.clearCookie('auth')
    res.redirect('/')
    
})

//routing play
app.get('/play', (req, res) => {
    res.render('play', {
        "title" : "Let's Play!"
    })
})



//routing admin
app.get('/admin', usersController.getAll)

app.get('/register', (req, res) => {
    res.render('register', {
        
    })
})




//sequelize
const { sequelize, Usergame, Usergame_bio, Usergame_history } = require('./models')
const { goFight } = require('./controllers/usersController')

app.post('/history', async(req,res)=>{
    try{
        const hist = await Usergame_history.findAll()
        res.send(hist)
    }

    catch(err){
        return res.status(403).json(err)
    }

    
})


//CRUD sequelize
    //Create
app.post('/users', usersController.createUser)


    //Update
app.get('/update/:id', usersController.getUpdate)
app.post('/update', usersController.postUpdate)

    //Delete
app.get('/delete/:id', usersController.deleteUser)


//login
app.post('/login', usersController.loginUser)



//fight room
app.get('/play/room1', (req, res) => {
    res.render('fight', {
        "title" : "Let's Play!",
        "room" : "room1"
        
    })
})
app.get('/play/room2', (req, res) => {
    res.render('fight', {
        "title" : "Let's Play!",
        "room" : "room2"
        
    })
})
app.get('/play/room3', (req, res) => {
    res.render('fight', {
        "title" : "Let's Play!",
        "room" : "room3"
        
    })
})




app.get('/play/room1/:input', usersController.goFight)
app.get('/play/room2/:input', usersController.goFight)
app.get('/play/room3/:input', usersController.goFight)

app.get('/play/room1-result', usersController.getResult)
app.get('/play/room2-result', usersController.getResult)
app.get('/play/room3-result', usersController.getResult)




//error handler
app.use((req, res,next)=>{
    res.status(404).render('notFound', {
        "title" : "Lost"
    });
 });
 

app.listen(port, async () => {
    console.log (`Listening at port ${port}`)
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('Database authenticated') 
})
