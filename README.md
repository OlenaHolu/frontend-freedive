# FreediveAnalyzer – Frontend

This repository contains the web interface for **FreediveAnalyzer**, a platform designed to log and analyze freediving or spearfishing sessions. The application is built as a Single Page Application (SPA) using React and Vite.

## 🚀 Technologies

- ⚛️ React  
- ⚡ Vite  
- 💅 Tailwind CSS  
- 🌍 i18next (internationalization)  
- 📊 Recharts (data visualization)

## 🧪 Available Scripts

Inside the project directory, you can run:

### `npm run dev`

Starts the app in development mode.  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production into the `dist` folder.

### `npm run preview`

Serves the production build locally for testing.

### `npm run lint`

Runs ESLint to check code quality.

## 🔐 Authentication

Authentication is based on JWT tokens. Once the user logs in, the token is stored in `localStorage` and attached to all authenticated API requests.

## 🌍 Internationalization

The frontend supports multiple languages using `i18next`. Language files are loaded dynamically and can be extended by adding JSON files in `/locales`.

## 🖼 Responsive Design

All views and components are fully responsive, optimized for both desktop and mobile usage.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
