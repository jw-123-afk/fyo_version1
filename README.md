# Flask Docker Application with Multiple Modules

This project demonstrates a **Flask web application** structured with **3 modules** using **Flask blueprints**, a **Docker setup** for easy containerization, and **data volume mounting** for persistent data storage.

## Project Structure

The project is organized as follows:

```
flask-docker-app/
│
├── app/                # Main Flask application
│   ├── __init__.py     # Initializes Flask app and registers blueprints
│   ├── config.py       # Configuration settings for the app
│   ├── extensions.py   # Flask extensions (e.g. DB, Cache, etc.)
│   │
│   ├── module1/        # Module 1 blueprint (module1 routes and views)
│   │   ├── __init__.py
│   │   └── routes.py   # Routes for module 1
│   │
│   ├── module2/        # Module 2 blueprint (module2 routes and views)
│   │   ├── __init__.py
│   │   └── routes.py   # Routes for module 2
│   │
│   ├── module3/        # Module 3 blueprint (module3 routes and views)
│   │   ├── __init__.py
│   │   └── routes.py   # Routes for module 3
│   │
│   ├── templates/      # HTML templates (Jinja2)
│   └── static/         # Static assets (CSS, JS, Images)
│
├── data/               # Folder for persistent data (e.g., files, datasets)
│   └── example.json    # Example data file used by the app
│
├── tests/              # Optional folder for unit tests
│   └── test_basic.py   # Example test file
│
├── Dockerfile          # Dockerfile to build the image for Flask app
├── docker-compose.yml  # Docker Compose configuration for running the app
├── requirements.txt    # Python dependencies for the app
└── README.md           # Project description and instructions
```

## Core Concepts

### Flask Modules (Blueprints)

The app is divided into **three modules** (`module1`, `module2`, `module3`), each defined as a **Flask blueprint**. Blueprints allow for better organization and separation of concerns, making it easier to manage larger Flask applications.

* **`module1/`**: Contains the routes for the first module. Can be accessed via `/module1`.
* **`module2/`**: Contains the routes for the second module. Can be accessed via `/module2`.
* **`module3/`**: Contains the routes for the third module. Can be accessed via `/module3`. It also includes an endpoint (`/data`) to fetch data from a file stored in the `data/` folder.

### Docker Setup

The project is set up to run inside a **Docker container**, which allows for consistent environments across different machines.

* The `Dockerfile` specifies how to build the app's image.
* **Docker Compose** (`docker-compose.yml`) helps to manage the services, including setting up the app container, mounting the code for live updates, and ensuring data persistence.

### Mounted Data Folder

The `data/` folder is **mounted from the host system** into the Docker container to persist data (e.g., uploaded files, JSON data, logs) across container restarts. This means that changes made to files inside the `data/` folder on your machine will be reflected inside the container.

---

## Setting Up The Application

### Prerequisites

Make sure you have the following installed:

* **Docker**: For containerization and running the app
* **Docker Compose**: To manage multi-container applications (included with Docker Desktop)

### Install Dependencies

First, make sure you have the required Python dependencies by creating a virtual environment and installing them:

```bash
pip install -r requirements.txt
```

### Running the App with Docker

1. **Build and run the application** using Docker Compose:

```bash
docker-compose up --build
```

2. **Access the application** in your browser at `http://localhost:5000`.

   * **Module 1**: `http://localhost:5000/module1`
   * **Module 2**: `http://localhost:5000/module2`
   * **Module 3**: `http://localhost:5000/module3`

   You can also access the data from the `/data` endpoint in **Module 3** (`http://localhost:5000/module3/data`).

---

## Directory Breakdown

* **`app/`**: This is the core application code.

  * **`__init__.py`**: Initializes the Flask app and registers the blueprints.
  * **`config.py`**: Configuration settings such as debug mode, secret keys, etc.
  * **`module1/`, `module2/`, `module3/`**: Each module is organized as a separate Flask **blueprint**, containing routes and views.
  * **`templates/`**: Jinja2 HTML templates.
  * **`static/`**: Static assets like CSS, JavaScript, and images.

* **`data/`**: This folder holds persistent data like JSON files, logs, etc. It is mounted from the host system into the Docker container.

* **`tests/`**: (Optional) Unit tests for the application. These can be added as the app evolves.

* **`Dockerfile`**: Defines the Docker image used to run the Flask app.

* **`docker-compose.yml`**: Manages the Flask app container, volumes, and ports.

* **`requirements.txt`**: Python package dependencies for the project.

---

## Development Workflow

### Hot Reloading

During development, the Flask app will automatically reload when you make changes to the code. This is enabled by mounting the project directory as a volume in Docker.

* Code changes will be reflected immediately without needing to rebuild the container.

### Data Persistence

The `data/` folder is **mounted as a volume** inside the container, which ensures that any data (such as uploaded files or logs) remains persistent even when the container is restarted or rebuilt.

---

## Testing the App

You can test individual modules by sending HTTP requests to the endpoints:

* **Module 1**: `http://localhost:5000/module1`
* **Module 2**: `http://localhost:5000/module2`
* **Module 3**: `http://localhost:5000/module3`
* **Module 3 Data**: `http://localhost:5000/module3/data`

To add unit tests, create test files inside the `tests/` directory. You can use **pytest** or any other testing framework.

---

## Running in Production

For production environments, you can use a WSGI server like **Gunicorn** and deploy behind a reverse proxy like **Nginx**. A production-grade setup would require additional configurations for better performance, security, and scalability.

---

## License

MIT License

---

## DLP Chatbot Enhancement

This project now includes a comprehensive **Q-Rule-Based Chatbot for Defects Liability Period (DLP)** in Malaysian property law.

### What is the DLP Chatbot?

The chatbot is an intelligent system designed to help users understand and navigate the Defects Liability Period in Malaysian property law, including:

- **Housing Development Act 1966 (HDA)** provisions
- **Standard Conditions of Sale (SPA)** clauses
- **Buyer rights** and developer responsibilities
- **Claims process** and assessment

### Core Features (All 6 Implemented)

1. ✅ **Natural Language Query Processing** - Ask questions about DLP in your own words
2. ✅ **Static Guidelines Access** - Learn about DLP without submitting specific queries
3. ✅ **Conversation History** - Review and retrieve past advice and assessments
4. ✅ **Log Deletion** - Delete conversations for privacy protection
5. ✅ **Legal References** - Access HDA, SPA, and other legal documents
6. ✅ **Feedback System** - Rate accuracy and suggest improvements

### Technology Stack

- **Backend**: Python Flask with rule-based logic engine
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Knowledge Base**: Malaysian legal standards and DLP guidelines
- **Storage**: JSON-based persistent storage
- **API**: RESTful endpoints for all functionality

### Quick Start - DLP Chatbot

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run the application**:
```bash
python -c "from app import create_app; app = create_app(); app.run(debug=True, host='0.0.0.0', port=5000)"
```

3. **Access the chatbot**:
   - Open `http://localhost:5000` in your browser
   - Start chatting about property defects and DLP

4. **Test all features**:
```bash
python test_features.py
```

### Using Docker

```bash
docker-compose up --build
```

Then access at `http://localhost:5000`

### Accessing Different Features

- **💬 Chat Tab**: Ask natural language questions
- **📚 Guidelines Tab**: Access 10 comprehensive DLP guides
- **🔍 Assessment Tab**: Assess your defect claim
- **📖 Logs Tab**: View and manage conversation history
- **⚖️ Legal References**: Access legal documents
- **⭐ Feedback Tab**: Rate and submit suggestions

### File Structure

```
app/
├── dlp_knowledge_base.py      # Malaysian legal knowledge & rules
├── chatbot_core.py             # NLP & response generation
├── conversation_logger.py      # Session & history management
├── feedback_manager.py         # Rating & feedback tracking
├── module1/routes.py           # Chatbot API endpoints
├── module2/routes.py           # Frontend serving
├── templates/
│   └── index.html              # Interactive UI
└── static/
    ├── css/style.css           # Responsive styling
    └── js/app.js               # Client-side logic
```

### Data Storage

- **Conversations**: Stored in `data/conversations/` as JSON files
- **Feedback**: Stored in `data/feedback/feedback_log.json`
- All data persists across sessions and restarts

### Documentation

For comprehensive documentation, see: **`DLP_CHATBOT_README.md`**

---

## Conclusion

This project is now a **comprehensive DLP Chatbot system** with a **modular Flask architecture**. It combines rule-based reasoning with an intuitive web interface to provide accessible legal guidance on Malaysian property law. By organizing the application into **blueprints**, we ensure scalability and maintainability. The **data persistence** ensures that conversation history and feedback are preserved across sessions.

The system is production-ready and suitable for deployment in various environments to help property buyers, developers, and legal practitioners understand their rights and responsibilities regarding Defects Liability Period in Malaysia.

---

---