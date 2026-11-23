/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * NothingCord - Glyph / Nothing OS inspired theme
 * Palette and type roles follow Nebelung-cloud/glyph-rice:
 * black, white dots, one red; Doto for numbers/short titles,
 * Space Grotesk for UI, Space Mono for small caps labels.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export {};

const css = `
@import url("https://fonts.googleapis.com/css2?family=Doto:wght@500;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap");

:root, .theme-dark, .theme-light, .theme-darker, .theme-midnight {
    --g-0: #000000;
    --g-1: #0e0e0e;
    --g-2: #1a1a1a;
    --g-3: #2a2a2a;
    --g-4: #4a4a4a;
    --g-5: #8c8c8c;
    --g-6: #f2f2f2;
    --g-red: #d71921;
    --g-ui: "Space Grotesk", system-ui, sans-serif;
    --g-mono: "Space Mono", ui-monospace, monospace;
    --g-dot: "Doto", "Space Mono", monospace;

    --font-primary: var(--g-ui);
    --font-display: var(--g-ui);
    --font-headline: var(--g-ui);
    --font-code: var(--g-mono);

    --brand-experiment: var(--g-red);
    --brand-500: var(--g-red);
    --brand-460: #e8333b;
    --brand-530: #b8141b;
    --brand-560: #9c1017;
    --bg-brand: var(--g-red);
    --text-brand: var(--g-red);
    --button-filled-brand-background: var(--g-6);
    --button-filled-brand-background-hover: #ffffff;
    --button-filled-brand-background-active: var(--g-5);
    --button-filled-brand-text: var(--g-0);
    --focus-primary: var(--g-6);
    --text-link: var(--g-6);

    --background-primary: var(--g-0);
    --background-secondary: var(--g-0);
    --background-secondary-alt: var(--g-0);
    --background-tertiary: var(--g-0);
    --background-floating: var(--g-1);
    --background-accent: var(--g-2);
    --background-base-lowest: var(--g-0);
    --background-base-lower: var(--g-0);
    --background-base-low: var(--g-0);
    --background-surface-high: var(--g-1);
    --background-surface-higher: var(--g-2);
    --background-surface-highest: var(--g-3);
    --background-mod-subtle: var(--g-1);
    --background-mod-normal: var(--g-2);
    --background-mod-strong: var(--g-3);
    --background-modifier-hover: var(--g-1);
    --background-modifier-selected: var(--g-2);
    --background-modifier-active: var(--g-2);
    --chat-background-default: var(--g-0);
    --channeltextarea-background: var(--g-1);
    --input-background: var(--g-1);
    --modal-background: var(--g-1);
    --home-background: var(--g-0);
    --border-subtle: var(--g-3);
    --border-normal: var(--g-3);
    --border-strong: var(--g-4);

    --text-default: var(--g-6);
    --text-normal: var(--g-6);
    --text-strong: #ffffff;
    --text-muted: var(--g-5);
    --text-subtle: var(--g-5);
    --header-primary: #ffffff;
    --header-secondary: var(--g-5);
    --interactive-normal: var(--g-5);
    --interactive-hover: var(--g-6);
    --interactive-active: #ffffff;
    --interactive-muted: var(--g-4);

    --scrollbar-thin-thumb: var(--g-3);
    --scrollbar-auto-thumb: var(--g-3);
    --scrollbar-auto-track: transparent;
    --scrollbar-thin-track: transparent;

    --status-online: var(--g-6);
    --status-idle: var(--g-5);
    --status-dnd: var(--g-red);
    --status-offline: var(--g-4);
    --status-danger: var(--g-red);
    --button-danger-background: var(--g-red);
    --button-danger-background-hover: #b8141b;
    --mention-foreground: var(--g-0);
    --mention-background: var(--g-6);
    --message-reacted-background: var(--g-2);
    --message-reacted-border: var(--g-red);
}

html, body, #app-mount {
    background: var(--g-0) !important;
    font-family: var(--g-ui) !important;
    letter-spacing: 0;
}

/* Titles: Doto for a dot-matrix feel, kept large enough to read */
h1, [class*="headerText_"] {
    font-family: var(--g-dot) !important;
    font-weight: 800 !important;
    letter-spacing: 0.02em;
}

/* Small labels: Space Mono caps */
[class*="sectionTitle_"], [class*="eyebrow_"], [class*="privateChannelsHeaderContainer_"],
[class*="membersGroup_"], [class*="statusText_"] {
    font-family: var(--g-mono) !important;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 11px !important;
    color: var(--g-5) !important;
}

/* Flat surfaces separated by hairlines instead of fills */
[class*="sidebar_"], [class*="guilds_"], [class*="membersWrap_"] {
    background: var(--g-0) !important;
    border-color: var(--g-3) !important;
}
[class*="sidebar_"] { border-right: 1px solid var(--g-3) !important; }
[class*="membersWrap_"] { border-left: 1px solid var(--g-3) !important; }
[class*="searchBar_"] { background: var(--g-1) !important; }

/* Channel / DM rows */
[class*="interactive_"][class*="selected_"], [class*="modeSelected_"] {
    background: var(--g-2) !important;
    border-radius: 14px !important;
    box-shadow: none !important;
}
[class*="interactive_"]:hover {
    background: var(--g-1) !important;
    border-radius: 14px !important;
}
[class*="interactive_"][class*="selected_"] [class*="name_"],
[class*="modeSelected_"] [class*="name_"] { color: #ffffff !important; }

/* Server icons: round, red pip for the selected one */
[class*="blobContainer_"], [class*="guildIcon_"] { border-radius: 50% !important; }
[class*="pill_"] span { background: var(--g-red) !important; }

/* Input: capsule */
[class*="channelTextArea_"] {
    border-radius: 999px !important;
    background: var(--g-1) !important;
    border: 1px solid var(--g-3) !important;
}
[class*="channelTextArea_"]:focus-within { border-color: var(--g-6) !important; }
input, textarea, [class*="inputDefault_"] {
    background: var(--g-1) !important;
    border: 1px solid var(--g-3) !important;
    border-radius: 14px !important;
}
input:focus, textarea:focus { border-color: var(--g-6) !important; }

/* Buttons: white filled capsule, red only for danger */
button[class*="lookFilled_"] {
    border-radius: 999px !important;
    font-family: var(--g-mono) !important;
    font-weight: 700 !important;
    letter-spacing: 0.06em;
}
button[class*="colorBrand_"][class*="lookFilled_"] {
    background: var(--g-6) !important;
    color: var(--g-0) !important;
}
button[class*="colorBrand_"][class*="lookFilled_"]:hover { background: #ffffff !important; }
button[class*="colorRed_"][class*="lookFilled_"] { background: var(--g-red) !important; color: #fff !important; }
button[type="submit"][class*="lookFilled_"], button[class*="fullWidth"][class*="lookFilled_"] {
    background: var(--g-6) !important;
    color: var(--g-0) !important;
}
button[class*="lookOutlined_"], button[class*="lookInverted_"] {
    border-radius: 999px !important;
    border: 1px solid var(--g-4) !important;
    background: transparent !important;
    color: var(--g-6) !important;
}

/* Friends tabs: pills, active one white */
[class*="tabBar_"] [class*="item_"] { border-radius: 999px !important; }
[class*="tabBar_"] [class*="item_"][aria-selected="true"] {
    background: var(--g-6) !important;
    color: var(--g-0) !important;
}

/* Popouts, menus, modals */
[class*="menu_"], [class*="popout_"], [class*="layerContainer_"] [role="dialog"] {
    background: var(--g-1) !important;
    border: 1px solid var(--g-3) !important;
    border-radius: 20px !important;
    box-shadow: none !important;
}

/* Badges */
[class*="numberBadge_"], [class*="lowerBadge_"] {
    background: var(--g-red) !important;
    color: #fff !important;
    font-family: var(--g-dot) !important;
    font-weight: 800;
}

/* Messages */
[class*="message_"]:hover { background: var(--g-1) !important; }
code, pre { font-family: var(--g-mono) !important; background: var(--g-1) !important; border-radius: 10px; }
[class*="embedWrapper_"] { background: var(--g-1) !important; border-radius: 16px !important; border-color: var(--g-3) !important; }

/* Voice / user panel */
[class*="panels_"] > div { background: var(--g-1) !important; border-radius: 20px !important; border: 1px solid var(--g-3) !important; }

/* Scrollbars */
::-webkit-scrollbar { width: 6px !important; }
::-webkit-scrollbar-thumb { background: var(--g-3) !important; border-radius: 999px !important; border: 0 !important; }
::-webkit-scrollbar-track { background: transparent !important; }

/* Quiet dot-grid on the main content area */
[class*="chatContent_"] {
    background-image: radial-gradient(var(--g-2) 1px, transparent 1.2px);
    background-size: 22px 22px;
}
`;

function inject() {
    if (document.getElementById("nothingcord-theme")) return;
    const style = document.createElement("style");
    style.id = "nothingcord-theme";
    style.textContent = css;
    (document.head ?? document.documentElement).appendChild(style);
}

try {
    if (document.head || document.documentElement) inject();
    else document.addEventListener("DOMContentLoaded", inject, { once: true });
} catch (e) {
    console.error("[NothingCord] theme injection failed", e);
}
