# DocMan - Document Management System

A full-stack document management application built with Angular and Spring Boot, featuring a rich text editor powered by Quill. Inspired by Notion and Confluence, DocMan provides a clean and intuitive interface for creating, editing, and managing documents.

## Features

- **Rich Text Editor**: Powered by Quill with full formatting capabilities
- **Document Management**: Create, edit, delete, and organize documents
- **Auto-Save**: Documents are automatically saved as you type
- **Notion-like UI**: Clean, modern interface inspired by Notion and Confluence
- **Responsive Design**: Works seamlessly on desktop browsers
- **Real-time Updates**: Changes are persisted immediately to the backend

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java framework for building the REST API
- **Spring Data JPA** - Data persistence layer
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management

### Frontend
- **Angular 17** - Frontend framework
- **Quill** - Rich text WYSIWYG editor
- **ngx-quill** - Angular integration for Quill
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **npm** or **yarn**
- **Maven 3.6+**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd docman
```

### 2. Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

**H2 Database Console** (for development):
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:docmandb`
- Username: `sa`
- Password: (leave empty)

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on `http://localhost:4200`

## Usage

1. **Open the application** in your browser at `http://localhost:4200`
2. **Create a new document** by clicking the "+ New Document" button in the sidebar
3. **Enter a title** and press Enter or click "Create"
4. **Start writing** in the rich text editor
5. **Format your text** using the toolbar (bold, italic, headers, lists, etc.)
6. **Auto-save** - Your changes are automatically saved as you type
7. **Switch documents** by clicking on them in the sidebar
8. **Delete documents** by clicking the × button that appears when hovering over a document

## Project Structure

```
docman/
├── backend/                     # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/docman/
│   │   │   │   ├── config/      # CORS configuration
│   │   │   │   ├── controller/  # REST API controllers
│   │   │   │   ├── model/       # Entity models
│   │   │   │   ├── repository/  # JPA repositories
│   │   │   │   ├── service/     # Business logic
│   │   │   │   └── DocManApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/                    # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── models/          # TypeScript interfaces
    │   │   ├── services/        # API services
    │   │   ├── app.component.*  # Main component
    │   │   └── app.routes.ts
    │   ├── assets/
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

## API Endpoints

### Documents API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | Get all documents |
| GET | `/api/documents/{id}` | Get document by ID |
| POST | `/api/documents` | Create new document |
| PUT | `/api/documents/{id}` | Update document |
| DELETE | `/api/documents/{id}` | Delete document |

### Request/Response Examples

**Create Document:**
```json
POST /api/documents
{
  "title": "My First Document",
  "content": "<p>Hello World!</p>"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "My First Document",
  "content": "<p>Hello World!</p>",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

## Development

### Backend Development

The backend uses Spring Boot with auto-reload enabled. Any changes to Java files will trigger a recompilation.

To run tests:
```bash
cd backend
mvn test
```

### Frontend Development

The Angular CLI provides hot-reload during development. Changes to TypeScript, HTML, or CSS files will automatically refresh the browser.

To run tests:
```bash
cd frontend
npm test
```

To build for production:
```bash
npm run build
```

## Database

The application uses H2 in-memory database by default. Data will be lost when the application restarts.

To use a persistent database (e.g., PostgreSQL or MySQL), update `application.properties`:

```properties
# PostgreSQL example
spring.datasource.url=jdbc:postgresql://localhost:5432/docmandb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

Don't forget to add the appropriate JDBC driver dependency in `pom.xml`.

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
- The backend is running on `http://localhost:8080`
- The frontend is running on `http://localhost:4200`
- The CORS configuration in `CorsConfig.java` includes your frontend URL

### Port Already in Use
- **Backend (8080)**: Change `server.port` in `application.properties`
- **Frontend (4200)**: Run `ng serve --port 4201`

### Database Connection Issues
- Check H2 console at `http://localhost:8080/h2-console`
- Verify JDBC URL: `jdbc:h2:mem:docmandb`
- Username: `sa`, Password: (empty)

## Future Enhancements

- User authentication and authorization
- Document sharing and collaboration
- Document folders/organization
- Search functionality
- Export to PDF/Markdown
- Version history
- Real-time collaborative editing
- Dark mode
- Mobile responsive design

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
