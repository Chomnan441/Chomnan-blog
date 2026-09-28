/**
 * ย่อรูปฝั่ง client ก่อนอัปโหลด (canvas → JPEG)
 * รูปใหญ่แค่ไหนก็ถูกย่อให้อยู่ในกรอบ maxSize
 */
export async function resizeImageFile(
  file,
  { maxSize = 512, quality = 0.85 } = {},
) {
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    throw new Error("Please upload an image file");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = fitWithin(image.width, image.height, maxSize);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not process image");
    }

    ctx.drawImage(image, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    const baseName = file.name.replace(/\.[^.]+$/, "") || "avatar";

    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read image file"));
    image.src = src;
  });
}

function fitWithin(width, height, maxSize) {
  if (width <= maxSize && height <= maxSize) {
    return { width, height };
  }

  if (width >= height) {
    return {
      width: maxSize,
      height: Math.max(1, Math.round((height / width) * maxSize)),
    };
  }

  return {
    width: Math.max(1, Math.round((width / height) * maxSize)),
    height: maxSize,
  };
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}
