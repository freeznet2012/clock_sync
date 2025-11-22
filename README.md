# ClockSync ⏱️

A synchronized time tracking application built with Angular 21 that allows multiple devices to share and sync the same stopwatch, timer, or alarm state in real-time via URL sharing and QR codes.

## 🌟 Features

### Core Functionality

**ClockSync** provides three main time tracking modes that can be synchronized across multiple devices:

1. **Stopwatch** ⏱️
   - Start/stop/reset functionality
   - Precise time tracking synchronized across devices
   - Real-time elapsed time updates
   - State persists via URL parameters

2. **Timer** ⏲️
   - Countdown timer with customizable duration (minutes and seconds)
   - Visual countdown display
   - Audio alert when timer completes
   - Synchronized start time across all connected devices
   - Real-time remaining time updates

3. **Alarm** ⏰
   - Set alarms for specific times (hours and minutes)
   - Automatically schedules for next occurrence (today or tomorrow)
   - Visual and audio alerts when alarm triggers
   - Time-until-alarm countdown display
   - Synchronized across all devices

### Synchronization Features

- **Time Synchronization**: Uses WorldTimeAPI to synchronize time across devices, ensuring accurate time tracking regardless of device clock differences
- **URL State Management**: All timer states are encoded in the URL, allowing instant sharing and synchronization
- **QR Code Sharing**: Each active timer/stopwatch/alarm generates a QR code that can be scanned to sync with other devices
- **Real-time Updates**: All connected devices see the same state and update in real-time
- **Zero Backend Required**: Fully client-side application - no server needed for synchronization

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10.8.2 or higher)
- Angular CLI (v21.0.0)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/freeznet2012/clock_sync.git
cd clock_sync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200/`

## 💡 How It Works

### Time Synchronization

The app uses the `TimeSyncService` to synchronize time across devices:
- Fetches UTC time from WorldTimeAPI on initialization
- Calculates offset between server time and local device time
- All time calculations use synchronized time to ensure accuracy across devices

### State Management

The `UrlStateService` manages application state through URL query parameters:
- `mode`: Current active mode (stopwatch, timer, or alarm)
- `start`: Start time timestamp (for stopwatch/timer)
- `duration`: Timer duration in milliseconds
- `target`: Target time timestamp (for alarm)

### Sharing & Syncing

1. Start a stopwatch, timer, or alarm on one device
2. The URL automatically updates with the current state
3. Share the URL via:
   - Copy/paste the URL
   - Scan the generated QR code with another device
4. All devices with the same URL see the same synchronized state

## 🎯 Usage Examples

### Stopwatch

1. Navigate to the Stopwatch tab
2. Click "Start" to begin timing
3. Share the URL or QR code with others
4. All devices will show the same elapsed time
5. Click "Reset" to stop and clear

### Timer

1. Navigate to the Timer tab
2. Set desired minutes and seconds
3. Click "Start"
4. Share the URL or QR code
5. All devices countdown together
6. Audio alert plays when time expires

### Alarm

1. Navigate to the Alarm tab
2. Set the desired hour and minute
3. Click "Set Alarm"
4. Share the URL or QR code
5. All devices show countdown to alarm time
6. Audio and visual alerts trigger at set time

## 🛠️ Technical Stack

- **Framework**: Angular 21
- **Language**: TypeScript 5.9
- **Styling**: SCSS
- **QR Code**: angularx-qrcode
- **State Management**: RxJS
- **Time API**: WorldTimeAPI
- **Testing**: Vitest

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── time-sync.service.ts    # Time synchronization
│   │       └── url-state.service.ts    # URL state management
│   ├── features/
│   │   ├── alarm/                      # Alarm component
│   │   ├── home/                       # Home/tab navigation
│   │   ├── stopwatch/                  # Stopwatch component
│   │   └── timer/                      # Timer component
│   └── shared/
│       └── components/
│           └── qr-share/               # QR code generation
```

## 🔧 Development

### Development server

To start a local development server, run:

```bash
npm start
```

The application will automatically reload whenever you modify any of the source files.

### Building

To build the project for production:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

### Running unit tests

To execute unit tests with Vitest:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0
- Time synchronization powered by [WorldTimeAPI](https://worldtimeapi.org/)
- QR code generation by [angularx-qrcode](https://github.com/cordobo/angularx-qrcode)

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
