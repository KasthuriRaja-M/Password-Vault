# Password Vault

A secure, modern password management application built with React, TypeScript, and Tailwind CSS. Your passwords are encrypted locally and never leave your device.

## Features

- 🔐 **Secure Encryption**: All passwords are encrypted using AES-256 encryption
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔍 **Search & Filter**: Quickly find passwords by title, username, or URL
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🔑 **Password Generator**: Generate strong, secure passwords
- 📊 **Password Strength**: Real-time password strength analysis
- 🏷️ **Categories & Tags**: Organize passwords with categories and tags
- 📋 **Copy to Clipboard**: One-click password copying
- 🔒 **Local Storage**: All data stays on your device

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Encryption**: CryptoJS
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Password-Vault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Usage

### First Time Setup

1. When you first open the application, you'll be prompted to create a master password
2. Choose a strong master password (minimum 8 characters)
3. Confirm your master password
4. Your vault is now ready to use!

### Adding Passwords

1. Click the "Add Password" button
2. Fill in the required fields (Title, Username, Password)
3. Optionally add a URL, category, notes, and tags
4. Use the password generator to create secure passwords
5. Click "Add Password" to save

### Managing Passwords

- **View**: Click the eye icon to show/hide passwords
- **Copy**: Click the copy icon to copy passwords to clipboard
- **Edit**: Click the menu (⋮) and select "Edit"
- **Delete**: Click the menu (⋮) and select "Delete"
- **Search**: Use the search bar to find passwords
- **Filter**: Use the category filter to organize passwords

### Security Features

- **Local Encryption**: All data is encrypted with your master password
- **No Cloud Storage**: Your data never leaves your device
- **Strong Password Generation**: Built-in password generator with customizable options
- **Password Strength Analysis**: Real-time feedback on password strength

## Security Considerations

- **Master Password**: Choose a strong, unique master password
- **Device Security**: Ensure your device is secure and protected
- **Backup**: Consider backing up your encrypted data
- **Updates**: Keep the application updated for security patches

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is for educational and personal use. While it implements strong encryption, it's important to:
- Use a strong master password
- Keep your device secure
- Regularly backup your data
- Consider using established password managers for critical accounts

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
