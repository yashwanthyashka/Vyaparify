# Vyaparify

Vyaparify is a full-stack OLX-like web application that allows users to buy and sell used products. It features user authentication, ad posting with image uploads, product details, messaging between buyers and sellers, and an admin dashboard for managing users and ads.

## 🌐 Features

- ✅ User Signup & Login (JWT authentication)
- ✅ Post Ads with image upload (Cloudinary)
- ✅ View ads on Home Page
- ✅ Product Detail Page with contact seller form
- ✅ Chat between buyer and seller
- ✅ Admin Dashboard for managing users and ads
- ✅ Profile page with posted ads list

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Zustand for auth state management
- Axios for API calls
- TailwindCSS + Lucide Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file handling

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/vyaparify.git
cd vyaparify
2. Setup Backend
bash
Copy
Edit
cd backend
npm install
Create .env file:
ini
Copy
Edit
MONGODB_URI=mongodb://localhost:27017/vyaparify
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
bash
Copy
Edit
node server.js
3. Setup Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
🔐 Admin Access
Manually create an admin user in MongoDB with the isAdmin: true field:

js
Copy
Edit
{
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  isAdmin: true
}
Then login from the frontend to access /admin/dashboard.

📁 Project Structure
pgsql
Copy
Edit
├── backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
├── frontend
│   ├── components/
│   ├── pages/
│   ├── store/
│   └── App.jsx
📸 Screenshots (optional)
Add screenshots of Home, PostAd, Admin Dashboard, Product Detail page, etc.

📬 Contact
For questions or suggestions, feel free to reach out:
Author: Yashwanth Kumar G
Email: yashwanthyashka05072@gmail.com
