import sharp from 'sharp';

export const optimizeImage = async (inputPath, outputPath) => {
  try {
    await sharp(inputPath)
      .resize(800) // Reduz para 800px de largura máxima
      .jpeg({ quality: 80 }) // Reduz qualidade do JPEG para 80%
      .toFile(outputPath);
    return true;
  } catch (error) {
    console.error('Erro ao otimizar imagem:', error);
    return false;
  }
};

export const getImageSize = async (path) => {
  try {
    const metadata = await sharp(path).metadata();
    return metadata;
  } catch (error) {
    console.error('Erro ao obter metadados da imagem:', error);
    return null;
  }
};
