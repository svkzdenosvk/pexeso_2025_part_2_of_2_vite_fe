# 🃏 Pexeso Game (Vite + React)

This is a **Pexeso memory game** built with [Vite](https://vitejs.dev/) and React.  
The game features interactive cards, multiple difficulty levels, and Redux-powered state management.

🌐 **Live Demo:** [https://pexeso-vite.netlify.app](https://pexeso-vite.netlify.app)

---

## ✨ Features

- 🧠 Memory card matching (Pexeso style)  
- 🎚️ Multiple difficulty levels (easy, hard)  
- 🎴 Animated card flipping  
- 🔄 Shuffle mechanic on hard level  
- 🌍 Localization with `react-i18next`  
- 📦 State management via Redux Toolkit  
- 🎨 Responsive UI with Material-UI (MUI)  
- ⚡ Fast dev & build powered by Vite  

---

## 📂 Project Structure

```plaintext
App.tsx
index.css
main.tsx
vite-env.d.ts

assets/                # static images
components/            # UI components
  ├── LogReg/          # login & registration
  ├── OutsideTheGame/  # layouts & pages outside gameplay
  ├── RelatedToGame/   # core game components
  └── StylingComp/     # themes & shared styles
lib/                   # i18n, redux
_inc/                  # types, hooks, helper functions
```

---

## 🎮 How to Play

1. Click cards to reveal hidden images  
2. Find all matching pairs to win  
3. On **hard mode**, cards shuffle periodically for extra challenge  
4. Game ends when all pairs are matched 🎉  

---

## 🚀 Getting Started
Install dependencies and start the dev server:

```bash
# with npm
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.

Enjoy the game! 🎮

---

## 📦 Tech Stack

### Frontend
- ⚛️ **React + Vite**
- 🎨 **Material-UI (MUI)**
- 🌍 **react-i18next**

### State & Data

**Frontend State:**

- 🗃️ **Redux Toolkit** - Client-side state management

**Backend & Database:**

- 🔐 **Supabase Auth** - User authentication and session management
- 🗄️ **Prisma ORM** - Type-safe database client
- 🐘 **PostgreSQL** - Database (hosted on Supabase)

---

## 📖 Learn More

- [📘 Vite Documentation](https://vitejs.dev/)  
- [⚛️ React Documentation](https://react.dev/)  
- [🗃️ Redux Toolkit](https://redux-toolkit.js.org/)  
- [🎨 Material-UI](https://mui.com/)  
- [🌍 React i18next](https://react.i18next.com/)  

---

## 🌐 Deployment

This project is deployed on **Netlify**.  
Check out the [Netlify Docs](https://docs.netlify.com/) for more details.  

---

## 🤝 Contributing

Found an issue or want to contribute?  
Feel free to open an **issue** or a **pull request**.  

