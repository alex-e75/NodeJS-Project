import { LevelDB } from '../src/leveldb'
import WriteStream from 'level-ws'


export class Metric {
    public timestamp: string
    public value: number

    constructor(ts: string, v: number) {
        this.timestamp = ts
        this.value = v
    }
}

export class MetricsHandler {
    private db: any

    constructor(dbPath: string) {
        this.db = LevelDB.open(dbPath)
    }

    public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
        stream.on('error', callback)
        stream.on('close', callback)
        metrics.forEach((m: Metric) => {
            stream.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
        })
        stream.end()
    }

    public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
        const stream = this.db.createReadStream()
        var met: Metric[] = []

        stream.on('error', callback)
            .on('end', (err: Error) => {
                callback(null, met)
            })
            .on('data', (data: any) => {
                console.log(data)
                const [_, k, timestamp] = data.key.split(":")
                const value = data.value

                if (key != k) {
                    console.log(`LevelDB error: ${data} does not match key ${key}`)
                } else {
                    met.push(new Metric(timestamp, value))
                }
            })
    }
    
    public static get(callback: (error: Error | null, result?: Metric[]) => void) {
        const result = [
            new Metric('2013-11-04 14:00 UTC', 12),
            new Metric('2013-11-04 14:10 UTC', 13)
        ]
        callback(null, result)
    }

    public getAll(callback: (error: Error | null, result?: Metric[]) => void) {
        const rs = this.db.createReadStream()
        var met: Metric[] = []
        rs.on('data', function (data: any) {
            console.log(data);
            const [timestamp] = data.key.split(":")
            met.push(new Metric(timestamp, data.value))
        })
            .on('error', function (err: Error) {
                callback(err, met)
            })
            .on('close', function () {
            })
            .on('end', function () {
                callback(null, met)
            })
    }

    public remove(key: string, callback: (err: Error | null) => void) {
        this.db.del(key, function (err: Error) {
            if (err) throw err
        });

        callback(null)
    }
}