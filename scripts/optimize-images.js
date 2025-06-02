const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  try {
    // Caminho para a pasta de imagens
    const imagesDir = path.join(__dirname, '../public/images');
    
    // Lista todos os arquivos na pasta
    const files = await fs.readdir(imagesDir);
    
    // Filtra apenas arquivos de imagem
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
    );
    
    // Otimiza cada imagem
    for (const file of imageFiles) {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, `optimized/${file}`);
      
      // Cria pasta optimized se não existir
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      // Otimiza a imagem
      await sharp(inputPath)
        .resize(800) // Reduz para 800px de largura máxima
        .jpeg({ quality: 80 }) // Reduz qualidade do JPEG para 80%
        .toFile(outputPath);
      
      console.log(`Otimizada: ${file}`);
    }
    
    console.log('Todas as imagens foram otimizadas com sucesso!');
  } catch (error) {
    console.error('Erro ao otimizar imagens:', error);
  }
}

optimizeImages();
