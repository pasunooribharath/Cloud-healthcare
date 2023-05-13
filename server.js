const express = require('express');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');

aws.config.update({
  accessKeyId: 'AKIAVG233DTVR3CBIVJH',
  secretAccessKey: '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'
});

const s3 = new aws.S3();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  const bucketName = 'healthcarefeedback';
  const fileName = `${Date.now()}.json`;
  const data = {
    name: req.body.name,
    email: req.body.email,
    feedback: req.body.feedback
  };
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: JSON.stringify(data)
  };
  s3.putObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving feedback to S3');
    } else {
      res.send('Feedback saved to S3');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port: http://localhost:${port}`);
});
