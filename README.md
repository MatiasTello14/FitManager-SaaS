# 🏋️‍♂️ FitManager - SaaS para Gestión de Gimnasios

FitManager es una solución integral (SaaS) diseñada para que dueños de gimnasios gestionen sus socios, planes de suscripción y pagos de forma eficiente.

## 🚀 Tecnologías Utilizadas

### Backend
* **Java 17** con **Spring Boot 3**
* **Spring Security** + **JWT** (Autenticación y Autorización)
* **PostgreSQL** (Base de datos relacional)
* **Hibernate/JPA** (Persistencia de datos)
* **Maven** (Gestión de dependencias)
* **Swagger/OpenAPI** (Documentación de la API)

### Frontend (En proceso 🚧)
* **React** + **Vite**
* **Tailwind CSS**
* **Axios**

## 🛡️ Características de Seguridad
* **Autenticación Basada en Tokens (JWT):** Acceso seguro mediante tokens de corta duración.
* **Control de Acceso Basado en Roles (RBAC):** 
  * `ADMIN`: Gestión total del gimnasio, planes y socios.
  * `MEMBER`: Acceso a perfil personal, planes disponibles y estado de pagos.
* **CORS Configurado:** Preparado para conexión segura con el frontend en entornos de desarrollo y producción.

## 📖 Documentación de la API
Una vez ejecutado el proyecto, puedes acceder a la documentación interactiva en:
`http://localhost:8080/swagger-ui/index.html`