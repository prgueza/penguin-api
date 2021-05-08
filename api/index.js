const mongoose = require('mongoose')
const chalk = require('chalk')

const connectionUri = database =>
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/${database}?retryWrites=true&w=majority`
const connectionConfiguration = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
}

function connect(database) {
    try {
        mongoose.connect(connectionUri(database), connectionConfiguration)
        console.log(
            chalk.inverse.green.bold('\n Connected to MongoDB Server \n')
        )
    } catch (error) {
        console.error(error)
    }
}

function link(app, database) {
    const routes = require(`./${database}`) // Route array [{ endpoint, router }]
    if (!routes) return
    routes.forEach(({ endpoint, router }) =>
        app.use(`/api/${database}${endpoint}`, router)
    )
    const routeInfo = routes.map(({ endpoint, router }) => ({
        endpoint,
        routes: router.stack.map(({ route }) => ({
            path: route.path,
            method: route.stack[0].method,
        })),
    }))
    const methodColors = {
        get: 'green',
        post: 'yellow',
        put: 'blue',
        delete: 'red',
    }
    console.log(chalk.blue.bold(`\n${database} API routes:`))
    console.log(chalk.bold(`\n${process.env.BASE_URL}${database}`))
    routeInfo.forEach(({ endpoint, routes }) => {
        console.log(chalk.bold(`\n ${endpoint}`))
        routes.forEach(({ path, method }) => {
            console.log(
                chalk[methodColors[method]](
                    `   ${method.toUpperCase()} - ${endpoint}${path}`
                )
            )
        })
    })
}

module.exports = { connect, link }
