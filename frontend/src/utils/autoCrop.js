const autoCropImage = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width * 0.9;
      canvas.height = img.height * 0.9;

      ctx.drawImage(
        img,
        img.width * 0.05,
        img.height * 0.05,
        img.width * 0.9,
        img.height * 0.9,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        resolve(
          new File([blob], file.name, {
            type: file.type,
          })
        );
      }, file.type);
    };

    img.src = URL.createObjectURL(file);
  });
};

export default autoCropImage;

