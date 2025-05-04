IP Registry

Tokani is a pioneering platform designed to establish an autonomous Intellectual Property (IP) registry on the Camp Network blockchain, focusing on the invaluable genetic and agronomic diversity of endemic seeds. Facing the risk of non-consensual use and lack of attribution threatening the creators and custodians of biological resources (similar to what happens with digital content and AI), Tokani leverages Camp's Origin Framework to tokenize and register this unique IP on-chain. The goal is to grant sovereignty and control to the original creators – indigenous communities, traditional farmers, and collaborating institutions – over their genetic heritage

## 🌱 Características

- **Registro de Semillas**: Permite registrar semillas y recursos genéticos con sus características únicas
- **Protección de IP**: Utiliza blockchain para asegurar la propiedad intelectual de las semillas
- **Metadatos Detallados**: Almacena información importante como:
  - Especie (e.g., Zea mays, Phaseolus vulgaris)
  - Distribución geográfica
  - Comunidad custodiana
  - Ubicación
  - Términos de uso comercial
  - Permisos para obras derivadas

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - CAMP TECH
  - Next.js
  - React
  - Tailwind CSS
  - Framer Motion (animaciones)
  - Wagmi (integración con blockchain)
  - RainbowKit (conexión de wallet)
    

- **Blockchain**:
  - Contratos inteligentes en CAMP
  - IPFS para almacenamiento de metadatos
  - Pinata para gestión de IPFS

##  Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/ip-frontend.git
cd ip-frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configurar las variables de entorno:
Crea un archivo `.env.local` con:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=tu_direccion_de_contrato
PINATA_API_KEY=tu_api_key
PINATA_SECRET_API_KEY=tu_secret_api_key
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 📝 Uso

1. Conecta tu wallet (MetaMask o similar)
2. Completa el formulario con la información de la semilla:
   - Sube la información genética de la semilla de origen nativo mexicana
   - Describe la semilla
   - Especifica la especie
   - Indica la distribución geográfica
   - Define los términos de uso
3. Registra la semilla en la blockchain
4. Recibe un NFT que representa tu propiedad intelectual



 ##🔒 Seguridad

- Conexión segura con blockchain
- Almacenamiento descentralizado en IPFS
- Protección de datos sensibles
- Verificación de propiedad mediante NFTs

##🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request


