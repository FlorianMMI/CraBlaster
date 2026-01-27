# CraBlaster AI Coding Agent Instructions

## Project Overview
CraBlaster is a browser-based 3D/VR experience built with [A-Frame](https://aframe.io/) and vanilla JavaScript. The project structure is simple, with all client code in the `client/` directory. The main entry point is `index2.html`, which loads scripts and assets for the VR scene.

## Key Components
- **index2.html**: Main HTML file. Loads A-Frame, extra components, and all scripts. Scene and UI are defined here.
- **start.js**: Handles the start menu and initial scene setup. Uses A-Frame DOM APIs to create and manipulate entities.
- **decor2.js**: Contains scene decoration logic (e.g., spawning rocks) and custom A-Frame components.
- **weapons/**: Placeholder for weapon logic (currently empty files: `fusil.js`, `pistolet.js`, `sabre.js`, `weapons.js`). Extend here for weapon features.
- **asset/**: Contains font and model assets for the scene.
- **style.css**: Minimal CSS for layout and font.

## Developer Workflows
- **No build step**: All code is loaded directly in the browser. Edit JS/CSS/HTML and refresh to see changes.
- **Debugging**: Use browser dev tools. A-Frame logs errors/warnings to the console.
- **VR/PC support**: The UI adapts for VR controllers or mouse (see logic in `index2.html`).

## Project-Specific Patterns
- **A-Frame DOM manipulation**: Prefer creating/updating scene elements via JavaScript (see `start.js`, `decor2.js`).
- **Component registration**: Custom A-Frame components are registered in JS (see `decor2.js`).
- **Font assets**: Use MSDF font JSONs in `asset/` for 3D text rendering.
- **Weapons**: Add new weapon logic as modules in `client/weapons/` and import as needed.

## Conventions
- **No frameworks**: Only A-Frame and vanilla JS. No build tools or transpilers.
- **File naming**: Use lowercase, descriptive names. Group related logic (e.g., all weapons in `weapons/`).
- **Scene logic**: Keep scene setup and entity creation in JS, not HTML.

## Examples
- See `start.js` for how to create and position A-Frame entities programmatically.
- See `decor2.js` for custom A-Frame component registration and procedural scene decoration.

## Integration Points
- **A-Frame**: All 3D/VR logic is built on A-Frame. See [A-Frame docs](https://aframe.io/docs/) for API details.
- **Assets**: Reference assets (models, fonts) via relative paths in JS and HTML.

---
For further details, review the files in `client/` and the main HTML entry point. Update this file as new conventions or workflows emerge.
