# Retro - Personal Interaction Reflection App

A minimalist web application for logging and reflecting on interactions, inspired by Dale Carnegie's self-improvement principles from "How to Win Friends and Influence People."

## Features

- **Quick Interaction Logging**: Easily log interactions with basic details
- **Structured Reflection**: Add detailed reflections with guided questions
- **Rating System**: Rate interactions on a 1-5 scale for quality and satisfaction
- **Insights Dashboard**: View trends and patterns in your interactions over time
- **Local Storage**: All data stays private on your device
- **Dark Theme**: Professional dark interface with purple highlights
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- A modern web browser

## Installation

1. **Clone or download the project files**
   \`\`\`bash
   # If using git
   git clone <repository-url>
   cd retro-app

   # Or extract the downloaded ZIP file and navigate to the folder
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

## Development

1. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Start logging interactions!**
   - Click the "+ Log Interaction" button to quickly log a new interaction
   - View your interaction history in the "History" tab
   - Click on any logged interaction to add detailed reflections
   - Check the "Insights" tab to see patterns and trends over time

## Project Structure

\`\`\`
retro-app/
├── app/
│   ├── globals.css          # Global styles and theme configuration
│   ├── layout.tsx           # Root layout component
│   └── page.tsx            # Main application page
├── components/
│   ├── conversation-editor.tsx  # Reflection and editing interface
│   ├── conversation-list.tsx    # History view with search and filters
│   ├── insights-dashboard.tsx   # Analytics and trends dashboard
│   └── quick-log-form.tsx      # Quick interaction logging form
├── components/ui/           # Reusable UI components (buttons, cards, etc.)
├── lib/
│   └── utils.ts            # Utility functions
└── README.md               # This file
\`\`\`

## Usage Guide

### Logging an Interaction
1. Click the "+ Log Interaction" button on the main screen
2. Fill in the basic details:
   - **Person/People**: Who you spoke with
   - **Context**: Where or why the interaction happened
   - **Duration**: How long it lasted
   - **Rating**: Optional 1-5 star rating
3. Click "Log Interaction" to save

### Adding Reflections
1. Go to the "History" tab to see all your logged interactions
2. Click on any interaction to open the reflection editor
3. Answer the guided reflection questions:
   - What did I do well?
   - What could I have done differently?
   - What did I learn from this interaction?
4. Add any additional notes
5. Click "Save Reflection" to complete

### Viewing Insights
1. Navigate to the "Insights" tab
2. View your interaction statistics:
   - Total interactions logged
   - Average ratings over time
   - Most frequent interaction partners
   - Reflection completion rate
3. Use the insights to identify patterns and areas for improvement

## Data Storage

All interaction data is stored locally in your browser's localStorage. This means:
- ✅ Your data stays completely private
- ✅ No account creation or login required
- ✅ Works offline after initial load
- ⚠️ Data is tied to your specific browser and device
- ⚠️ Clearing browser data will remove your interactions

## Customization

The app uses a dark theme with purple highlights by default. You can customize colors by editing the CSS variables in `app/globals.css`:

\`\`\`css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 263.4 70% 50.4%;
  /* ... other color variables */
}
\`\`\`

## Building for Production

To create a production build:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

The built files will be in the `.next` directory and can be deployed to any hosting platform that supports Next.js applications.

## Troubleshooting

### Development server won't start
- Ensure Node.js version 18+ is installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check that port 3000 is not already in use

### Data not persisting
- Ensure localStorage is enabled in your browser
- Check that you're not in private/incognito mode
- Verify browser storage isn't full

### Styling issues
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check browser console for any CSS errors

## Contributing

This is a personal reflection tool designed for individual use. Feel free to fork and customize it for your own needs!

## License

This project is open source and available under the MIT License.
