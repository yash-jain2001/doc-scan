import * as pdfjsLib from "pdfjs-dist";

export const convertPdfFirstPageToImage = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(
        new File([blob], "pdf_page_1.png", { type: "image/png" })
      );
    });
  });
};
