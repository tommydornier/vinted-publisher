const puppeteer = require('puppeteer');
const path = require('path');

async function publishOnVinted(listingData) {
  // Lancement du navigateur en mode headless sans spécifier d'executablePath,
  // ce qui permet à Puppeteer de télécharger et utiliser sa propre version de Chromium
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);

  // Aller sur la page de login de Vinted
  await page.goto('https://www.vinted.fr/member/general/login');

  // Automatiser le login (vérifiez et ajustez les sélecteurs si nécessaire)
  await page.waitForSelector('input[name="login[username]"]');
  await page.type('input[name="login[username]"]', listingData.email, { delay: 50 });
  await page.type('input[name="login[password]"]', listingData.password, { delay: 50 });
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Naviguer vers la page de création d’annonce (à adapter selon l’URL actuelle)
  await page.goto('https://www.vinted.fr/annonces/nouvelle-annonce');

  // Remplir le formulaire (vérifiez les sélecteurs)
  await page.waitForSelector('input[name="title"]');
  await page.type('input[name="title"]', listingData.titre, { delay: 50 });
  await page.waitForSelector('textarea[name="description"]');
  await page.type('textarea[name="description"]', listingData.description, { delay: 50 });

  // Upload d’images
  const fileInput = await page.$('input[type="file"]');
  // Ici, on suppose que vous avez déjà les images dans un dossier 'tmp' dans le repository.
  // Pour tester, vous pouvez ajouter quelques images dans ce dossier ou ajuster la logique.
  await fileInput.uploadFile(
    path.resolve(__dirname, 'tmp', 'image1.jpg'),
    path.resolve(__dirname, 'tmp', 'image2.jpg')
  );

  // Cliquer sur le bouton de publication
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await browser.close();
}

module.exports = { publishOnVinted };
