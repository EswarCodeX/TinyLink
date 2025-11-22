require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const Link = require('./models/Link');
const { isValidCode, isValidUrl, randomCode } = require('./utils/validate');

const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || 'http://localhost:' + PORT;

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// healthz
app.get('/healthz', (req, res) => {
  res.json({ ok: true, version: '1.0' });
});

// Create link
app.post('/api/links', async (req, res) => {
  const { url, code } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid url' });
  }
  let usedCode = code;
  if (usedCode) {
    if (!isValidCode(usedCode)) return res.status(400).json({ error: 'Custom code must match [A-Za-z0-9]{6,8}' });
    const exists = await Link.findOne({ code: usedCode });
    if (exists) return res.status(409).json({ error: 'Code already exists' });
  } else {
    // generate collision-resistant random code (retry up to few times)
    let tries = 0;
    do {
      usedCode = randomCode();
      const exists = await Link.findOne({ code: usedCode });
      if (!exists) break;
      tries++;
    } while (tries < 5);
  }
  const doc = new Link({ code: usedCode, url });
  await doc.save();
  res.status(201).json({
    code: doc.code,
    url: doc.url,
    shortUrl: `${BASE_URL}/${doc.code}`,
    clicks: doc.clicks,
    createdAt: doc.createdAt
  });
});

// List all links
app.get('/api/links', async (req, res) => {
  const items = await Link.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

// Stats for one code
app.get('/api/links/:code', async (req, res) => {
  const { code } = req.params;
  const doc = await Link.findOne({ code }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Delete link
app.delete('/api/links/:code', async (req, res) => {
  const { code } = req.params;
  const doc = await Link.findOneAndDelete({ code });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

// Redirect route (must be after API routes)
app.get('/:code', async (req, res, next) => {
  // avoid catching /api or /healthz (they are above anyway)
  const { code } = req.params;
  // only accept codes that match spec
  if (!isValidCode(code)) return res.status(404).send('Not found');
  const doc = await Link.findOneAndUpdate(
    { code },
    { $inc: { clicks: 1 }, $set: { lastClicked: new Date() } },
    { new: true }
  );
  if (!doc) return res.status(404).send('Not found');
  // 302 redirect
  res.redirect(302, doc.url);
});

// connect db + start
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => {
    console.log('mongo connected');
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  })
  .catch(err => {
    console.error('mongo connection error', err);
    process.exit(1);
  });
