# Design System Document: Editorial Engineering

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Artisan."** 

This system rejects the sterile, "bootstrap" appearance of standard developer portfolios in favor of an editorial, high-end aesthetic. It blends the technical precision of front-end engineering with the warm, tactile sophistication of a boutique espresso lounge. By leveraging a palette of deep charcoals, desaturated olives (`primary`), and warm creams (`secondary`), we create an environment that feels expensive, intentional, and calm.

The design breaks traditional grid rigidity through **intentional asymmetry**. Large-scale typography acts as a structural element, while content blocks utilize overlapping layers and varied surface elevations to create a sense of physical depth. Transitions should not just "happen"; they should feel like a camera lens focusing—soft, purposeful, and high-fidelity.

---

## 2. Colors: The Tonal Landscape
Our palette is rooted in the "Earthy Tech" spectrum—moving away from pure blacks and vibrant neons toward sophisticated, organic neutrals.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established through color-blocking and background shifts. 
- Use `surface` (`#121416`) as the foundation.
- Transition to `surface_container_low` (`#1a1c1e`) for secondary sections.
- Use `surface_container_high` (`#282a2c`) for featured highlight areas.

### Surface Hierarchy & Nesting
Think of the UI as a physical stack of materials. 
- **The Base:** `surface_dim` (`#121416`).
- **The Layer:** `surface_container` (`#1e2022`).
- **The Detail:** `surface_container_highest` (`#333537`) for small, interactive elements.
Nesting these tones provides a natural "lift" that mimics ambient studio lighting.

### The Glass & Gradient Rule
To achieve a "High-Tech" feel without losing warmth:
- **Glassmorphism:** Use `surface_variant` (`#333537`) at 60% opacity with a `20px` backdrop-blur for floating navigation or modal overlays.
- **Signature Textures:** Apply a subtle linear gradient from `primary` (`#bbcbb7`) to `primary_container` (`#3e4c3d`) for hero-section call-to-actions to give them a metallic, satin-like finish.

---

## 3. Typography: The Editorial Voice
Typography is the core of this system's "Professionalism." We pair the technical geometry of **Space Grotesk** with the Swiss-inspired clarity of **Inter**.

- **Display & Headlines (Space Grotesk):** Used for large-scale statements. The wide apertures and geometric forms convey modern engineering.
    - *Scale:* `display-lg` (3.5rem) for hero titles; `headline-md` (1.75rem) for section headers.
- **Body & Labels (Inter):** Reserved for technical data, descriptions, and UI controls. Inter provides maximum readability at small scales.
    - *Scale:* `body-lg` (1rem) for project descriptions; `label-sm` (0.6875rem) for metadata tags.

**Hierarchy Tip:** Contrast a `display-lg` headline (Space Grotesk) with a `label-md` (Inter, All Caps, Letter Spaced 0.1em) directly above it to create a high-fashion, editorial layout.

---

## 4. Elevation & Depth
We eschew traditional "drop shadows" in favor of **Tonal Layering** and **Ambient Occlusion**.

- **The Layering Principle:** A card does not need a shadow if it is `surface_container_lowest` sitting on a `surface_container_high` background. The contrast in value creates the separation.
- **Ambient Shadows:** For elements that must float (e.g., floating action buttons), use a diffused shadow: `box-shadow: 0 20px 40px rgba(12, 14, 16, 0.4)`. The shadow color is a dark tint of our `surface` color, not neutral grey.
- **The "Ghost Border" Fallback:** If a boundary is visually required for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "suggestion" of a line rather than a hard boundary.
- **Glassmorphism:** Navigation bars should use the `surface_bright` token with 40% transparency and a high blur. This allows the "warmth" of the content to bleed through as the user scrolls.

---

## 5. Components

### Buttons
- **Primary:** Background `primary` (`#bbcbb7`), Text `on_primary` (`#263426`). Shape: `DEFAULT` (0.25rem radius). 
- **Secondary:** Background `secondary_container` (`#574632`), Text `on_secondary_container`.
- **Tertiary/Ghost:** Text `primary`, no background. On hover, apply a `surface_container_highest` background with a smooth 300ms transition.

### Chips (Skill Tags)
- Use `surface_container_highest` for the background.
- Typography: `label-md` in `on_surface_variant`. 
- Roundedness: `full` (9999px) to contrast with the sharper corners of cards.

### Cards & Projects
- **Strict Rule:** No dividers. 
- Use a `surface_container_low` background. On hover, transition the background to `surface_container_high` and slightly shift the element 4px upward. 
- Text should be inset with generous padding (at least 32px) to emphasize the "Editorial" feel.

### Input Fields
- **Style:** Underline only or subtle `surface_container_highest` fill. 
- **Focus State:** Transition the `outline` color to `primary` with a 2px bottom border.

### Signature Component: The "Project Scroller"
Implement a horizontal parallax scroll for project thumbnails where the project name (`display-md`) overlaps the image, utilizing a `backdrop-blur` text-effect.

---

## 6. Do's and Don'ts

### Do:
- **Do** use generous whitespace. If you think there is enough space, add 20% more.
- **Do** use `primary_fixed_dim` for icons to keep them from being too jarring against the dark background.
- **Do** use smooth, cubic-bezier transitions (`cubic-bezier(0.4, 0, 0.2, 1)`) for all hover states.

### Don't:
- **Don't** use 100% white (#FFFFFF) for text. Use `on_surface` (`#e2e2e5`) to prevent eye strain and maintain the "Earthy" tone.
- **Don't** use standard "Material" shadows. They are too aggressive for this refined aesthetic.
- **Don't** use sharp 90-degree corners. Even a small `sm` (0.125rem) radius softens the "tech" look into something more premium.
- **Don't** use divider lines to separate list items; use a change in background tone or increase vertical padding.