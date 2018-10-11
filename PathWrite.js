const Transflect = require('@mixint/transflect')
const extraStat  = require('@mixint/extrastat')
const fs         = require('fs')

/**
 * @author Colten Jackson
 * @extend Transflect
 * PathWrite creates or overwrites a specified file
 */
module.exports = class PathWrite extends Transflect {

    constructor(opt){ super(opt) }

    /**
     * @param {ParsedMessage} source
     * @returns {WriteStream}
     * Sets a destination for the new (over overwritten) file
     */
    _open(source){
        console.log(source.pathname)
        return this.dest = fs.createWriteStream(source.pathname)
    }

    /**
     * Writes an incoming binary chunk to the destination,
     * and signals that its ready for the next chunk immediately
     * or, if write returned false, after waiting for the drain event
     */
    _transform(chunk, encoding, done){
        this.dest.write(chunk) && done() || this.dest.once('drain', done)
    }

    /**
     * After all incoming bytes are written to disk via _transform, _flush is called
     * _flush implicitely fires 'end' event, closing the destination file.
     */
    _flush(done){
        extraStat(this.dest.path, (err, stat) => {
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
