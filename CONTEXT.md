INSTRUCCIONES DE CONTEXTO DEL PROYECTO (ACTÚA COMO DESARROLLADOR SENIOR)

Proyecto: "ConcertBox" (Anteriormente LiveLog).
Naturaleza: Proyecto individual académico. Plataforma web interactiva que funciona como bitácora y red de reseñas de conciertos en vivo.

ESTADO ACTUAL:
- El FrontEnd ya está desarrollado y estructurado (SPA).
- Tecnologías FrontEnd: React, Next.js, Tailwind CSS.
- Vistas listas: Dashboard, Ficha de Artista dinámica, Perfil de usuario y Modal de Reseñas.

MISIÓN ACTUAL: 
Desarrollar el BackEnd desde cero asegurando una integración perfecta con el FrontEnd existente.

STACK TÉCNICO A UTILIZAR ESTRICTAMENTE PARA EL BACKEND:
- Entorno: Node.js
- Framework: Express.js
- Base de Datos: MongoDB (usando Mongoose como ODM).
- Seguridad: Bcrypt.js (para hashing de contraseñas) y jsonwebtoken (JWT para autenticación stateless).
- Arquitectura: MVC (Modelo-Vista-Controlador) enfocado a microservicios.

ESTRUCTURA DE CARPETAS OBLIGATORIA:
Todo el código fuente debe ir dentro de la carpeta `/src`. Debes separar estrictamente las responsabilidades en: 
- `/config` (conexión a DB)
- `/models` (Esquemas de Mongoose)
- `/controllers` (Lógica de negocio pura)
- `/routes` (Definición de endpoints usando Express Router)
- `/middlewares` (Validación de JWT). 
Nunca mezcles lógica de controladores dentro de los archivos de rutas.

REGLAS DE DESARROLLO:
1. No sugieras tecnologías fuera de este stack (ej. no sugieras MySQL o sesiones por cookies).
2. Escribe código moderno (ES6+, async/await, try/catch).
3. Explica brevemente qué hace cada archivo que me generes antes de darme el bloque de código.