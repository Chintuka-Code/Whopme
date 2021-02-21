const express = require('express');
const router = express.Router();
const multer = require('multer');

// Config Multer
let DIR = './Image';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        '.' +
        file.originalname.split('.')[file.originalname.split('.').length - 1]
    );
  },
});

const upload = multer({ storage: storage }).single('image');

const CloudConvert = require('cloudconvert');
const apiKEY = process.env.CLOUD_KEY;

const cloudConvert = new CloudConvert(apiKEY);

router.post('', async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        res.json({ err: 1, message: err });
      } else {
        const input = req.body.inputFormat;
        const output = req.body.outputFormat;
        const type = req.body.type;
        const group = req.body.group;
        const filename = req.file.filename;

        let job = await cloudConvert.jobs.create({
          tasks: {
            'import-my-file': {
              operation: 'import/upload',
              url: `../Image/${filename}`,
            },
            'convert-my-file': {
              operation: 'convert',
              input: 'import-my-file',
              output_format: output,
              some_other_option: 'value',
            },
            'export-my-file': {
              operation: 'export/url',
              input: 'convert-my-file',
            },
          },
        });

        res.json({ err: 0, job });
      }
    });
  } catch (error) {
    res.json({ err: 1, message: error.message });
  }
  // res.send(job);
});

module.exports = router;
