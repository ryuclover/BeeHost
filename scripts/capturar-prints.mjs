import { chromium } from 'playwright';

async function capturar() {
  console.log('🚀 Iniciando navegador Chromium para capturas Ultra HD...');
  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2 // Ultra HD / Retina 2x
  });

  const page = await context.newPage();

  // 1. Home
  console.log('📸 1/5 Capturando Home...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForSelector('.hero-copy');
  await page.waitForSelector('.game-grid');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/screenshots/01-home.png' });

  // 2. Planos
  console.log('📸 2/5 Capturando Página de Planos...');
  await page.goto('http://127.0.0.1:5173/plans.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('.plan-grid');
  await page.waitForSelector('.plan-card');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/screenshots/02-planos.png' });

  // 3. Checkout PIX Modal com QR Code
  console.log('📸 3/5 Capturando Checkout com PIX e QR Code ao Vivo...');
  await page.goto('http://127.0.0.1:5173/plans.html?game=minecraft', { waitUntil: 'networkidle' });
  await page.waitForSelector('.plan-card.recommended button');
  await page.click('.plan-card.recommended button');
  await page.waitForTimeout(800);

  // Clica no botão Pagar com PIX e Ativar
  const btnPix = page.locator('button:has-text("Pagar com PIX e Ativar")');
  await btnPix.waitFor({ state: 'visible', timeout: 5000 });
  await btnPix.click();
  await page.waitForTimeout(800);

  // Preenche dados do cliente
  await page.fill('input[placeholder*="João da Silva"]', 'Gabriel Gamer');
  await page.fill('input[placeholder*="joao@"]', 'gabriel@beehost.com.br');
  await page.fill('input[placeholder*="119"]', '11999998888');
  await page.fill('input[placeholder*="000.000"]', '123.456.789-00');

  // Submete para gerar o PIX
  await page.click('button:has-text("Gerar Código PIX")');
  await page.waitForSelector('img[alt="QR Code PIX"]', { timeout: 10000 });
  await page.waitForTimeout(1500); // Aguarda renderizar o QR code
  await page.screenshot({ path: 'public/screenshots/03-checkout-pix.png' });

  // 4. Área do Cliente
  console.log('📸 4/5 Capturando Painel do Cliente...');
  await page.goto('http://127.0.0.1:5173/painel-cliente.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('header');
  await page.waitForSelector('text=Área do Cliente');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/screenshots/04-painel-cliente.png' });

  // 5. Painel Admin (Logado com visualização completa do cluster)
  console.log('📸 5/5 Capturando Painel Administrativo do Dono...');
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    sessionStorage.setItem('beehost-admin-token', 'beehost123');
  });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#painel-principal:not(.escondido)', { timeout: 8000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'public/screenshots/05-painel-admin.png' });

  await browser.close();
  console.log('🎉 Todas as 5 capturas foram geradas com altíssima qualidade em public/screenshots/!');
}

capturar().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
