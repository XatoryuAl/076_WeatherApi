const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = "jakarta";

    const apikey = "TmW3n2IbOKaZxkghOoYB";
    
    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apikey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const lokasi = data.features[0].matching_text;
        const koordinat = data.features[0].geometry.coordinates;

        res.json({
            kota: lokasi,
            koordinat: koordinat
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.get('/api/pilih-lokasi', async (req, res) => {

    const { lat, lon } = req.query;

    const apikey = "TmW3n2IbOKaZxkghOoYB";

    const url =
        `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${apikey}`;

    try {

        const response = await axios.get(url);
        const data = response.data;

        const lokasi =
            data.features[0].matching_text ||
            data.features[0].place_name;

        res.json({
            kota: lokasi,
            koordinat: [lon, lat]
        });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data lokasi"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});