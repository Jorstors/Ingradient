<div align="center">
  <a href="http://ingradient.site">
    <img src="public/assets/ingradient tab logo.png" alt="Ingradient Logo" width="200">
  </a>
  <h1>- Ingradient -</h1>
  <h3>An ingredient‑driven recipe search app.</h3>
</div>

Ingradient is a lightweight web application for discovering recipes based on the contents of your pantry. Built with Node.js, Express, and Firebase, it fetches data from the Edamam API and provides a responsive interface optimized for both desktop and mobile screens.

<div align="center">

🌐 **Available at: [ingradient.site](http://ingradient.site)**
</div>
<br/>
<div align="center">

</div>

## ✨ Features

- **🔎 Recipe Search** – Queries the Edamam API and displays results with a skeleton loader for smooth user experience.
- **📋 Pantry Manager** – Stores ingredients in `localStorage` and suggests randomized recipes from your saved items.
- **📱 Responsive UI** – Sidebar navigation collapses on small screens and toggles with a menu icon.
- **🔒 Secure API Proxy** – Express endpoint supplies Edamam credentials from environment variables.
- **🔥 Firebase Integration** – Firebase Admin SDK set up for potential Firestore reads and writes.
- **🚀 CI/CD** – GitHub Actions automate deployments to Firebase Hosting.

## 🚀 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Deployment**: Firebase Hosting, Heroku (Procfile)
- **DevOps**: GitHub Actions, dotenv for environment variables

## 📁 Project Structure
```
Ingradient/
├── public/
│ ├── index.html
│ ├── router.js
│ ├── assets/
│ │ ├── ingradient tab logo.png
│ │ └── loading.webp
│ └── src/
│ ├── Search/
│ ├── Pantry/
│ ├── Account/
│ ├── About/
│ └── Settings/
├── server.js
├── firebase.json
├── .github/workflows/
└── package.json
```

## 🎯 How It Works

1. **User Input** – Search for recipes directly or add items to your pantry.
2. **Data Fetching** – The frontend requests credentials from `/api/edamam` and queries Edamam for matching recipes.
3. **Display** – Results appear with skeleton animations until the data is loaded.
4. **Pantry Suggestions** – Ingredients saved locally generate randomized recipe recommendations.
5. **Deployment** – Merges to `main` trigger GitHub Actions to deploy to Firebase Hosting.

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

## 🙋‍♂️ Support

For questions or feedback, please contact Justus Jones.

---

Built with ❤️
