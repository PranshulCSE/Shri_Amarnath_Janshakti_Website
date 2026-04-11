# SAJSSM Frontend

React + Vite frontend for SAJSSM (Shri Amarnath JanShakti Sewa Mandal) website

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env` file or copy from `.env.example`:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

For production:
```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

### 3. Development Server
```bash
npm run dev
```

Runs on: http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

Creates optimized production build in `dist/` folder.

### 5. Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API service (axios)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   ├── styles/           # Global styles
│   ├── layouts/          # Layout components
│   ├── routes/           # Route definitions
│   ├── App.jsx
│   └── index.jsx
├── public/               # Static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
└── package.json
```

## Features

### Pages
- **Home** - Landing page with hero section
- **About** - Organization information
- **History** - Historical background
- **Yatra** - Pilgrimage information
- **Donations** - Donation form with payment verification
- **Gallery** - Photo gallery
- **Contact** - Contact form
- **Admin Dashboard** - Admin panel for management

### Key Components
- Responsive header and footer
- Mobile-optimized navigation
- Announcement popup banner
- Donation ticker/marquee
- Social media links
- Loading states and error handling

## API Integration

All API calls use axios with:
- Automatic token injection from localStorage
- 15-second timeout on form submissions
- Automatic redirect on 401 (unauthorized)
- Comprehensive error handling

## Admin Features

### Login
- Credentials stored in database
- JWT token-based authentication
- 7-day token expiry

### Dashboard
- Overview statistics
- Contact message management
- Donation verification
- Admin password change

## Form Validation

All forms include:
- Client-side validation
- Server-side validation
- Error messages
- Loading states

## Build & Deployment

### Static Deployment (Netlify/Vercel)
```bash
npm run build
# Deploy contents of dist/ folder
```

### With Backend
Build is automatically served by Express in production when built into `../dist/`

## Performance Optimizations

- Image lazy loading with fallbacks
- CSS file splitting
- Code code-splitting with React Router
- Optimized bundle with Vite
- Gzip compression ready

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (defaults to `http://localhost:5000`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)
- Edge (latest)

## Development Tips

- Use `npm run dev` for hot module reloading
- Browser DevTools for debugging
- Network tab to inspect API calls
- Console for error messages
- Responsive design testing with DevTools

## Troubleshooting

**"Failed to fetch" errors**
- Ensure backend is running on port 5000
- Check CORS settings in backend

**"Unexpected end of JSON input"**
- Backend may be offline or returning HTML
- Check console for actual error message

**Auth token not persisting**
- Clear localStorage and login again
- Check browser's private/incognito mode

**Styles not loading**
- Clear browser cache
- Restart dev server
