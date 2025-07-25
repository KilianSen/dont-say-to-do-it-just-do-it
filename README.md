# Don't Say To Do It, Just Do It! 🚀

> **Stop endless conversations. Start building solutions.**

A humorous yet educational website that encourages action over endless discussion in software development teams. Inspired by [Don't ask to ask, just ask](https://dontasktoask.com/).

## 🎯 Purpose

We've all been there: team members who love to suggest features, discuss grand refactoring plans, and propose ambitious changes—but somehow never contribute actual code. This site provides a gentle (but direct) way to encourage your colleagues to channel their talking energy into building energy.

## ✨ Features

- 📖 **Real-world examples** of common workplace scenarios
- 🎨 **Beautiful, responsive design** with dark/light mode support
- 📝 **Story submission system** via GitHub issues
- 🔗 **Easy sharing** with one-click URL copying
- ⚡ **Smooth animations** and engaging user experience

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hot Toast** for notifications
- **Shadcn/ui** components
- **React Markdown** for content rendering

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/KilianSen/dont-say-to-do-it-just-do-it.git

# Navigate to project directory
cd dont-say-to-do-it-just-do-it

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the site in action.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point

public/
├── data.json            # Story examples data
└── terms.md             # Terms and conditions
```

## 📚 Content Management

### Adding New Stories

Stories are stored in `public/data.json`. Each story follows this structure:

```json
{
  "title": "Story Title",
  "subtitle": "Brief description (optional)",
  "timeframe": "Duration or deadline context",
  "severity": "low|medium|high",
  "badge": "Category tag",
  "content": "Markdown content of the story"
}
```

### User Submissions

Users can submit stories through the website form, which generates a GitHub issue with properly formatted data for easy review and addition.

## 🎨 Customization

### Themes

The site supports both light and dark themes using Tailwind CSS and a custom theme provider.

### Animations

Animations are powered by Framer Motion and can be customized in the component variants within `App.tsx`.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Submit stories** through the website form
2. **Report bugs** by creating an issue
3. **Suggest improvements** via pull requests
4. **Share the site** with colleagues who need a gentle nudge

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI components when possible
- Maintain the humorous but respectful tone
- Test changes across different screen sizes

## 📖 Example Stories

The site features real-world examples like:

- **The Feature Suggester**: Proposes ambitious features but vanishes when implementation begins
- **The Last-Minute Visionary**: Suggests complete rewrites days before deadlines
- **The Bootcamp Enthusiast**: Confuses desperation with productivity

## 🎯 When to Use This Site

Send this link when someone:
- Suggests features but never codes them
- Proposes massive refactors without contributing
- Talks about "what we should do" but never does it
- Disappears after making suggestions

Remember: This is meant to be constructive, not mean-spirited. The goal is to help team members become more action-oriented.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [Don't ask to ask, just ask](https://dontasktoask.com/)
- Built with love for frustrated developers everywhere
- Thanks to all contributors sharing their workplace stories

---

**Remember: Actions speak louder than words. 💪**

_Have a story to share? Use the submission form on the website!_
