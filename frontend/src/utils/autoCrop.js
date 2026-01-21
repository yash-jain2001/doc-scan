const autoCropImage = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const cropPercent = 0.10;

      const cropX = Math.floor(img.width * cropPercent);
      const cropY = Math.floor(img.height * cropPercent);
      const cropWidth = img.width - cropX * 2;
      const cropHeight = img.height - cropY * 2;

      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(
            new File([blob], file.name, { type: file.type || "image/png" }),
          );
        } else {
          resolve(file);
        }
      }, file.type || "image/png");
    };

    img.onerror = () => {
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

export default autoCropImage;
