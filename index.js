const express = require('express')
const app = express()
const port = 3000

const os = require('os');
const winston = require('winston');
require('winston-syslog');

const papertrail = new winston.transports.Syslog({
  host: 'logs4.papertrailapp.com',
  port: 25695,
  protocol: 'tls4',
  localhost: os.hostname(),
  eol: '\n',
});

const logger = winston.createLogger({
  format: winston.format.simple(),
  levels: winston.config.syslog.levels,
  transports: [papertrail],
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/episodes/:filename', (req, res, next) => {
  const fs = require('fs');
  const https = require('https');
  const filename = req.params.filename;
  const path = `public/episodes/${filename}`;
  logger.info(`--`);
  console.log(`FILENAME: ${filename}`);

  // if (!fs.existsSync(path)) {
  //   console.log('NO existe, hay que descargarlo');
  //   // const url = 'https://stream.studeo.buildonlinestaging.com/episodes/bc9e95de-95f3-4786-b5c0-f15bade57a93/stream?update=1669667334.mp3';
  //   const url = 'https://traffic.megaphone.fm/REP3352487916.mp3';
  //   const file = fs.createWriteStream(path);

  //   https.get(url, res => {
  //     // Write data into local file
  //     res.pipe(file);
  //     // Close the file
  //     file.on('finish', () => {
  //       file.close();
  //       console.log(`File downloaded!`);
  //     });
  //     file.on('error', function (err) {
  //       fs.unlink(dest); // Delete the file async. (But we don't check the result)
  //       console.log('Error: ', err);
  //       console.log('Error: ', err.message);
  //     });
  //   });
  // }

  // console.log('Sigue');

  if (req && req.headers && req.headers.range) {
    logger.info(`time: ${Date()}`);
    console.log(`time: ${Date()}`);
    logger.info("HEADERS RANGE", req.headers.range);
    console.log("HEADERS RANGE", req.headers.range);
    const range = req.headers.range;
    const ranges = range.substring(range.indexOf('=') + 1).split('-');
    if (ranges.length) {
      const start = ranges[0];
      const end = ranges[1];
      logger.info('start:', start);
      logger.info('end:', end);

      console.log('start:', start);
      console.log('end:', end);
    }
  } else {
    logger.info('no entra')
    console.log('no entra');
  }
    // res.send(req.params)
    next();
})

// module.exports = function (req, res, next) {
//   var end = res.end;

//   res.end = function () {
//       res.end = end;
//       res.emit('finishBeforeSocketDestroy');
//       res.end.apply(this, arguments);
//   }

//   next();
// }

// app.use(express.static('public'))
const path = require('path');
app.use(express.static(path.join(__dirname, "public")));

// var pollTime = 1000;
// module.exports = function (req, res, next) {
//     var pollInterval;

//     function pollStats () {
//       console.log('entra pollstats');
//         if (typeof req.stats._lastMeasuredTime === 'object') {
//             var secondsSinceLastMeasurement = ((new Date() - req.stats._lastMeasuredTime) / 1000);
//             req.stats.averageRate = {
//                 read: (req.socket.bytesRead - req.stats.bytesRead) / secondsSinceLastMeasurement,
//                 write: (req.socket.bytesWritten - req.stats.bytesWritten) / secondsSinceLastMeasurement
//             };
//         }
//         req.stats._lastMeasuredTime = new Date();
//         req.stats.bytesRead = req.socket.bytesRead;
//         req.stats.bytesWritten = req.socket.bytesWritten;
//     }

//     req.stats = {
//         startTime: new Date(),
//         endTime: null,
//         averageRate: {read: null, write: null},
//         bytesRead: req.socket.bytesRead,
//         bytesWritten: req.socket.bytesWritten,
//         _lastMeasuredTime: new Date()
//     };

//     pollInterval = setInterval(pollStats, pollTime);

//     res.on('finishBeforeSocketDestroy', function () {
//       console.log('entra finishBeforeSocketDestroy');
//         clearInterval(pollInterval);
//         pollStats();
//         req.stats.endTime = new Date();
//     });

//     next();
// }