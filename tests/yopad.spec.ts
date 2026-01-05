import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const pad = 'https://yopad.eu/p/test-cha';
const title = /test-cha/;

test('reset', async ({ page }) => {
  const file = await createFile();

  await page.goto(pad);

  await expect(page).toHaveTitle(title);

  await page.locator('button[data-l10n-id="pad.toolbar.showusers.title"]').click();
  await page.locator('#myusernameedit').fill('Reset');
  await page.locator('button[data-l10n-id="pad.toolbar.showusers.title"]').click();

  await page.locator('button[data-l10n-id="pad.toolbar.import_export.title"]').click();
  await page.locator('#importfileinput').click();
  await page.setInputFiles('#importfileinput', file);

  page.on('dialog', dialog => dialog.accept());
  await page.locator('#importsubmitinput').click();
  
  await page.waitForTimeout(1000);
});

async function createFile() {
  const templatePath = path.join(__dirname, 'template.html');
  const templateContent = await fs.promises.readFile(templatePath, 'utf-8');

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const today = new Date();
  const now = today.toLocaleDateString('de-CH') + " " + today.toLocaleTimeString('de-CH');
  let content = templateContent.replaceAll('{{now}}', now);

  ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach((day:string, index:number) => {
    const daysUntilDay = ((7+index) - today.getDay()) % 7 || 7;
    const date = new Date(today);
    date.setDate(today.getDate() + daysUntilDay);
    const localeDateString = date.toLocaleDateString('de-CH', options);
    content = content.replaceAll(`{{${day}}}`, localeDateString);
  });
  
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'playwright-'));
  const tempFilePath = path.join(tempDir, 'myfile.html');
  await fs.promises.writeFile(tempFilePath, content);

  return tempFilePath;
}
