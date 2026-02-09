const path = require('path');
const fs = require('fs');
//const index = fs.readFileSync(`${__dirname}/../client/client.html`);

/*
const getParty = (request, response) => {
    const file = path.resolve(__dirname, '../client/party.mp4');
    
    fs.stat(file, (err, stats) => {
        if(err){
            if(err.code === 'ENOENT'){
                response.writeHead(404);
            }
            return response.end(err);}

        let {range} = request.headers;

        if(!range){
            range = 'bytes=0-';
        }

        const positions = range.replace(/bytes=/, '').split('-');
        let start = parseInt(positions[0], 10);

        const total = stats.size;
        const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

        if(start > end){
            start = end -1;
        }

        const chunksize = (end - start) + 1;
        response.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });

        const stream = fs.createReadStream(file, {start, end});

        stream.on('open', () => {
            stream.pipe(response);
        });

        stream.on('error', (streamErr) => {
            response.end(streamErr);
        });

        return stream;
    });
    
};
*/

//streaming helper
const streamFile = (filePath, contentType, request, response) => {
    fs.stat(filePath, (err, stats) => {
        if(err){
            if(err.code === 'ENOENT'){
                response.writeHead(404);
                return response.end('File not found');
            }
            response.writeHead(404);
            return response.end('Server error');
        }

        let { range } = request.headers;
        if(!range){
            range = 'bytes=0-';
        }

        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        let start = parseInt(startStr, 10);
        const total = stats.size;
        const end = endStr ? parseInt(endStr, 10) : total - 1;

        if(start > end){
            start = 0;
        }

        const chunkSize = (end - start) + 1;

        response.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType
        });


        const stream = fs.createReadStream(filePath, { start, end});

        stream.on('open', () => stream.pipe(response));
        stream.on('error', (streamErr) => response.end(streamErr));
    });
};

module.exports.getParty = getParty;