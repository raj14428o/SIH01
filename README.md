# DataWipe - Secure Data Wiping Solution

A professional-grade React application for secure data wiping with compliance certificates. This prototype demonstrates a complete flow from landing page to authenticated data wiping operations with mock agent integration.

## 🚀 Application Flow

### 1. Landing Page (`/`)
- **Professional hero section** with clean design (no gradients)
- **Trust indicators** showing compliance standards (DoD 5220.22-M, NIST SP 800-88)
- **Interactive terminal mockup** demonstrating the wiping process
- **Feature highlights** with military-grade security, compliance certificates, and cross-platform support
- **Call-to-action buttons** leading to authentication

### 2. Authentication (`/login`)
- **Mock login system** with predefined credentials
- **Demo credentials**: `admin@datawipe.com` / `password123`
- **Session management** using localStorage
- **Clean form design** with validation and error handling
- **Automatic redirect** to dashboard upon successful login

### 3. Dashboard (`/dashboard`)
- **Welcome section** displaying user profile information
- **Quick statistics** showing total wipes, success rate, and data secured
- **Navigation hub** with quick access to all major features
- **Responsive design** with mobile-friendly layout

### 4. Solutions Section
#### Windows Solution (`/solutions/windows`)
- **File/Folder selection** with mock file picker
- **Path input field** with browse functionality
- **Wipe type selection** (File vs Folder)
- **Mock wipe process** with loading animation and progress indication
- **Success notifications** with agent integration placeholders

#### Linux Solution (`/solutions/linux`)
- **Similar functionality** to Windows with Linux-specific styling
- **Additional options** for Linux-specific commands (shred, dd)
- **Platform-appropriate** file path examples and validation

### 5. History & Certificates
#### Cleanup History (`/history`)
- **Tabular display** of all wipe operations
- **Columns**: Date, Type, Path, Platform, Status
- **Download functionality** for PDF and JSON certificates
- **Success rate calculation** and statistics

#### Wipe Certificates (`/certificates`)
- **Enhanced certificate table** with Certificate ID, Algorithm, Passes
- **Summary statistics** dashboard
- **Downloadable certificates** in both formats
- **Compliance indicators** and verification status

### 6. Navigation & Logout
- **Comprehensive navbar** with dropdown menus
- **Mobile-responsive** hamburger menu
- **Active page highlighting**
- **Logout functionality** clearing session and redirecting to landing

## 🛠️ Frontend Architecture

### Technology Stack
- **React 19.1.0** - Modern React with latest features
- **React Router 7.6.3** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Vite 7.0.0** - Fast build tool and dev server

### Project Structure
```
src/
├── components/
│   ├── Auth/
│   │   └── Login.jsx                 # Authentication component
│   ├── Dashboard/
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   └── Navbar.jsx                # Navigation component
│   ├── Landing/
│   │   └── LandingPage.jsx           # Landing page with hero section
│   ├── Solutions/
│   │   ├── WindowsSolution.jsx       # Windows data wiping interface
│   │   └── LinuxSolution.jsx         # Linux data wiping interface
│   ├── History/
│   │   └── History.jsx               # Wipe operation history
│   └── Certificates/
│       └── Certificates.jsx          # Certificate management
├── utils/
│   └── agentIntegration.js           # Agent integration placeholders
├── main.jsx                          # Application entry point
└── index.css                         # Global styles
```

### Component Details

#### 1. Landing Page (`LandingPage.jsx`)
- **Hero section** with compelling copy and visual elements
- **Features showcase** with icon-based cards
- **Mock terminal interface** showing data wiping process
- **Floating elements** for visual appeal
- **Responsive grid layout** for different screen sizes
- **Professional footer** with company information

#### 2. Authentication (`Login.jsx`)
- **Form validation** with error handling
- **Mock credential system** for demonstration
- **Session management** using localStorage
- **Clean, accessible form design**
- **Demo credentials display** for easy testing

#### 3. Dashboard (`Dashboard.jsx`)
- **User profile display** from localStorage
- **Statistics cards** with icons and animations
- **Quick action buttons** for common tasks
- **Responsive grid layout**
- **Integration with navigation system**

#### 4. Navigation (`Navbar.jsx`)
- **Multi-level navigation** with dropdown menus
- **Mobile-responsive** hamburger menu
- **Active state management** based on current route
- **User profile integration**
- **Logout functionality** with session cleanup

#### 5. Solutions Components
**WindowsSolution.jsx & LinuxSolution.jsx**
- **File type selection** (File vs Folder)
- **Path input** with mock file browser
- **Mock wipe process** with loading states
- **Progress indication** and success messages
- **Platform-specific styling** and options
- **History integration** for tracking operations

#### 6. History & Certificates
**History.jsx**
- **Data table** with sorting and filtering
- **Download functionality** for certificates
- **Success rate calculations**
- **Responsive table design**
- **Integration with localStorage for persistence

**Certificates.jsx**
- **Enhanced certificate display** with detailed information
- **Algorithm and compliance indicators**
- **Downloadable JSON certificates** with proper data structure
- **Summary statistics** dashboard
- **Professional certificate formatting**

### State Management
- **localStorage** for user session and data persistence
- **React hooks** (useState, useEffect) for component state
- **React Router** for navigation state
- **Mock data structures** for demonstration purposes

### Styling Approach
- **Tailwind CSS** utility classes for consistent design
- **Custom CSS** for specific animations and transitions
- **Responsive design** with mobile-first approach
- **Consistent color scheme** using blue, gray, and accent colors
- **Smooth transitions** and hover effects throughout

### Mock Data & Integration Points

#### Agent Integration Placeholders (`agentIntegration.js`)
```javascript
// Future integration points for actual data wiping agents
- startWipeWithAgent()          # Main wipe operation
- validatePathWithAgent()       # Path validation
- getSystemInfoWithAgent()      # System information
- generateCertificateWithAgent() # Certificate generation
```

#### Mock Data Structures
- **User sessions** stored in localStorage
- **Wipe history** with operation details
- **Certificate data** with compliance information
- **System statistics** for dashboard display

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563eb` (blue-600)
- **Success Green**: `#059669` (green-600)
- **Warning Yellow**: `#d97706` (yellow-600)
- **Error Red**: `#dc2626` (red-600)
- **Gray Scale**: Various shades for text and backgrounds

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with good contrast
- **Code/Terminal**: Monospace font for technical displays

### Components
- **Cards**: White background with subtle shadows
- **Buttons**: Consistent padding, hover states, and focus indicators
- **Forms**: Clean inputs with proper validation states
- **Tables**: Responsive design with hover effects
- **Navigation**: Clear hierarchy with active states

## 🔧 Development Features

### Development Tools
- **Vite HMR** for fast development
- **ESLint** for code quality
- **React Developer Tools** compatible
- **Tailwind CSS IntelliSense** support

### Performance Optimizations
- **Code splitting** with React Router
- **Lazy loading** for route components
- **Optimized bundle size** with Vite
- **Efficient re-renders** with proper React patterns

### Accessibility
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Color contrast** compliance
- **Screen reader** friendly

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd Frontend/sih_view
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🔮 Future Enhancements

### Agent Integration
- Replace mock functions with actual data wiping agents
- Implement real file system operations
- Add progress tracking for actual wipe operations
- Integrate with system-level security tools

### Additional Features
- **User management** with role-based access
- **Audit logging** with detailed operation logs
- **Scheduled wiping** for automated operations
- **Bulk operations** for multiple files/folders
- **Advanced algorithms** selection and configuration

### Security Enhancements
- **JWT authentication** for production use
- **API security** with proper authentication
- **Encrypted communication** with agents
- **Secure certificate storage** and management

## 📝 Notes

This is a **prototype/mock version** designed to demonstrate the complete user flow and interface design. All data wiping operations are simulated, and the actual secure deletion functionality will be implemented through agent integration in future versions.

The application showcases professional UI/UX design patterns suitable for enterprise security software while maintaining ease of use and accessibility standards.
