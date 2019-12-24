import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/user'

import fs = require('fs')

const dir: string = './db'
if (!fs.existsSync(dir))
    fs.mkdirSync(dir)
const db: MetricsHandler = new MetricsHandler(dir + '/metrics')
const dbUser: UserHandler = new UserHandler(dir + '/users')

const userTest = new User('test', 'test@test.com', 'test')

// Populate user
dbUser.save(userTest, (err: Error | null) => {
    if (err) throw err
    console.log('User '+userTest.username+' was successfully added to the DB.')
    console.log('Username : '+userTest.username+ ' password: '+userTest.password)
})

const met: Metric[] = [
    new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),
    new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
    new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)
]

db.save(userTest.username, met, (err: Error | null) => {
    if (err) throw err
    console.log('Data populated')
})