export const resizeImage = (base64, maxSize = 800) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = base64;
    });
  