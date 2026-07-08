const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const START_PAGE = 994;
const END_PAGE = 1404;
const OUT_PATH = __dirname + '/formulary_raw.txt';

async function main() {
  const buf = fs.readFileSync('C:/Users/hp/myproject/books/harrietlane.pdf');
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  console.log('Total pages:', pdfDoc.numPages);

  const out = fs.createWriteStream(OUT_PATH, { encoding: 'utf8' });

  for (let pageNum = START_PAGE; pageNum <= END_PAGE; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();

    // The right-margin sidebar ("For explanation of icons, see p. 763 FORMULARY") sits at
    // x≈575-577, scattered across the FULL page height (confirmed: body text maxes at x≈548,
    // sidebar starts at x≈551 — clean separation). Left in, its fragments get glued into the
    // middle of body words by the y-proximity line grouper below (e.g. "whenof", "org"+"ic",
    // "Clinistix763") because individual sidebar characters coincidentally land within 2pt of
    // a body line's y-coordinate. Drop it here, at the source, rather than trying to
    // pattern-match mangled fragments after the fact.
    const bodyItems = content.items.filter(item => item.transform[4] <= 549);

    // pdf.js returns items in PDF content-stream order, which is NOT guaranteed to match
    // top-to-bottom visual reading order — headers/footers in particular are often drawn out
    // of flow (e.g. after the main body text in the stream), which previously caused a page's
    // running header ("DRUGNAME continued") to be emitted AFTER that page's real body text,
    // corrupting drug-boundary detection downstream. Sort by y (descending = top of page
    // first), then x (ascending = left to right) to reconstruct true reading order.
    const sortedItems = [...bodyItems].sort((a, b) => {
      const dy = b.transform[5] - a.transform[5];
      if (Math.abs(dy) > 2) return dy;
      return a.transform[4] - b.transform[4];
    });

    // Group text items into lines based on y-coordinate
    const lines = [];
    let currentLine = [];
    let lastY = null;

    for (const item of sortedItems) {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        if (currentLine.length) lines.push(currentLine.join(''));
        currentLine = [];
      }
      currentLine.push(item.str);
      lastY = y;
    }
    if (currentLine.length) lines.push(currentLine.join(''));

    out.write(`\n===PAGE ${pageNum}===\n`);
    out.write(lines.join('\n') + '\n');

    if (pageNum % 50 === 0) console.log('Processed page', pageNum);
  }

  out.end();
  console.log('Done. Output written to', OUT_PATH);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
