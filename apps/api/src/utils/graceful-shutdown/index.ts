export const gracefulShutdown = () => {
    // TODO: Disconnect DB and other services...
    setTimeout(() => {
        console.log('Good Bye')
        process.exit()
    }, 5000)
}
