import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
    before(function () {
        LevelDB.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })

    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })

    describe('#save', function () {
        const metrics = [new Metric(`${new Date('2019-12-10 10:00 UTC').getTime()}`, 5)]
        const updateMetrics = [new Metric(`${new Date('2019-12-10 10:00 UTC').getTime()}`, 14)]
        it('should save data', function () {
            dbMet.save("unitTest", metrics, (err: Error | null) => {
                expect(err).to.be.undefined
                dbMet.get("unitTest", (err: Error | null, result?: Metric[]) => { //On vérifie que la donnée ait bien été insérée
                    expect(result).to.eql(metrics)
                })
            })
        })

        it('should update data', function () {
            dbMet.save("unitTest", metrics, (err: Error | null) => {
                expect(err).to.be.undefined

                dbMet.save("unitTest", updateMetrics, (err: Error | null) => {
                    expect(err).to.be.undefined

                    dbMet.get("unitTest", (err: Error | null, result?: Metric[]) => {
                        expect(result).to.eql(updateMetrics)
                    })
                })
            })
        })
    })

    describe('#delete', function () {
        const metrics = [new Metric(`${new Date('2019-12-10 10:00 UTC').getTime()}`, 5)]
        it('should delete data', function () {
            dbMet.save("unitTest2", metrics, (err: Error | null) => {
                expect(err).to.be.undefined
                dbMet.remove("unitTest2", (err: Error | null, result?: Metric[]) => {
                    expect(result).to.be.undefined
                })
            })
        })

        it('should not fail if data does not exist', function () {
            dbMet.remove("ExistePas", (err: Error | null) => {
                expect(err).to.be.null
            })
        })
    })

    after(function () {
        dbMet.db.close()
    })
})