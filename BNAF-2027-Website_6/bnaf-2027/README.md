# BNAF 2027 — Final Flight Edition

## Open the website

Extract the ZIP first. Open `index.html` in Chrome, Edge, Firefox or Safari. Keep all files and the assets folder together. No npm, build command, API key or backend is needed.

Each navigation item opens a separate HTML page in the same browser tab. Google Fonts and Google Forms require internet; system fonts are used when Google Fonts is unavailable.

For development you can also serve the folder with `python -m http.server 8000` and open `http://localhost:8000`.

## Final changes

The experimental 3D edition has been discarded. This restores the cinematic video version, with no animation-control buttons or gallery video. The straight blue strip uses the supplied wording: Workshops, Flight line, Fixed-wing, Gliders, Multirotor, FPV, separated by aircraft symbols. Two identical, viewport-filling groups produce a continuous horizontal loop at a consistent speed. The navigation and headings now use “The Festival”.

## Design

- Larger typography: 18px desktop body text, 17px mobile body text and oversized responsive page titles.
- A full-screen BORN TO TAKE FLIGHT homepage with the supplied film, animated orbit, flight path and a straight blue programme strip.
- A 1.25-second first-visit arrival sequence; dismiss with Skip intro or Escape.
- Staggered scroll reveals, workshop hover effects, interactive card lighting, a boarding-pass registration panel.
- Cross-page transitions in browsers that support them; ordinary navigation everywhere else.
- Animations run automatically. Device reduced-motion and data-saving preferences are respected.
- No white logo panel or large empty white sections. Seven independent HTML pages remain.

## File guide

- `index.html`: homepage and cinematic video background.
- `festival.html`: about the festival; deep ocean-blue theme.
- `workshops.html`: workshops; electric-blue theme.
- `gallery.html`: photo archive; deep teal and cyan theme.
- `team.html`: organisers; cobalt-blue theme.
- `register.html`: Google Form registration; periwinkle-blue theme.
- `contact.html`: contact information; deep teal theme.
- `styles.css`: colors, typography, animation and responsive layouts.
- `script.js`: navigation, accordions, seamless scrolling strip and Google Form integration.
- `config.js`: event details, contact email, workshops, team, gallery and Google Form links.
- `assets/`: supplied festival video, extracted poster, supplied logo artwork and favicon.

## Connect your Google Form

1. In Google Forms, make your form available to the intended respondents and copy its responder link.
2. Open `config.js` in a text editor.
3. Paste it between the quotes after `googleFormUrl`. Full Google Forms `/viewform` URLs and `https://forms.gle/...` short links are supported.
4. For an embedded form, paste the FULL responder URL after `googleFormEmbedUrl`. Do not paste iframe HTML or an `/edit` URL. The script adds `embedded=true` automatically. If `googleFormUrl` already contains a full responder URL, no second link is necessary.
5. Save and reload. The registration card will show “Open registration form” and, when possible, “Fill the form on this page”. The iframe only loads when requested.

The Google Form owns its fields and responses. This site does not submit, store, or email registration data. Google account restrictions and form availability are controlled in Google Forms. A short link alone can open in a new tab but cannot be embedded.

The form URL has not been provided, so the delivered version honestly displays “Registration details will be announced soon.” No test form or fake submission has been added.

## Change content

Edit the clearly labelled values in `config.js`:

- `dates`, `venue`, `organizer`, `email`
- `about`, `aboutDetail`
- `workshops`: title, tag and description
- `team`: name, role, bio and optional photo path
- `gallery`: image path, accessible description and caption

Place images in `assets/` and reference them as `assets/your-image.jpg`. Use normal quotes and keep commas between entries. Do not put private information or credentials in public website files. The team editor from the old sample stored changes in one visitor's browser; this version uses a central configuration so published edits are consistent for all visitors.

For headlines and other static wording, edit the corresponding HTML page. For the palette, edit the variables at the top of `styles.css`. The event name and year also appear in the title, metadata, navigation, registration card and footer; update those together for a later edition.


## Media and content status

The homepage background uses the supplied video. The gallery is reserved for photographs; its previous video player has been removed. The poster is a frame from the supplied video. The uploaded logo artwork is no longer displayed. Its blue palette inspires the page themes. Original images remain in assets for optional future use. Reference websites inspired the presentation; their graphics and code were not copied.

Dates and venue remain unannounced as in the source. The source's example contact email and “Full Name” team entries have been replaced with honest empty states. Add confirmed contacts, team details and archive photographs before launch. Workshop subjects are retained from the original sample; confirm the programme before publishing.

## Hosting

Upload all seven HTML pages, `styles.css`, `script.js`, `config.js` and `assets/` together to your static website host. `index.html` should be at the root. Keep filenames unchanged so navigation continues to work. This delivery does not deploy or replace a live website.

## Accessibility and verification

Includes a keyboard skip link, semantic sections, native workshop disclosures, responsive menu with Escape support, visible focus states, reduced-motion handling. The homepage uses the supplied video with a poster fallback. The CSS has been rebuilt as one coherent stylesheet instead of accumulating overrides. Reduced-motion and data-saving preferences disable automatic playback. Background video pauses off-screen, when the tab is hidden.

JavaScript syntax and all seven pages’ local asset, navigation and anchor consistency were checked. Browser access to the local preview was blocked in this environment, so final visual and interaction checks should be made after opening the files locally. A real Google Form cannot be verified until its link is supplied.
