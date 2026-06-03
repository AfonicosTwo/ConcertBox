# ConcertBox 

Es una plataforma web dedicada a las personas que asisten a conciertos frecuentemente, diseñada para capturar la magia de la música en vivo en un solo lugar. ConcertBox permite a los melómanos llevar una bitácora digital de sus conciertos pasados, descubrir eventos próximos en tiempo real mediante integraciones con APIs globales, redactar reseñas de sus experiencias y personalizar un perfil único que refleje su identidad musical.

---
##  PRACTICA ESCOLAR
### Programación Web
Esta practica es parte de mi primer proyecto web, la practica se elaboro con la intención de conocer los estandares del mundo FrontEnd y BackEnd.

##  Características Principales

* **Exploración de Eventos en Tiempo Real**: Integración directa con la API de **Ticketmaster** para descubrir conciertos y festivales próximos (hasta 50 eventos simultáneos).
* **Bitácora Histórica (Próximos y Pasados)**: Pestañas dedicadas para diferenciar los conciertos futuros de los conciertos pasados en los que los usuarios ya han participado.
* **Sistema de Reseñas y Calificaciones**: Permite a los usuarios redactar reseñas personalizadas, asignar calificaciones por estrellas y añadir tags musicales descriptivos.
* **Perfiles Personalizables**: Los usuarios pueden elegir entre avatares temáticos de instrumentos (Rocker, DJ, Vocalist, Jazz, Drummer, Pianist), añadir una biografía personalizada y editar sus credenciales de seguridad.
* **Autenticación Segura**: Sistema completo de login, registro y persistencia mediante tokens JWT y encriptación de contraseñas con bcrypt.

---

## Stack Tecnológico

### FrontEnd (Cliente)
* **Framework**: React / Next.js
* **Estilos**: Vanilla CSS con variables de diseño personalizadas y modo oscuro nativo.
* **Consumo de API**: Fetch API.

### BackEnd (Servidor)
* **Plataforma**: Node.js con Express.js
* **Base de Datos**: MongoDB Atlas (a través de Mongoose)
* **Herramientas de Desarrollo**: Nodemon para reinicio automático de cambios.

### APIs Externas Integradas
* **Ticketmaster API**: Para obtención de conciertos reales y detalles de eventos.
* **Last.fm API**: Para enriquecimiento de metadatos de artistas.

---

## Estructura del Proyecto

El proyecto está dividido en una arquitectura desacoplada de FrontEnd y BackEnd:

```
ConciertBox/
│
├── Practica6_ConcertBox/          # Aplicación FrontEnd (Next.js)
│   ├── src/
│   │   ├── components/            # Componentes reutilizables (Navbar, Cards, Modales)
│   │   ├── pages/                 # Páginas y enrutamiento (Explorar, Conciertos, Perfil, Login)
│   │   ├── services/              # Clientes de API y peticiones de red
│   │   └── utils/                 # Datos ficticios y helpers
│   └── package.json
│
└── Practica7_ConcertBox-Backend/  # Aplicación BackEnd (Express.js)
    ├── src/
    │   ├── config/                # Conexión a Base de Datos
    │   ├── controllers/           # Controladores de negocio (Auth, Reviews, External)
    │   ├── middlewares/           # Middleware de autenticación JWT
    │   ├── models/                # Esquemas de Mongoose (User, Review)
    │   ├── routes/                # Rutas expuestas de la API
    │   └── server.js              # Punto de entrada principal
    └── package.json
```

---

## Configuración e Instalación

### Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior).
* Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para la base de datos (u otra instancia local).

---

### Paso 1: Configurar el BackEnd

1. Navega a la carpeta del servidor:
   ```bash
   cd Practica7_ConcertBox-Backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz de `Practica7_ConcertBox-Backend` con las siguientes variables:
   ```env
   PORT=5000
   MONGODB_URI=tu_conexion_de_mongodb_atlas
   JWT_SECRET=tu_palabra_secreta_jwt
   TICKETMASTER_API_KEY=tu_api_key_de_ticketmaster
   LASTFM_API_KEY=tu_api_key_de_lastfm
   ```
4. Levanta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

---

### Paso 2: Configurar el FrontEnd

1. Abre una nueva terminal y navega a la carpeta del cliente:
   ```bash
   cd Practica6_ConcertBox
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env.local` en la raíz de `Practica6_ConcertBox` para configurar el endpoint del BackEnd:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Levanta el cliente en modo desarrollo:
   ```bash
   npm run dev
   ```

---

##  Seguridad e Ignorado de Archivos
Este repositorio cuenta con reglas estrictas en `.gitignore` para garantizar que la información sensible no sea expuesta:
* Los archivos `.env` y `.env.local` que contienen llaves privadas están completamente excluidos de las cargas.
* Las carpetas temporales de compilación (`.next/`) y librerías (`node_modules/`) están debidamente ignoradas para optimizar el tamaño del repositorio.
