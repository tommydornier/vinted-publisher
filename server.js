const express = require('express');
const bodyParser = require('body-parser');
const { publishOnVinted } = require('./publishVinted');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/publish', async (req, res) => {
  try {
    const listingData = req.body;
    await publishOnVinted(listingData);
    res.status(200).json({ message: 'Annonce publiée avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la publication.' });
  }
});

app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`));
