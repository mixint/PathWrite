let Transflect = require('@mixint/transflect')
let PathWrite = require('../PathWrite')
let http = require('http')
let fs = require('fs')

http.createServer({
    IncomingMessage: require('parsedmessage'),
    ServerResponse: require('serverfailsoft'),
}, (req, res) => {
    if(req.method == 'PUT'){
        req.pipe(new PathWrite).pipe(res)
    } else {
        fs.createReadStream(req.pathname).pipe(res)
    }
}).listen(3000)
