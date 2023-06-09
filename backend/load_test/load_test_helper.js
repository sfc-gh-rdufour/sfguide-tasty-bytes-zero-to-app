var util = require('util')


//
// load_test_helper.js
//
module.exports = {
    generateVUId: (context, events, done) => {
        context.vars.vuid = getRandomInt(1000);
        return done();
    },
    printStatus: (requestParams, response, context, ee, next) => {
        let res = util.inspect(response)
        let req = util.inspect(response.request)

        if (response.statusCode >= 400) {
            console.warn(response.body);
        }
        return next();
    },
    generateRandomDate: (userContext, events, done) => {
        let minDate = new Date(2022,1,1)
        let maxDate = new Date(2022,10,31)
        let days = Math.ceil((maxDate - minDate) / (1000 * 3600 * 24))

        let randomDays = getRandomInt(days)
        let startDate = addDays(minDate, randomDays)

        let duration = getRandomInt(days - randomDays)
        let endDate = addDays(startDate, duration)

        userContext.vars.startDate = startDate.toISOString().split('T')[0]
        userContext.vars.endDate = endDate.toISOString().split('T')[0]
        return done();
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }