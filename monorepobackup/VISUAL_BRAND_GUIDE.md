# iiskills Visual Brand Guide - Quick Reference

## Subject Signature Colors

### Math - The Architect's Path
```
Color: Crimson Red
Hex: #DC143C
RGB: rgb(220, 20, 60)
Gradient: from-red-700 to-black
Tagline: "Unlock the Language of Logic"
```

**Tri-Level Messages**:
- Basic: "The Power of Zero & One"
- Intermediate: "The Variable Hunter"
- Advanced: "The Infinite Curve"

**CTA**: "Start My Power Hour: Math"

---

### Physics - The Force Path
```
Color: Electric Blue
Hex: #0080FF
RGB: rgb(0, 128, 255)
Gradient: from-blue-500 to-blue-900
Tagline: "Master the Laws of the Universe"
```

**Tri-Level Messages**:
- Basic: "The Cheetah's Secret"
- Intermediate: "The Invisible Hand"
- Advanced: "The Fabric of Time"

**CTA**: "Master the Laws Now"

---

### Chemistry - The Elemental Path
```
Color: Atomic Purple
Hex: #9B59B6
RGB: rgb(155, 89, 182)
Gradient: from-purple-600 to-gray-800
Tagline: "Decode the Ingredients of Reality"
```

**Tri-Level Messages**:
- Basic: "The Atom's Heart"
- Intermediate: "The Great Balance"
- Advanced: "The Heat of Chaos"

**CTA**: "Decode the Elements"

---

### Geography - The Systems Path
```
Color: Emerald Green
Hex: #10B981
RGB: rgb(16, 185, 129)
Gradient: from-green-500 to-green-900
Tagline: "Command the Systems of Earth"
```

**Tri-Level Messages**:
- Basic: "The Global Grid"
- Intermediate: "The Moving Earth"
- Advanced: "The Human Engine"

**CTA**: "Chart the Course"

---

## Tri-Level Color System

### Level 1: Basic
```
Icon: 🟢 (Green Circle)
Background: from-green-50 to-green-100
Border: border-green-500 (left border, 4px)
Text: text-green-700
Badge: text-green-600
```

### Level 2: Intermediate
```
Icon: 🔵 (Blue Circle)
Background: from-blue-50 to-blue-100
Border: border-blue-500 (left border, 4px)
Text: text-blue-700
Badge: text-blue-600
```

### Level 3: Advanced
```
Icon: 🟣 (Purple Circle)
Background: from-purple-50 to-purple-100
Border: border-purple-500 (left border, 4px)
Text: text-purple-700
Badge: text-purple-600
```

---

## Trust Badges Colors

### Badge 1: Growing Fast
```
Icon: 🌍
Border: border-primary (top, 4px)
Title: text-primary
```

### Badge 2: 100% Free
```
Icon: ✅
Border: border-accent (top, 4px)
Title: text-accent
```

### Badge 3: Quality Certified
```
Icon: 🎓
Border: border-green-600 (top, 4px)
Title: text-green-600
```

---

## Monorepo Synergy Features

### One Profile
```
Icon: 👤
Background: bg-blue-50
Text Color: text-gray-900
```

### Unified Streaks
```
Icon: 🔥
Background: bg-purple-50
Text Color: text-gray-900
```

### Shared UI
```
Icon: 🎯
Background: bg-green-50
Text Color: text-gray-900
```

---

## Animation Details

### Confetti Animation
```javascript
Particles: 50
Colors: ["#FFD700", "#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181"]
Duration: 2-4 seconds (randomized)
Direction: Top to bottom (y-axis)
Rotation: 0° to 360°
Trigger: Correct answer in GatekeeperTest
```

### Button Hover Effects
```javascript
Scale: 1.05 on hover, 0.95 on click
Box Shadow: Colored glow matching button color
Animation: Radial gradient background pulse
Duration: 2 seconds infinite loop
```

### Level Card Hover
```javascript
Scale: 1.02 on hover
Transition: 300ms ease
Shadow: Enhanced on hover
Initial: Staggered entrance (0.1s, 0.2s, 0.3s delays)
```

### CTA Button Glow
```javascript
Background: Radial gradient (subject color to transparent)
Scale: [1, 1.5, 1] infinite
Duration: 2 seconds
Opacity: 0 → 0.3 on hover
```

---

## Typography Scale

### Headlines
```
Main: text-4xl md:text-5xl lg:text-6xl (36-60px)
Section: text-3xl md:text-4xl (30-36px)
Subsection: text-2xl md:text-3xl (24-30px)
```

### Body Text
```
Large: text-lg sm:text-xl lg:text-2xl (18-24px)
Normal: text-base (16px)
Small: text-sm (14px)
Extra Small: text-xs (12px)
```

### Font Weights
```
Bold: font-bold (700)
Semibold: font-semibold (600)
Medium: font-medium (500)
Normal: font-normal (400)
```

---

## Spacing System

### Section Padding
```
Vertical: py-12 to py-16 (48-64px)
Horizontal: px-4 sm:px-6 lg:px-8 (16-32px responsive)
```

### Component Gaps
```
Small: gap-3 to gap-4 (12-16px)
Medium: gap-6 to gap-8 (24-32px)
Large: gap-12 (48px)
```

---

## Border Styles

### Cards
```
Border Radius: rounded-xl (12px)
Shadow: shadow-lg to shadow-2xl
Border: border-2 (optional accent borders)
```

### Glassmorphic
```
Background: bg-white/40 or rgba(255,255,255,0.1)
Backdrop: backdrop-blur-sm to backdrop-blur-xl
Border: border border-white/20
```

---

## Responsive Breakpoints

```
xs: < 640px (mobile)
sm: 640px (large mobile)
md: 768px (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
```

### Grid Responsiveness
```
Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: lg:grid-cols-3 or lg:grid-cols-4
```

---

## SVG & Icons

### Subject Icons
```
Math: ∑ (Sigma)
Physics: ⚡ (Lightning)
Chemistry: ⚗️ (Alembic)
Geography: 🌍 (Globe)
```

### System Icons
```
Profile: 👤
Streak: 🔥
Navigation: 🎯
World: 🌐
Badge: 🎓
Check: ✅
```

---

## Usage Examples

### Applying Subject Colors in Code
```javascript
// Math
style={{ color: "#DC143C", backgroundColor: "#DC143C" }}
className="text-red-700 bg-red-700"

// Physics
style={{ color: "#0080FF", backgroundColor: "#0080FF" }}
className="text-blue-500 bg-blue-500"

// Chemistry
style={{ color: "#9B59B6", backgroundColor: "#9B59B6" }}
className="text-purple-600 bg-purple-600"

// Geography
style={{ color: "#10B981", backgroundColor: "#10B981" }}
className="text-green-500 bg-green-500"
```

### Implementing Glassmorphic Style
```jsx
<div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl">
  {/* Content */}
</div>
```

### Adding Hover Animation
```jsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

---

## Brand Voice & Messaging

### Core Values
1. **Monorepo Powered** 🔗 - "One account, four subjects, zero friction"
2. **The Power Hour** ⚡ - "Master the 'Basic 6' modules in under 60 minutes"
3. **Tri-Level Logic** 🎯 - "A consistent path from Intuition to Expertise"

### Why iiskills?
- **One Profile**: Your iiskills account powers all apps
- **Unified Streaks**: Progress in Chemistry keeps your Math streak alive
- **Shared UI**: Learn one navigation. Rule all subjects

### Gatekeeper Philosophy
> "Don't just watch. Prove it."

Test your knowledge right now and discover your starting point.

---

**Last Updated**: 2026-02-08
**Maintained By**: iiskills Design Team
**Version**: 1.0
