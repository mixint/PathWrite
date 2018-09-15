let Transflect = require('@mixint/transflect')
let mimemap    = require('@mixint/mimemap')
let fs         = require('fs')

/**
 * @author Colten Jackson
 * @extend Transflect
 * PathWrite creates or overwrites a specified file
 */
module.exports = class PathWrite extends Transflect {
    constructor(){
        super()
    }

    /**
     * @private
     * @param {ParsedMessage} source
     * Sets a destination for the new (over overwritten) file
     */
    _open(source){
        return this.dest = fs.createWriteStream(decodeURI(source.pathname))
    }

    /**
     * @private
     * @callback done
     * Writes an incoming binary chunk to the destination,
     * and signals that its ready for the next chunk immediately
     * or, if write returned false, after waiting for the drain event
     */
    _transform(chunk, encoding, done){
        this.dest.write(chunk) && done() || this.dest.once('drain', done)
    }

    /**
     * @private
     * @callback done
     * After all incoming bytes are written to disk via _transform, _flush is called
     * _flush implicitely fires 'end' event, closing the destination file.
     *
     */
    _flush(done){
        mimemap.extraStat(this.dest.path, (err, stat) => {
            if(err) return done(err)
            this.writeHead(201, {
                'Content-Length': stat.filestat.size,
                'Content-Type'  : stat.mimetype,
                'x-Content-Mode': stat.filemode,
                'x-Mode-Owner'  : stat.filestat.uid,
                'x-Mode-Group'  : stat.filestat.gid
            })
            done(null)
        })
    }
}