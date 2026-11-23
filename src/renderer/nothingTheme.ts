/*
 * NothingCord - Nothing OS inspired theme
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const css = `
@import url("https://fonts.googleapis.com/css2?family=Doto:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap");

:root, .theme-dark, .theme-light, .theme-darker, .theme-midnight {
    --nothing-red: #d71921;
    --nothing-black: #000000;
    --nothing-surface: #0a0a0a;
    --nothing-surface-2: #141414;
    --nothing-line: #2a2a2a;
    --nothing-white: #ffffff;
    --nothing-grey: #8a8a8a;
    --nothing-radius: 20px;

    --brand-500: var(--nothing-red);
    --brand-460: #e12a32;
    --brand-530: #b8141b;
    --brand-560: #9c1017;
    --background-primary: var(--nothing-black);
    --background-secondary: var(--nothing-surface);
    --background-secondary-alt: var(--nothing-surface);
    --background-tertiary: var(--nothing-black);
    --background-floating: var(--nothing-surface-2);
    --background-base-lowest: var(--nothing-black);
    --background-base-lower: var(--nothing-black);
    --background-base-low: var(--nothing-surface);
    --background-surface-high: var(--nothing-surface-2);
    --chat-background-default: var(--nothing-black);
    --channeltextarea-background: var(--nothing-surface-2);
    --text-normal: var(--nothing-white);
    --text-muted: var(--nothing-grey);
    --header-primary: var(--nothing-white);
    --header-secondary: var(--nothing-grey);
    --interactive-normal: var(--nothing-grey);
    --interactive-hover: var(--nothing-white);
    --interactive-active: var(--nothing-white);
    --text-link: var(--nothing-white);
    --scrollbar-thin-thumb: var(--nothing-line);
    --scrollbar-auto-thumb: var(--nothing-line);
    --scrollbar-auto-track: transparent;
    --font-primary: "Space Mono", monospace;
    --font-display: "Doto", "Space Mono", monospace;
}

body, #app-mount, [class*="app_"], [class*="bg_"] {
    background: var(--nothing-black) !important;
    font-family: "Space Mono", monospace !important;
}

h1, h2, h3, [class*="title_"], [class*="header_"] [class*="name_"] {
    font-family: "Doto", "Space Mono", monospace !important;
    font-weight: 900 !important;
    letter-spacing: 0.04em;
}

[class*="guilds_"], [class*="sidebar_"], [class*="panels_"], [class*="members_"] {
    background: var(--nothing-surface) !important;
    border-color: var(--nothing-line) !important;
}

[class*="chatContent_"] [class*="scrollerInner_"] [class*="message_"]:hover {
    background: var(--nothing-surface) !important;
}

[class*="channelTextArea_"], [class*="searchBar_"], input, textarea,
[class*="inputDefault_"], [class*="searchBarComponent_"] {
    border-radius: var(--nothing-radius) !important;
    border: 1px solid var(--nothing-line) !important;
    background: var(--nothing-surface-2) !important;
}

[class*="wrapper_"] > [class*="childWrapper_"], [class*="avatar_"], [class*="icon_"] img,
[class*="guildIcon_"], img[class*="avatar"] {
    border-radius: 50% !important;
}

button, [class*="button_"], [class*="lookFilled_"], [class*="lookOutlined_"] {
    border-radius: 999px !important;
    font-family: "Space Mono", monospace !important;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

[class*="colorBrand_"], [class*="lookFilled_"][class*="colorBrand_"] {
    background: var(--nothing-red) !important;
    color: var(--nothing-white) !important;
}

[class*="modal_"], [class*="layer_"] [class*="container_"][role="dialog"], [class*="menu_"], [class*="popout_"] {
    border-radius: var(--nothing-radius) !important;
    border: 1px solid var(--nothing-line) !important;
    background: var(--nothing-surface-2) !important;
}

[class*="selected_"], [class*="modeSelected_"] {
    background: var(--nothing-surface-2) !important;
    box-shadow: inset 3px 0 0 var(--nothing-red);
}

[class*="numberBadge_"], [class*="mention_"] {
    background: var(--nothing-red) !important;
    color: var(--nothing-white) !important;
}

[class*="status_"][class*="online"] { background: var(--nothing-white) !important; }

::-webkit-scrollbar-thumb { border-radius: 999px !important; background: var(--nothing-line) !important; }
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
