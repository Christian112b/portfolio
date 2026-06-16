# Portafolio Personal

Portafolio personal desarrollado con Next.js 16, React 19 y TypeScript. Aplicación moderna con App Router, estilada con Tailwind CSS v4, integración de API REST externa para gestión de proyectos e imágenes, soporte multilenguaje (i18n) y despliegue en Vercel.

## 🛠️ Tecnologías

- **Next.js 16** - Framework de React con App Router y SSR
- **React 19** - Librería UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS v4** - Estilos utility-first
- **Lucide React** - Iconos
- **ESLint 9** - Linting de código
- **PostgreSQL** - Base de datos (backend externo)
- **Render** - Hosting del backend
- **Vercel** - Hosting del frontend

## 📁 Estructura

```
app/
├── frontend/           # Aplicación Next.js
│   ├── app/           # App Router (páginas y layouts)
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Context API (i18n)
│   ├── public/        # Assets estáticos
│   └── styles/        # Estilos globales
```

## 🚀 Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # Linter
```

## 🌍 Características

- Soporte multilenguaje (ES/EN) con React Context
- Integración con API REST externa
- Gestión de proyectos e imágenes
- Diseño responsive (mobile-first)
- Componentes reutilizables (Button, Badge, Container, Section)
- Optimización de fuentes con Next.js Font

## 🔗 Backend

El frontend consume una API REST alojada en Render:
- `https://backendprojects-otv3.onrender.com/portfolio`

Endpoints principales:
- `GET /projects` - Obtener proyectos
- `POST /addProject` - Crear proyecto
- `PUT /updateProject/:id` - Actualizar proyecto
- `DELETE /deleteProject/:id` - Eliminar proyecto
- `POST /uploadImage` - Subir imagen
- `POST /auth` - Autenticación
