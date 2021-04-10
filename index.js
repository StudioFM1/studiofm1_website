const express = require('express')
const app = express()
const port = 80

app.listen(port,()=>console.info('\x1b[34m%s\x1b[0m', `Server listening at http://localhost`))