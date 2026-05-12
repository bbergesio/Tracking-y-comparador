# Design System: Envido

Sistema de diseño "Minimalista Premium" inspirado en Apple y Uber.

## Identidad Visual
- **Nombre**: Envido
- **Estilo**: Limpieza, espacios amplios, desenfoques (glassmorphism).

## Colores
- **Acciones (Electric Blue)**: `#007AFF`
- **Texto (Deep Navy)**: `#172B4D`
- **Fondo (Smoke Gray)**: `#F5F5F7`
- **Superficie (White)**: `#FFFFFF`
- **Bordes/Divisores**: `#E5E5EA`
- **Sombra Suave**: `0 8px 30px rgba(0, 0, 0, 0.04)`

## Tipografía
- **Fuente**: 'Inter' (como alternativa a San Francisco).
- **Pesos**: Regular (400), Medium (500), SemiBold (600).

## Componentes Core
- **Bordes**: Redondeados extremos (`24px`).
- **Botones**:
  - `Pill/Cápsula`: `border-radius: 50px`.
  - `Primary`: Fondo `#007AFF`, texto blanco.
  - `Secondary`: Fondo `#E5F1FF` (azul muy claro), texto `#007AFF`.
  - `Ghost`: Sin fondo, solo texto con flecha.
- **Tarjetas (Uber-style)**: 
  - Fondo blanco, bordes 24px, sombra muy sutil.
  - Hover: `scale(1.02)` con transición suave.

## Estructura de Pantallas
1. **Home (Búsqueda)**: Foco en input minimalista y selección de correos.
2. **Resultados (Tracking)**: Timeline descendente con tarjeta de estado destacada.
3. **Cotizador (Home)**: Formulario de ruta y dimensiones con inputs segmentados.
4. **Resultados (Cotización)**: Comparativa de precios con tarjeta de resumen superior.
5. **Registro/Pago**: Flujo de conversión minimalista con cards centradas.
6. **Dashboard**: Vista de usuario con barra de progreso y lista de historial.

## Interacciones
- **Transiciones**: Animaciones `animate-up` para la entrada de contenido.
- **Glassmorphism**: Efectos de desenfoque en la barra de navegación superior.

## Responsividad
- En móviles (max-width: 768px), los botones de acción se apilan verticalmente y los títulos ajustan su tamaño dinámicamente.
