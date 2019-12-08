import express = require('express')
import bodyparser = require('body-parser')
import { MetricsHandler, Metric } from '../db/metrics'

const app = express();
const port: string = process.env.PORT || '8080'
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.set('port', 3000);
app.set('views', __dirname + "/../views");
app.set('view engine', 'ejs');

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

//
// GET
//

app.get('/', (req: any, res: any) => {
    res.write('Hello world')
    res.end()
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