# 🐾 Pocketpet

> A friendly virtual pet that appears on webpages to brighten your day and remind you to take care of yourself!

A Chrome extension that brings adorable virtual pets to your browsing experience. Choose from 8 cute companions that pop up on webpages with wellness reminders, fun animations, and interactive features!

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 🐾 **8 Adorable Pets** - Choose from Budgie, Cat, Dog, Fish, Hamster, Panda, Rabbit, or Turtle
- 🎲 **Surprise Me!** - Let the extension randomly pick a pet for you
- 💧 **Wellness Reminders** - Get gentle nudges to drink water, stretch, and take breaks
- 🌙 **Sleep Reminders** - Late night browsing? Your pet will remind you to rest
- 🎵 **Sound Effects** - Cute pop sounds when you interact with your pet
- 💖 **Heart Particles** - Click your pet to see floating hearts
- 🖱️ **Draggable** - Move your pet anywhere on the screen
- 🎭 **Animations** - Bounce, dance, and float animations bring your pet to life
- ⚙️ **Customizable** - Set appearance intervals or keep pet visible all the time
- 🆓 **100% Free** - No subscriptions, no ads, no tracking

---

## 🚀 Quick Install

### 1. Clone or Download
```bash
git clone https://github.com/Jenishkr/Pocketpet.git

```

Or click the green **"Code"** button above → **"Download ZIP"**

### 2. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `Pocketpet` folder
5. Done! 🎉

The extension is ready to use immediately - no additional setup required!

---

## 📖 How to Use

### First Time Setup

1. **Click the Extension Icon**
   - Click the Pocketpet icon in your Chrome toolbar
   - You'll see the main popup interface

2. **Select Your Pet**
   - Click **"Change Pet"** to open the pet selector
   - Choose from 8 adorable companions or pick "Surprise Me!"
   - Your selection is automatically saved

3. **Customize Settings (Optional)**
   - Click the ⚙️ settings icon
   - Toggle "Show Pet All Time" to keep your pet visible constantly
   - Adjust appearance interval (30-300 seconds)
   - Click "Save Settings"

### Interacting with Your Pet

**Show Your Pet:**
- Click **"Show Pet on Page"** in the popup
- Your pet will appear on the current webpage

**Click Interactions:**
- **Single Click** - Your pet bounces and shows a wellness message
- **Double Click** - Your pet dances with a fun message
- **Drag & Drop** - Move your pet anywhere on the screen

**Wellness Messages:**
Your pet will remind you to:
- Drink water 💧
- Stretch your body 🧘
- Take breaks from screens 👀
- Keep going - you're doing great! 💪
- Get rest during late hours 😴

---

## 🖼️ Screenshots

### Main Popup
Your pet companion and quick controls at a glance

### Pet Selector
Choose from 8 adorable pets or go for a surprise

### Pet on Page
Your virtual buddy appears with floating animations

### Settings Panel
Customize appearance intervals and visibility

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Platform**: Chrome Extension Manifest V3
- **Storage**: Chrome Storage API (sync)
- **Graphics**: SVG pet illustrations
- **Audio**: Web Audio API for sound effects

---

## 🔒 Privacy & Security

- ✅ **No Data Collection** - We don't collect, track, or share any personal data
- ✅ **Local Storage Only** - All settings stored locally in your browser
- ✅ **No External APIs** - No connections to external servers or services
- ✅ **No Permissions Abuse** - Only requests necessary permissions
- ✅ **Open Source** - Full transparency with MIT license

---

## 📁 Project Structure
```
Pocketpet/
├── manifest.json              # Extension configuration
├── src/
│   ├── background.js          # Service worker (scheduling, settings)
│   ├── content.js             # Content script (pet display, interactions)
│   ├── style.css              # Pet animations and styles
│   └── popup/
│       ├── popup.html         # Extension popup UI
│       ├── popup.js           # Popup logic (pet selection, settings)
│       ├── popup.css          # Popup styles
│       ├── settings.html      # Settings panel
│       ├── settings.css       # Settings styles
│       └── settings.js        # Settings logic
├── pets/
│   ├── Budgie.svg
│   ├── Cat.svg
│   ├── dog.svg
│   ├── Fish.svg
│   ├── Hamster.svg
│   ├── Panda.svg
│   ├── Rabbit.svg
│   └── Turtle.svg
├── sounds/
│   └── pop.mp3                # Interaction sound effect
├── fund/
│   └── donate.svg             # Support the developer
└── icons/
    └── Pocketpet.png          # Extension icons
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

### How to Contribute

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Tips

- The extension uses Chrome Storage API for persistence
- Content script handles all pet interactions and animations
- Background service worker manages scheduling
- Test with different Chrome profiles to simulate fresh installs
- Check browser console for debugging

---

## 🐛 Troubleshooting

### Extension won't load
- Make sure all files are in the Pocketpet folder
- Check `chrome://extensions/` for error messages
- Try reloading the extension

### Pet not appearing
- Ensure you've selected a pet from the popup
- Check that you're not on a chrome:// page (security restriction)
- Try refreshing the webpage
- Check browser console for errors

### Settings not saving
- Ensure Chrome sync is enabled in your browser
- Try clearing extension storage and reselecting

### Sound not playing
- Check your system volume
- Some browsers may block autoplay - click the pet to trigger sound

### Pet disappears too quickly
- Open settings and enable "Show Pet All Time"
- Or increase the appearance interval

Need more help? [Open an issue](https://github.com/Jenishkr/Pocketpet/issues)


---

## 📝 Roadmap

### Planned Features
- [ ] **More Pets** - Add additional animal companions
- [ ] **Pet Customization** - Change colors, accessories, or outfits
- [ ] **Achievements** - Track wellness streaks and interactions
- [ ] **Dark Mode** - Easy on the eyes during night browsing
- [ ] **Multi-browser** - Firefox and Edge support
- [ ] **Pet Moods** - Pets react differently based on time of day
- [ ] **Custom Messages** - Add your own wellness reminders

Want to work on one of these? Open a PR! 🚀

---

## ❓ FAQ

**Q: Is this extension free?**  
A: Yes! 100% free, no hidden costs, no ads, no subscriptions.

**Q: Does it collect my data?**  
A: No! Pocketpet stores everything locally in your browser. We don't collect, track, or share any data.

**Q: Can I use this on any website?**  
A: Pocketpet works on most websites, but Chrome security prevents it from running on chrome:// pages (like settings, extensions page, etc.).

**Q: How do I change my pet?**  
A: Click the Pocketpet icon → "Change Pet" → Select a new companion!

**Q: Can I keep my pet visible all the time?**  
A: Yes! Open settings (⚙️ icon) and enable "Show Pet All Time".

**Q: Does it work on mobile Chrome?**  
A: Currently Chrome extensions only work on desktop. Mobile support may come later.

**Q: Can I add my own pet images?**  
A: Not yet, but this is on the roadmap! For now, enjoy our 8 adorable companions.

**Q: Why does my pet remind me to take breaks?**  
A: Your pet cares about your wellbeing! These gentle reminders help maintain healthy browsing habits.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this code freely. Just keep the license notice.

---

## 👨‍💻 Author

**Jenish Kumar** ([@Jenishkr](https://github.com/Jenishkr))

- 💼 GitHub: [@Jenishkr](https://github.com/Jenishkr)
- 🐛 Issues: [Report a bug](https://github.com/Jenishkr/Pocketpet/issues)


---

## 🙏 Acknowledgments

- Inspired by the need for digital wellness and self-care
- Thanks to the Chrome Extensions community for documentation
- Special thanks to all future contributors! ⭐

---

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ **Starring** this repository
- 🐛 **Reporting bugs** or suggesting features
- 🔀 **Contributing** code improvements
- 📢 **Sharing** with friends who need a wellness buddy

Every star motivates me to keep improving! 🚀

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/Jenishkr/Pocketpet?style=social)
![GitHub forks](https://img.shields.io/github/forks/Jenishkr/Pocketpet?style=social)
![GitHub issues](https://img.shields.io/github/issues/Jenishkr/Pocketpet)


---

**Made with ❤️ for better digital wellbeing**

*Take care of yourself, and let your virtual pet remind you to stay healthy!* 🐾💚
