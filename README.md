# 🏋️‍♂️ FitManager - SaaS para Gestión Integral de Gimnasios

FitManager es una solución **Full Stack** diseñada para digitalizar la administración de gimnasios. Permite a los dueños controlar el flujo de caja, gestionar la morosidad de socios en tiempo real y administrar planes de suscripción de forma dinámica con una arquitectura escalable.


### 🔐 Registro de nuevos Gimnasios

https://github.com/user-attachments/assets/ff1f4e38-d7cb-47ef-bec3-87a6f78481bf



## 📺 Demo Visual

https://github.com/user-attachments/assets/89fb8504-fffa-4318-8e57-d3d2ce1fd728


---

## 🚀 Stack Tecnológico

### Backend (Robustez y Seguridad)
* **Java 17** con **Spring Boot 3**.
* **Spring Security + JWT**: Autenticación stateless para proteger los datos de los gimnasios.
* **PostgreSQL**: Base de datos relacional para una persistencia sólida.
* **Hibernate/JPA**: Gestión de relaciones complejas (Socio -> Plan -> Pagos).
* **Maven**: Gestión de dependencias.

### Frontend (Experiencia de Usuario)
* **React 18 + Vite**: SPA de alto rendimiento.
* **Tailwind CSS**: Interfaz moderna con "Dark Mode" nativo.
* **Axios**: Cliente HTTP con interceptores para manejo de tokens.
* **React Router Dom**: Gestión de rutas protegidas.

---

## 💎 Funcionalidades Destacadas

* **📊 Dashboard Inteligente:** Visualización en tiempo real de ingresos, socios activos y métricas de morosidad.
* **💳 Sistema de Cobros:** Registro de pagos con validación de planes vigentes y actualización automática.
* **🔍 Gestión de Socios:** Buscador avanzado por DNI/Nombre y edición dinámica de perfiles.
* **⚙️ Configuración de Planes:** CRUD completo con lógica de "Soft Delete" y reactivación inteligente (evita duplicados).
* **🔐 Multi-Gym Ready:** Estructura preparada para aislar datos por cada administrador de gimnasio.

---

## 🏗️ Arquitectura del Proyecto
* **Frontend:** Organizado por `pages/`, `components/`, `services/` y `config/`.
* **Backend:** Arquitectura en capas (**Controller, Service, Repository, DTO**) garantizando la separación de responsabilidades.

---

## 🛠️ Instalación y Configuración

### Requisitos
* JDK 17 o superior.
* Node.js & npm.
* PostgreSQL corriendo localmente.

1. **Base de Datos:**
    - Crear una base de datos llamada `fitmanager`.
    - Configurar credenciales en `src/main/resources/application.properties`.

2. **Backend:**
   ```bash
   cd backend
   mvn spring-boot:run

3. **Frontend:**
   ```bash
    cd frontend
    npm install
    npm run dev
   
## 📖 API Documentation
Acceso a la documentación interactiva (Swagger):
http://localhost:8080/swagger-ui/index.html
