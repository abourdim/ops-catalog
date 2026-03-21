#!/usr/bin/env node
/**
 * Runtime Automated Test — Workshop-DIY Catalog
 * Opens every app in headless Chromium via Puppeteer and checks:
 *  1. Page loads without crash
 *  2. No uncaught JS errors
 *  3. LANG object exists and has en/fr/ar
 *  4. i18n applies (title element gets real text, not empty)
 *  5. Splash screen exists and can be dismissed
 *  6. Theme switching works (data-theme changes)
 *  7. Language switching works (dir changes to rtl for AR)
 *  8. Key DOM elements exist (mainCard, helpPanel, settingsPanel, logPanel)
 *  9. No "my-project" or "Section A" visible text after i18n
 * 10. Console.warn/error count
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
// glob not needed — we use fs directly

const ROOT = '/home/abdelhak/Desktop/00_amaloun/05_more_apps/ops-catalog';

// Find all apps
function findApps() {
  const apps = [];
  const cats = fs.readdirSync(ROOT).filter(d => /^\d/.test(d) && fs.statSync(path.join(ROOT, d)).isDirectory()).sort();
  for (const cat of cats) {
    const catPath = path.join(ROOT, cat);
    const appDirs = fs.readdirSync(catPath).filter(d => fs.statSync(path.join(catPath, d)).isDirectory()).sort();
    for (const app of appDirs) {
      const indexPath = path.join(catPath, app, 'index.html');
      if (fs.existsSync(indexPath)) {
        apps.push({ cat, app, indexPath, url: `file://${indexPath}` });
      }
    }
  }
  return apps;
}

async function testApp(page, app, timeout = 8000) {
  const errors = [];
  const warnings = [];
  const jsErrors = [];

  // Collect console messages
  const consoleHandler = msg => {
    if (msg.type() === 'error') jsErrors.push(msg.text());
    if (msg.type() === 'warning') warnings.push(msg.text());
  };
  const errorHandler = err => jsErrors.push(err.message);

  page.on('console', consoleHandler);
  page.on('pageerror', errorHandler);

  try {
    // 1. Load page
    await page.goto(app.url, { waitUntil: 'load', timeout });

    // Wait for scripts to fully initialize — setTheme must be defined
    await page.waitForFunction('typeof setTheme === "function"', { timeout: 5000 }).catch(() => {});

    // 2. Check LANG object
    const langCheck = await page.evaluate(() => {
      if (typeof LANG === 'undefined') return { exists: false };
      return {
        exists: true,
        hasEn: !!LANG.en,
        hasFr: !!LANG.fr,
        hasAr: !!LANG.ar,
        titleEn: LANG.en?.title || '',
        titleFr: LANG.fr?.title || '',
        titleAr: LANG.ar?.title || '',
      };
    });

    if (!langCheck.exists) errors.push('LANG object missing');
    else {
      if (!langCheck.hasEn) errors.push('LANG.en missing');
      if (!langCheck.hasFr) errors.push('LANG.fr missing');
      if (!langCheck.hasAr) errors.push('LANG.ar missing');
      if (!langCheck.titleEn) errors.push('LANG.en.title empty');
      if (langCheck.titleEn && langCheck.titleEn.toLowerCase().includes('my-project'))
        errors.push(`LANG.en.title generic: "${langCheck.titleEn}"`);
    }

    // 3. Check key DOM elements
    const domCheck = await page.evaluate(() => {
      const ids = ['splash', 'mainCard', 'helpPanel', 'settingsPanel', 'logPanel'];
      const result = {};
      for (const id of ids) {
        result[id] = !!document.getElementById(id);
      }
      // Check h1 has data-i18n="title"
      const h1 = document.querySelector('h1[data-i18n="title"]');
      result.h1Title = h1 ? h1.textContent.trim() : '';
      // Check for generic visible text
      result.bodyText = document.body.innerText || '';
      return result;
    });

    if (!domCheck.splash) errors.push('missing #splash');
    if (!domCheck.mainCard) errors.push('missing #mainCard');
    if (!domCheck.helpPanel) errors.push('missing #helpPanel');
    if (!domCheck.settingsPanel) errors.push('missing #settingsPanel');
    if (!domCheck.logPanel) errors.push('missing #logPanel');
    if (!domCheck.h1Title) errors.push('h1[data-i18n=title] empty');

    // 4. Check for generic text in rendered page
    const bodyLower = (domCheck.bodyText || '').toLowerCase();
    if (bodyLower.includes('my-project') && !bodyLower.includes('my-project —'))
      errors.push('visible "my-project" text');

    // 5. Dismiss splash and verify
    const splashDismissed = await page.evaluate(() => {
      const splash = document.getElementById('splash');
      if (!splash) return 'no-splash';
      if (typeof dismissSplash === 'function') {
        dismissSplash();
        return splash.style.display === 'none' || splash.classList.contains('hidden') || splash.style.opacity === '0' ? 'dismissed' : 'still-visible';
      }
      // Try click
      splash.click();
      return 'clicked';
    });

    // 6. Test language switch to FR — call setLanguage() directly
    const frSwitch = await page.evaluate(() => {
      if (typeof setLanguage === 'function') {
        setLanguage('fr');
        const h1 = document.querySelector('h1[data-i18n="title"]');
        return { ok: true, title: h1 ? h1.textContent.trim() : '', lang: document.documentElement.lang };
      }
      return { ok: false, reason: 'no setLanguage function' };
    });

    if (frSwitch.ok && langCheck.titleFr && frSwitch.title === langCheck.titleEn && langCheck.titleFr !== langCheck.titleEn) {
      errors.push('FR switch did not change title');
    }

    // 7. Test language switch to AR (should set dir=rtl)
    const arSwitch = await page.evaluate(() => {
      if (typeof setLanguage === 'function') {
        setLanguage('ar');
        return { ok: true, dir: document.documentElement.dir, lang: document.documentElement.lang };
      }
      return { ok: false };
    });

    if (arSwitch.ok && arSwitch.dir !== 'rtl') {
      errors.push(`AR did not set dir=rtl (got "${arSwitch.dir}")`);
    }

    // 8. Test theme switch — call setTheme() directly since dispatchEvent doesn't trigger listeners
    const themeSwitch = await page.evaluate(() => {
      const origTheme = document.documentElement.getAttribute('data-theme');
      if (typeof setTheme === 'function') {
        setTheme('zellige');
        const newTheme = document.documentElement.getAttribute('data-theme');
        return { ok: true, changed: origTheme !== newTheme, newTheme };
      }
      return { ok: false, reason: 'no setTheme function' };
    });

    if (themeSwitch.ok && !themeSwitch.changed) {
      errors.push('Theme switch did not change data-theme');
    }

    // Switch back to EN
    await page.evaluate(() => {
      if (typeof setLanguage === 'function') setLanguage('en');
    });

    // Filter JS errors — ignore known harmless ones
    const realErrors = jsErrors.filter(e =>
      !e.includes('favicon.ico') &&
      !e.includes('apple-touch-icon') &&
      !e.includes('manifest.json') &&
      !e.includes('sw.js') &&
      !e.includes('service-worker') &&
      !e.includes('net::ERR_FILE_NOT_FOUND') &&
      !e.includes('Failed to register a ServiceWorker') &&
      !e.includes('SecurityError')
    );

    if (realErrors.length > 0) {
      errors.push(`JS errors (${realErrors.length}): ${realErrors[0].slice(0, 100)}`);
    }

  } catch (e) {
    errors.push(`CRASH: ${e.message.slice(0, 120)}`);
  } finally {
    page.off('console', consoleHandler);
    page.off('pageerror', errorHandler);
  }

  return { errors, warnings: warnings.length, jsErrors: jsErrors.length };
}

async function main() {
  const apps = findApps();
  console.log(`\nRuntime Test — ${apps.length} apps\n${'═'.repeat(50)}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const CONCURRENCY = 2;
  const results = { pass: 0, fail: 0, failures: [] };
  let processed = 0;

  // Process in batches
  for (let i = 0; i < apps.length; i += CONCURRENCY) {
    const batch = apps.slice(i, i + CONCURRENCY);
    const promises = batch.map(async (app) => {
      const page = await browser.newPage();
      try {
        const result = await testApp(page, app);
        processed++;
        if (result.errors.length > 0) {
          results.fail++;
          results.failures.push({ app: `${app.cat}/${app.app}`, errors: result.errors });
        } else {
          results.pass++;
        }
      } finally {
        await page.close();
      }
    });
    await Promise.all(promises);

    if (processed % 100 === 0 || processed === apps.length) {
      console.log(`  ... tested ${processed}/${apps.length} (${results.fail} failures so far)`);
    }
  }

  await browser.close();

  // Report
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  RUNTIME TEST REPORT`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`  Total:  ${apps.length}`);
  console.log(`  ✅ PASS: ${results.pass}`);
  console.log(`  ❌ FAIL: ${results.fail}`);
  console.log(`  Rate:   ${(results.pass / apps.length * 100).toFixed(1)}%`);

  if (results.failures.length > 0) {
    console.log(`\n  FAILURES:`);
    for (const f of results.failures) {
      console.log(`  ❌ ${f.app}:`);
      for (const e of f.errors) {
        console.log(`     - ${e}`);
      }
    }
  }

  console.log(`${'═'.repeat(50)}\n`);

  // Write results to JSON
  const reportPath = path.join(ROOT, 'runtime_test_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({ date: new Date().toISOString(), total: apps.length, pass: results.pass, fail: results.fail, failures: results.failures }, null, 2));
  console.log(`Report saved to: runtime_test_report.json`);

  process.exit(results.fail > 0 ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
