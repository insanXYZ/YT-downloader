const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

app.post('/', async (req, res) => {
  try {
    const { url , resolusi } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL YouTube tidak ditemukan' });
    }

    // Mendapatkan informasi video dari URL YouTube
    const info = await ytdl.getInfo(url);

    // Mengatur header respons untuk stream video
    res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Mengunduh dan mengirim video sebagai respons
    ytdl(url, { quality: resolusi }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengunduh video' });
  }
});


app.listen(3000, () => {
  console.log('server running on http://localhost:3000');
})