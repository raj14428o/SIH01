# DataWipe - Secure Data Wiping Solution

A comprehensive secure data wiping solution with multi-platform support for Windows, Linux, and Android. Features professional UI/UX design, hardware-level security, and compliance certificates for enterprise data disposal needs.

## 🛠️ Technology Stack

- **React 19.1.0** - Modern React with latest features
- **React Router 7.6.3** - Client-side routing and navigation
- **Tailwind CSS 4.1.11** - Utility-first CSS framework with modern design
- **Vite 7.0.0** - Fast build tool and development server
- **ESLint** - Code quality and linting
- **Node.js Backend** - Agent integration and API services

## 📁 Project Structure

```
SIH01/
├── Agents/
│   └── agent.py                    # Python agent for data wiping operations
├── backend/
│   └── index.js                    # Node.js backend server
├── Frontend/
│   ├── public/
│   │   └── vite.svg                # Vite logo asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/               # Authentication components
│   │   │   │   └── Login.jsx       # Login form and authentication logic
│   │   │   ├── Certificates/       # Certificate management
│   │   │   │   └── Certificates.jsx # Certificate display and download
│   │   │   ├── Dashboard/          # Dashboard components
│   │   │   │   ├── Dashboard.jsx   # Main dashboard with quick actions
│   │   │   │   └── Navbar.jsx      # Navigation bar with dropdowns
│   │   │   ├── History/            # Operation history
│   │   │   │   └── History.jsx     # Wipe operation history display
│   │   │   ├── Landing/            # Landing page
│   │   │   │   └── LandingPage.jsx # Modern landing page with solutions
│   │   │   ├── Layout/             # Layout components
│   │   │   │   └── Layout.jsx      # Main layout with footer
│   │   │   └── Solutions/          # Data wiping solutions
│   │   │       ├── WindowsSolution.jsx # Windows data wiping interface
│   │   │       └── LinuxSolution.jsx   # Linux data wiping interface
│   │   ├── utils/                  # Utility functions
│   │   ├── assets/                 # Static assets and images
│   │   ├── App.css                 # Application-specific styles
│   │   ├── index.css               # Global styles and Tailwind imports
│   │   └── main.jsx                # Application entry point with routing
│   ├── .gitignore                  # Git ignore patterns
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # HTML template
│   ├── package.json                # Project dependencies and scripts
│   ├── package-lock.json           # Dependency lock file
│   └── vite.config.js              # Vite configuration
├── scripts/
│   ├── linux(ssd).py               # Linux SSD wiping script
│   └── windows(ssd).py             # Windows SSD wiping script
├── Doc/
│   └── README.md                   # Documentation
└── README.md                       # Main project README
```

## 🚀 Application Features

### 1. Modern Landing Page (`/`)
- **Sticky Navigation**: Glass morphism navbar with gradient branding
- **Multi-Platform Solutions**: Windows, Linux, and Android cards with official logos
- **Hardware-Level Security**: hdparm ATA secure erase and NVMe crypto erase
- **CLI Mock Interface**: Interactive terminal demonstrating wiping commands
- **Professional Design**: Modern gradients, hover animations, and responsive layout

### 2. Authentication System (`/login`)
- Clean login interface with validation
- Demo credentials: `admin@datawipe.com` / `password123`
- Session management using localStorage
- Responsive form design with error handling

### 3. Enhanced Dashboard (`/dashboard`)
- **Quick Actions**: Interactive Windows and Linux solution cards with hover effects
- **User Statistics**: Total wipes, success rate, and system information
- **Modern Navigation**: Dropdown menus for Solutions and Downloads
- **Platform Logos**: Official Windows and Linux logos throughout interface

### 4. Multi-Platform Solutions
#### Windows Solution (`/solutions/windows`)
- **Tab Navigation**: Data Wipe, Download Agent, Deletion Methods
- **Agent Download**: Step-by-step installation instructions
- **File/Folder Selection**: Mock file picker with path validation
- **Full Disk Wipe**: Direct link to agent download
- **Windows Logos**: Consistent branding throughout

#### Linux Solution (`/solutions/linux`)
- **Linux-Specific Features**: CLI integration, package management
- **Command Examples**: shred, dd, hdparm, nvme commands
- **Distribution Support**: Ubuntu, CentOS, RHEL, Debian
- **Tux Branding**: Linux penguin logos throughout interface

### 5. Agent Integration
- **Development Notice**: Clear messaging about agent availability
- **Installation Steps**: "Download the agent", "Give admin permission", "Turn off Firewall"
- **Platform-Specific Instructions**: Windows and Linux installation guides
- **Mock Integration**: Placeholder functions for future agent connectivity

### 6. History & Certificates
#### Cleanup History (`/history`)
- Comprehensive operation tracking
- Platform-specific filtering (Windows/Linux)
- Export functionality for compliance

#### Wipe Certificates (`/certificates`)
- Compliance certificate generation
- Audit trail documentation
- PDF and JSON export formats

## 🎨 Modern Design System

### Color Palette
- **Primary Blue**: `#2563eb` (Windows theme)
- **Success Green**: `#059669` (Linux theme)
- **Orange**: `#ea580c` (Android theme)
- **Warning Yellow**: `#d97706` (Development notices)
- **Error Red**: `#dc2626` (Critical actions)
- **Glass Morphism**: `bg-white/95 backdrop-blur-md`

### Advanced Components
- **Glass Navigation**: Sticky navbar with backdrop blur
- **Gradient Cards**: Multi-platform solution cards with hover animations
- **Interactive Buttons**: Scale transforms and shadow effects
- **Logo Integration**: Official platform logos (Windows, Linux, Android)
- **Modern Layout**: Flexbox footer, responsive grids
- **Smooth Transitions**: 200-300ms duration for all interactions

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

## 🔮 Agent Integration & Mock Data

### Hardware-Level Commands
- **hdparm**: ATA secure erase for SATA/IDE drives
- **nvme-cli**: NVMe format with crypto erase
- **CLI Mock**: Simulation interface for development
- **Platform Scripts**: Windows and Linux SSD wiping scripts

### Agent Integration Points
- Python agent (`agent.py`) for actual data wiping
- Node.js backend (`index.js`) for API services
- Mock functions for UI demonstration
- Future integration with real hardware commands

### Mock Data Structures
- User sessions with platform preferences
- Multi-platform wipe history
- Certificate generation with compliance data
- System information for Windows/Linux detection

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

## 🔧 Technical Features

### Modern UI/UX
- **Glass Morphism**: Modern translucent navigation
- **Gradient Branding**: Professional color schemes
- **Platform Logos**: Official Windows, Linux, Android branding
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant interface

### Multi-Platform Support
- **Windows**: NTFS, FAT32, BitLocker integration
- **Linux**: ext4, xfs, btrfs, LUKS encryption
- **Android**: Factory reset enhancement (coming soon)

### Security Standards
- **Hardware-Level**: hdparm ATA secure erase
- **NVMe Support**: Crypto erase commands
- **CLI Integration**: Command-line interface mock
- **Compliance**: Enterprise security standards

## 📝 Development Status

This is a **comprehensive prototype** showcasing:
- Complete multi-platform UI/UX design
- Modern React architecture with routing
- Agent integration framework
- Professional branding and design system
- Enterprise-ready interface patterns

The application demonstrates production-ready design suitable for enterprise security software while providing a foundation for actual agent integration.

## 🤖 Website-Controlled Agent (Download + Trigger)

A basic control plane is now available so the website/backend can:

1. Provide an agent download endpoint.
2. Queue commands for a specific agent ID.
3. Let agents poll for new commands.
4. Receive heartbeat and execution status updates.

### Backend endpoints

- `GET /api/agent/download/:platform`
  - Downloads the Python agent (`windows` or `linux`).
- `POST /api/agent/commands`
  - Queue a command for an agent.
  - Example body:
    ```json
    {
      "agentId": "my-host-01",
      "action": "PING",
      "payload": {}
    }
    ```
- `GET /api/agent/commands/next?agentId=my-host-01`
  - Used by the agent poll loop to fetch the next command.
- `POST /api/agent/status`
  - Agent heartbeat and execution status reporting.
- `GET /api/agent/status`
  - List current known agent statuses.

### Running the agent

```bash
cd agent
DATAWIPE_SERVER_URL=http://localhost:5000 python agent.py
```

Optional environment variables:

- `DATAWIPE_AGENT_ID` (default: machine hostname)
- `DATAWIPE_POLL_INTERVAL` (default: `5` seconds)

### Triggering from backend (example)

```bash
curl -X POST http://localhost:5000/api/agent/commands \
  -H "Content-Type: application/json" \
  -d '{"agentId":"my-host-01","action":"PING","payload":{}}'
```
