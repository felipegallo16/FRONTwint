# WinTrust Frontend

Frontend para la aplicación WinTrust, una plataforma de sorteos transparentes utilizando World ID para la verificación de humanos.

## Características

- Integración con World ID para verificación de humanos
- Sistema de sorteos transparentes
- Interfaz de usuario moderna y responsive
- Soporte para múltiples idiomas
- Modo demo para pruebas

## Tecnologías

- Next.js 14
- React 19
- TypeScript
- Tailwind CSS
- World ID MiniKit
- PNPM como gestor de paquetes

## Requisitos

- Node.js 18.0 o superior
- PNPM 8.0 o superior
- World App instalada en el dispositivo móvil

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/wintrust-frontend.git
cd wintrust-frontend
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```
Editar `.env.local` con tus configuraciones.

4. Iniciar el servidor de desarrollo:
```bash
pnpm dev
```

## Variables de Entorno

- `NEXT_PUBLIC_API_URL`: URL de la API backend
- `NEXT_PUBLIC_WORLD_APP_ID`: ID de la aplicación en World App
- `NEXT_PUBLIC_APP_ID`: ID alternativo de la aplicación

## Scripts Disponibles

- `pnpm dev`: Inicia el servidor de desarrollo
- `pnpm build`: Construye la aplicación para producción
- `pnpm start`: Inicia la aplicación en modo producción
- `pnpm lint`: Ejecuta el linter
- `pnpm type-check`: Verifica los tipos de TypeScript

## Estructura del Proyecto

```
wintrust-frontend/
├── app/                # Páginas y rutas de Next.js
├── components/         # Componentes reutilizables
├── hooks/             # Hooks personalizados
├── services/          # Servicios y llamadas a API
├── styles/            # Estilos globales
├── types/             # Definiciones de tipos
└── public/            # Archivos estáticos
```

## Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Tu Nombre - [@tutwitter](https://twitter.com/tutwitter)

Link del Proyecto: [https://github.com/tu-usuario/wintrust-frontend](https://github.com/tu-usuario/wintrust-frontend)
