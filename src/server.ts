import express = require('express')
import bodyparser = require('body-parser')
import morgan = require('morgan')
import { MetricsHandler, Metric } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()

const app = express();
const port: string = process.env.PORT || '8080'
const path = require('path');
const LevelStore = levelSession(session)
const userRouter = express.Router()
const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))
app.use(session({
  secret: 'lorem ipsum needless cartage habanera glittery dismal barnacle',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))
app.use(authRouter)
app.use('/user', userRouter)

app.set('port', 3000);
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

//
// GET
//

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})


authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

app.get(
    '/hello/:name',
    (req, res) => res.render('./hello.ejs', { name: req.params.name })
)

app.get('/metrics.json', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result);
    })
})

app.get('/metrics/:id', (req: any, res: any, next: any) => {
    dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
      if (err) next(err)
      if (result === undefined) {
        res.write('no result')
        res.send()
      } else res.json(result)
    })
  })

app.get('/metrics', (req: any, res: any) => {
    dbMet.getAll((err: Error | null, result?: any) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })

//
// DELETE
//

app.delete('/metrics/:id', (req: any, res: any) => {
    dbMet.remove(req.params.id, (err: Error | null) => {
        if (err) throw err
        res.status(200).send(`The metric was successfully removed from the database.`)
    })
})

//
// POST
//

userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
     res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

app.post('/metrics/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
        if (err) throw err
        res.status(200).send(`The metric was successfully added to the database.`)
    })
})

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})