const fetch = require('node-fetch');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
const cloudinary = require('cloudinary').v2;




pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';




async function extractTextFromPDF(publicId) {
  try {
    const pdfUrl = cloudinary.url(publicId, { resource_type: 'raw', secure: true });
    const response = await fetch(pdfUrl);
    const buffer = await response.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    
    });
    const pdfDocument = await loadingTask.promise;
    const maxPages = pdfDocument.numPages;
    let fullText = '';
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join('\n');
      fullText += pageText;
    }
    return fullText;
  } catch (error) {
    throw new Error(`Error extracting text from PDF: ${error}` );
  }
}
function checkPlagiarism(text1, text2) {
  const cleanText1 = text1.toLowerCase().replace(/[\W_]+/g, '');
  const cleanText2 = text2.toLowerCase().replace(/[\W_]+/g, '');
  const totalChars = Math.max(cleanText1.length, cleanText2.length);
  let matchingChars = 0;
  for (let i = 0; i < totalChars; i++) {
    if (cleanText1[i] === cleanText2[i]) {
      matchingChars++;
    }
  }

  const plagiarismPercentage = matchingChars / totalChars * 100;
  return plagiarismPercentage;
}


module.exports = {
  extractTextFromPDF, checkPlagiarism
};