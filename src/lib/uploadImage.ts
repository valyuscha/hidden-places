export const uploadImage = async (file: File): Promise<{ imageUrl: string; publicId: string }> => {
  let finalFile = file;

  if (file.type === 'image/heic' || file.type === 'image/heif') {
    try {
      const heic2any = (await import('heic2any')).default;

      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      }) as BlobPart;

      finalFile = new File(
        [convertedBlob instanceof Blob ? convertedBlob : new Blob([convertedBlob])],
        file.name.replace(/\.(heic|heif)$/i, '.jpg'),
        {
          type: 'image/jpeg',
          lastModified: new Date().getTime()
        }
      );
    } catch (error) {
      console.error('HEIC conversion details:', error);
      throw new Error(`HEIC conversion failed: ${error}`);
    }
  } else {
    console.log(`Using file as-is, type: ${file.type}`);
  }

  const formData = new FormData();
  formData.append('file', finalFile);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
    },
  });

  if (!res.ok) {
    throw new Error('Image upload failed');
  }

  return res.json();
};
