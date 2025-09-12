# DataWipe Frontend - React Application

A professional-grade React application for secure data wiping with compliance certificates. This frontend provides a complete user interface for data wiping operations with mock agent integration.

## 🛠️ Technology Stack

- **React 19.1.0** - Modern React with latest features
- **React Router 7.6.3** - Client-side routing and navigation
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Vite 7.0.0** - Fast build tool and development server
- **ESLint** - Code quality and linting

## 📁 Project Structure

```
Frontend/
├── public/
│   └── vite.svg                    # Vite logo asset
├── src/
│   ├── components/
│   │   ├── About/                  # About page component
│   │   ├── Auth/                   # Authentication components
│   │   │   └── Login.jsx           # Login form and authentication logic
│   │   ├── Certificates/           # Certificate management
│   │   │   └── Certificates.jsx    # Certificate display and download
│   │   ├── Contact/                # Contact page component
│   │   ├── Dashboard/              # Dashboard components
│   │   │   ├── Dashboard.jsx       # Main dashboard interface
│   │   │   └── Navbar.jsx          # Navigation bar component
│   │   ├── Footer/                 # Footer component
│   │   ├── Header/                 # Header component
│   │   ├── History/                # Operation history
│   │   │   └── History.jsx         # Wipe operation history display
│   │   ├── Home/                   # Home page component
│   │   ├── Landing/                # Landing page
│   │   │   └── LandingPage.jsx     # Main landing page with hero section
│   │   ├── Solutions/              # Data wiping solutions
│   │   │   ├── WindowsSolution.jsx # Windows data wiping interface
│   │   │   └── LinuxSolution.jsx   # Linux data wiping interface
│   │   └── User/                   # User-related components
│   ├── utils/
│   │   └── agentIntegration.js     # Agent integration placeholders
│   ├── assets/                     # Static assets and images
│   ├── App.css                     # Application-specific styles
│   ├── App.jsx                     # Main App component
│   ├── index.css                   # Global styles and Tailwind imports
│   ├── layout.jsx                  # Layout wrapper component
│   └── main.jsx                    # Application entry point
├── .gitignore                      # Git ignore patterns
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML template
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Dependency lock file
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🚀 Application Features

### 1. Landing Page (`/`)
- Professional hero section with clean design
- Trust indicators showing compliance standards (DoD 5220.22-M, NIST SP 800-88)
- Interactive terminal mockup demonstrating wiping process
- Feature highlights with military-grade security
- Call-to-action buttons leading to authentication

### 2. Authentication (`/login`)
- Mock login system with predefined credentials
- Demo credentials: `admin@datawipe.com` / `password123`
- Session management using localStorage
- Clean form design with validation and error handling

### 3. Dashboard (`/dashboard`)
- Welcome section with user profile information
- Quick statistics showing total wipes and success rate
- Navigation hub with access to all major features
- Responsive design with mobile-friendly layout

### 4. Data Wiping Solutions
#### Windows Solution (`/solutions/windows`)
- File/Folder selection with mock file picker
- Path input field with browse functionality
- Wipe type selection (File vs Folder)
- Mock wipe process with loading animation

#### Linux Solution (`/solutions/linux`)
- Similar functionality with Linux-specific styling
- Additional options for Linux-specific commands
- Platform-appropriate file path examples

### 5. History & Certificates
#### Cleanup History (`/history`)
- Tabular display of all wipe operations
- Columns: Date, Type, Path, Platform, Status
- Download functionality for PDF and JSON certificates

#### Wipe Certificates (`/certificates`)
- Enhanced certificate table with Certificate ID and Algorithm
- Summary statistics dashboard
- Downloadable certificates in both formats
- Compliance indicators and verification status

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` (blue-600)
- **Success Green**: `#059669` (green-600)
- **Warning Yellow**: `#d97706` (yellow-600)
- **Error Red**: `#dc2626` (red-600)
- **Gray Scale**: Various shades for text and backgrounds

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Consistent padding, hover states, and focus indicators
- **Forms**: Clean inputs with proper validation states
- **Tables**: Responsive design with hover effects
- **Navigation**: Clear hierarchy with active states

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd Frontend
npm install
```

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:5173`

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Linting
```bash
npm run lint
```
Runs ESLint to check code quality

### Preview
```bash
npm run preview
```
Preview the production build locally

## 🔮 Mock Data & Integration

### Agent Integration Placeholders (`agentIntegration.js`)
- `startWipeWithAgent()` - Main wipe operation
- `validatePathWithAgent()` - Path validation
- `getSystemInfoWithAgent()` - System information
- `generateCertificateWithAgent()` - Certificate generation

### Mock Data Structures
- User sessions stored in localStorage
- Wipe history with operation details
- Certificate data with compliance information
- System statistics for dashboard display

## 🚀 Performance Features

- **Vite HMR** for fast development
- **Code splitting** with React Router
- **Lazy loading** for route components
- **Optimized bundle size** with Vite
- **Efficient re-renders** with proper React patterns

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## 📝 Notes

This is a **prototype/mock version** designed to demonstrate the complete user flow and interface design. All data wiping operations are simulated, and the actual secure deletion functionality will be implemented through agent integration in future versions.

The application showcases professional UI/UX design patterns suitable for enterprise security software while maintaining ease of use and accessibility standards.
