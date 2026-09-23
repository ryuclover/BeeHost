import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import ts from 'typescript';
import { resolveLocale, translate, localizedHref, formatMoney } from '../src/i18n/core.ts';
import { GAMES, FAQ } from '../src/data/catalog.ts';
import messages from '../src/i18n/en.json' with { type: 'json' };

for (const [name, url, saved, languages, expected] of [
  ['Brazilian Portuguese', null, null, ['pt-BR','en-US'], 'pt'],
  ['Portuguese variants', null, null, ['pt-PT'], 'pt'],
  ['English first', null, null, ['en-US','pt-BR'], 'en'],
  ['First supported preference', null, null, ['es-ES','pt-BR','en'], 'pt'],
  ['Unsupported languages', null, null, ['de-DE'], 'en'],
  ['Empty browser preferences', null, null, [], 'en'],
  ['Saved choice wins over browser', null, 'en', ['pt-BR'], 'en'],
  ['Portuguese saved choice', null, 'pt', ['en-US'], 'pt'],
  ['Explicit link wins over saved preference', 'en', 'pt', ['pt-BR'], 'en'],
  ['Invalid preference is ignored', 'xx', 'fr', ['pt-BR'], 'pt'],
]) test(name, () => assert.equal(resolveLocale(url,saved,languages),expected));

test('Localized links preserve game, billing, and fragment', () => {
  assert.equal(localizedHref('/plans.html?game=minecraft&billing=annual#plans','en'), '/plans.html?game=minecraft&billing=annual&lang=en#plans');
  assert.equal(localizedHref('/games.html?lang=en','pt'), '/games.html?lang=pt');
  assert.equal(localizedHref('#games','en'), '#games');
  assert.equal(localizedHref('https://example.com','pt'), 'https://example.com');
  assert.equal(localizedHref('//example.com','pt'), '//example.com');
});
test('Translation interpolates whole sentences in both languages', () => {
  assert.equal(translate('en','Sugestão para {game}',{game:'Minecraft'}),'Suggested for Minecraft');
  assert.equal(translate('pt','Sugestão para {game}',{game:'Minecraft'}),'Sugestão para Minecraft');
  assert.equal(translate('en','{price} cobrados por ano',{price:'$95.88'}),'$95.88 billed yearly');
});
test('Currency remains USD with localized decimal punctuation', () => {
  assert.match(formatMoney('pt',95.88), /US\$\s*95,88/);
  assert.equal(formatMoney('en',95.88),'$95.88');
});
test('All catalog descriptions, categories, and FAQ answers have translations', () => {
  for(const game of GAMES) for(const text of [game.category,game.description]) assert.ok(Object.hasOwn(messages,text),text);
  for(const pair of FAQ) for(const text of pair) assert.ok(Object.hasOwn(messages,text),text);
});
test('Every explicit translation key exists; no untranslated JSX prose remains', () => {
  for(const file of ['src/components/Experience.tsx','src/components/AdventureStory.tsx','src/i18n/LanguageSwitcher.tsx']) {
    const source=fs.readFileSync(file,'utf8');
    const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function walk(node) {
      if(ts.isCallExpression(node) && node.expression.getText(ast)==='t' && ts.isStringLiteral(node.arguments[0])) {
        assert.ok(Object.hasOwn(messages,node.arguments[0].text),node.arguments[0].text);
      }
      if(ts.isJsxText(node)) {
        const text=node.getText(ast).trim();
        assert.ok(!text || ['Bee','host','Beehost','©','.','0','PT','EN'].includes(text), `${file}: untranslated JSX: ${text}`);
      }
      ts.forEachChild(node,walk);
    }
    walk(ast);
  }
});
