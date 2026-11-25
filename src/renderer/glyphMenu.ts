/*
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * NothingCord - keyboard-driven wheel menus (Glyph style)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export {};

// Alt+S: servers (drops from the top), Alt+F: friends / DMs (rises from the bottom)

interface Entry {
    id: string;
    name: string;
    sub?: string;
    dot?: "on" | "dnd" | "idle" | "off";
    run: () => void;
    open?: () => Entry[]; // drill-down: returns children instead of running
    unread?: () => { n: number; dot: boolean };
}

const FAV_KEY = "nc-favs";
const favs = (): Set<string> => {
    try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]")); } catch { return new Set(); }
};
const toggleFav = (id: string) => {
    const s = favs();
    if (!s.delete(id)) s.add(id);
    localStorage.setItem(FAV_KEY, JSON.stringify([...s]));
};
const readOf = (store: string, id: string) => () => {
    try {
        const st = (window as any).Vencord?.Webpack?.findStore?.(store);
        const n = st?.getMentionCount?.(id) ?? 0;
        return { n, dot: !n && !!st?.hasUnread?.(id) };
    } catch { return { n: 0, dot: false }; }
};

const css = `
#nc-menu { position: fixed; left: 0; right: 0; z-index: 99999; display: flex; justify-content: center; pointer-events: none; }
#nc-menu.top { top: 0; }
#nc-menu.bottom { bottom: 0; }
#nc-menu .nc-panel {
    pointer-events: auto; width: min(760px, 92vw); background: #000; color: #f2f2f2;
    border: 1px solid #2a2a2a; padding: 22px 28px 18px; transition: transform .38s cubic-bezier(.2,.8,.2,1), opacity .25s;
    background-image: radial-gradient(#1a1a1a 1px, transparent 1.2px); background-size: 20px 20px;
}
#nc-menu.top .nc-panel { border-top: 0; border-radius: 0 0 32px 32px; transform: translateY(-110%); }
#nc-menu.bottom .nc-panel { border-bottom: 0; border-radius: 32px 32px 0 0; transform: translateY(110%); }
#nc-menu.open .nc-panel { transform: translateY(0); }
#nc-menu .nc-head { display: flex; align-items: center; gap: 14px; font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #8c8c8c; }
#nc-menu .nc-head .nc-title { color: #f2f2f2; }
#nc-menu .nc-head .nc-count { margin-left: auto; font-family: "Doto", "Space Mono", monospace; font-weight: 800; font-size: 20px; letter-spacing: .04em; color: #f2f2f2; }
#nc-menu input {
    all: unset; box-sizing: border-box; width: 100%; margin: 14px 0 6px; padding: 10px 18px; border: 1px solid #2a2a2a; border-radius: 999px;
    background: #0e0e0e; font-family: "Space Mono", monospace; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; caret-color: #d71921;
}
#nc-menu input:focus { border-color: #f2f2f2; }
#nc-menu .nc-wheel { position: relative; height: 330px; overflow: hidden; -webkit-mask-image: linear-gradient(transparent, #000 25%, #000 75%, transparent); mask-image: linear-gradient(transparent, #000 25%, #000 75%, transparent); }
#nc-menu .nc-row {
    position: absolute; left: 0; right: 0; top: 50%; height: 80px; margin-top: -40px; display: flex; align-items: center; gap: 14px;
    font-family: "Doto", "Space Mono", monospace; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s, font-size .3s, color .3s; cursor: pointer; transform-origin: left center;
}
#nc-menu .nc-row .nc-name { overflow: hidden; text-overflow: ellipsis; }
#nc-menu .nc-row .nc-sub { font-family: "Space Mono", monospace; font-weight: 400; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #8c8c8c; }
#nc-menu .nc-row .nc-dot { width: 10px; height: 10px; border-radius: 50%; flex: none; background: #4a4a4a; }
#nc-menu .nc-row .nc-dot.on { background: #f2f2f2; } #nc-menu .nc-row .nc-dot.dnd { background: #d71921; } #nc-menu .nc-row .nc-dot.idle { background: #8c8c8c; }
#nc-menu .nc-row.sel::before { content: ""; width: 12px; height: 12px; border-radius: 50%; background: #d71921; flex: none; }
#nc-menu .nc-row .nc-badge { width: 12px; height: 12px; border-radius: 50%; background: #d71921; flex: none; }
#nc-menu .nc-row .nc-badge.num { width: auto; min-width: 12px; height: auto; padding: 2px 8px; border-radius: 999px; font: 700 14px "Space Mono", monospace; color: #fff; }
#nc-menu .nc-empty { position: absolute; inset: 0; display: grid; place-items: center; font-family: "Space Mono", monospace; font-size: 12px; letter-spacing: .1em; color: #4a4a4a; text-transform: uppercase; }
#nc-menu .nc-foot { display: flex; gap: 18px; font-family: "Space Mono", monospace; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: #4a4a4a; }

/* Chat-first layout: no server rail, no channel sidebar, no member list */
[class*="guilds_"], nav[aria-label][class*="wrapper_"] { display: none !important; }
[class*="sidebar_"]:has(> [class*="panels_"]) { width: 0 !important; min-width: 0 !important; border: 0 !important; overflow: visible !important; }
[class*="sidebar_"]:has(> [class*="panels_"]) > *:not([class*="panels_"]) { display: none !important; }
[class*="panels_"] { display: contents !important; }
[class*="panels_"] > div { position: fixed !important; z-index: 100; background: #000 !important; border: 1px solid #2a2a2a !important; border-radius: 999px !important; margin: 0 !important; overflow: hidden; }
/* voice connection: stays bottom-left */
[class*="panels_"] > div { left: 12px; bottom: 80px; width: 280px; border-radius: 16px !important; }
/* user profile (always the last panel): title bar, right after back/forward arrows */
[class*="panels_"] > div:last-child { top: 0 !important; bottom: auto !important; left: 72px !important; height: 30px !important; width: 300px !important; max-width: none; border: 0 !important; background: transparent !important; border-radius: 0 !important; display: flex !important; align-items: center; z-index: 100; }
[class*="panels_"] > div:last-child * { min-height: 0 !important; }
[class*="panels_"] > div:last-child > * { flex: 1; width: 100% !important; height: 28px !important; padding: 0 4px !important; margin: 0 !important; display: flex !important; align-items: center; background: transparent !important; }
[class*="panels_"] > div:last-child { width: auto !important; }
[class*="panels_"] > div:last-child > * { flex: none !important; width: auto !important; }
/* profile is a shortcut (Alt+P): keep the clickable avatar in the DOM but invisible */
[class*="panels_"] > div:last-child [class*="avatarWrapper_"] { position: absolute !important; left: 72px; top: 0; width: 1px !important; height: 1px !important; min-width: 0 !important; padding: 0 !important; opacity: 0; overflow: hidden; pointer-events: none; }
/* now playing widget */
#nc-now { position: fixed; top: 0; left: 290px; height: 30px; z-index: 100; display: none; align-items: center; gap: 10px; max-width: 420px; font-family: "Space Mono", monospace; font-size: 11px; letter-spacing: .06em; color: #f2f2f2; pointer-events: none; }
#nc-now.on { display: flex; }
#nc-now .nc-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-transform: uppercase; }
#nc-now .nc-title i { font-style: normal; color: #8c8c8c; margin-left: 6px; }
#nc-now .nc-eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; flex: none; }
#nc-now .nc-eq b { width: 3px; background: #d71921; border-radius: 1px; height: 4px; animation: nc-eq 0.9s ease-in-out infinite; }
#nc-now .nc-eq b:nth-child(2) { animation-delay: -.2s; animation-duration: .7s; } #nc-now .nc-eq b:nth-child(3) { animation-delay: -.5s; animation-duration: 1.1s; }
#nc-now .nc-eq b:nth-child(4) { animation-delay: -.35s; animation-duration: .8s; } #nc-now .nc-eq b:nth-child(5) { animation-delay: -.1s; animation-duration: 1s; }
@keyframes nc-eq { 0%, 100% { height: 3px; } 50% { height: 14px; } }
#vc-spotify-player { display: none !important; }
[class*="panels_"] > div:last-child img, [class*="panels_"] > div:last-child svg { max-height: 24px; }
/* (Vencord's own spotify player is replaced by #nc-now) */

/* Right-hand panels (members, search, threads, pins, inbox): Nothing look */
[class*="membersWrap_"] { background: #000 !important; border-left: 1px solid #2a2a2a !important; min-width: 240px; }
[class*="membersWrap_"] [class*="members_"] { background: transparent !important; }
[class*="membersGroup_"] { font-family: "Space Mono", monospace !important; font-size: 10px !important; letter-spacing: .14em; text-transform: uppercase; color: #8c8c8c !important; }
[class*="membersGroup_"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #d71921; margin-right: 8px; }
[class*="membersWrap_"] [class*="member_"] { border-radius: 999px !important; margin: 1px 8px !important; }
[class*="membersWrap_"] [class*="member_"]:hover { background: #1a1a1a !important; }
[class*="membersWrap_"] [class*="name_"] { font-family: "Space Grotesk", sans-serif; color: #f2f2f2; }
[class*="searchResultsWrap_"], [class*="threadSidebar_"], [class*="messagesPopoutWrap_"], [class*="popout_"], [class*="recentMentionsPopout_"] { background: #000 !important; border: 1px solid #2a2a2a !important; border-radius: 22px !important; box-shadow: 0 20px 60px rgba(0,0,0,.8) !important; overflow: hidden; }
[class*="searchResultsWrap_"] [class*="header_"], [class*="messagesPopoutWrap_"] [class*="header_"], [class*="popout_"] [class*="header_"] { background: #0e0e0e !important; font-family: "Doto", "Space Mono", monospace !important; font-weight: 800 !important; text-transform: uppercase; letter-spacing: .06em; border-bottom: 1px solid #2a2a2a !important; }
[class*="searchResultsWrap_"] [class*="searchResult_"], [class*="messagesPopoutWrap_"] [class*="container_"] { background: #0e0e0e !important; border: 1px solid #2a2a2a !important; border-radius: 16px !important; }
#vc-spotify-player img, #vc-spotify-player [class*="cover"] { width: 24px !important; height: 24px !important; border-radius: 50% !important; flex: none; }
#vc-spotify-player [class*="progress"], #vc-spotify-player [class*="Progress"] { display: none !important; }
#vc-spotify-player [class*="info"], #vc-spotify-player [class*="Info"] { flex: 1; min-width: 0; font-family: "Space Mono", monospace; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#vc-spotify-player button { background: transparent !important; width: 24px; height: 24px; padding: 0; }

/* Ctrl+K quick switcher: Glyph wheel look */
[class*="quickswitcher_"] { background: #000 !important; border: 1px solid #2a2a2a !important; border-radius: 28px !important; box-shadow: 0 30px 80px rgba(0,0,0,.8) !important; overflow: hidden; }
[class*="quickswitcher_"] [class*="input_"] { background: #0e0e0e !important; border: 1px solid #2a2a2a !important; border-radius: 999px !important; font-family: "Space Mono", monospace !important; color: #f2f2f2 !important; }
[class*="quickswitcher_"] [class*="scroller_"] { mask-image: linear-gradient(transparent, #000 8%, #000 92%, transparent); -webkit-mask-image: linear-gradient(transparent, #000 8%, #000 92%, transparent); }
[class*="quickswitcher_"] [class*="result_"], [class*="quickswitcher_"] [class*="match_"] { background: transparent !important; border-radius: 999px !important; color: #4a4a4a !important; font-family: "Doto", "Space Mono", monospace !important; font-weight: 800 !important; font-size: 20px !important; transition: color .2s; }
[class*="quickswitcher_"] [class*="selected_"] { color: #f2f2f2 !important; font-size: 30px !important; background: #0e0e0e !important; }
[class*="quickswitcher_"] [class*="selected_"]::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: #d71921; margin-right: 12px; flex: none; }
[class*="quickswitcher_"] [class*="note_"], [class*="quickswitcher_"] [class*="protip_"] { font-family: "Space Mono", monospace !important; font-size: 10px !important; letter-spacing: .1em; text-transform: uppercase; color: #4a4a4a !important; }
`;

const lazy = () => (window as any).Vencord?.Webpack;
const C = (): any => lazy()?.Common ?? {};
const fz = (s: string, q: string) => {
    if (!q) return 1;
    const l = s.toLowerCase();
    const at = l.indexOf(q);
    if (at >= 0) return 100 - at;
    let i = 0;
    for (const c of q) {
        i = l.indexOf(c, i);
        if (i < 0) return 0;
        i++;
    }
    return 10;
};

const go = (path: string) => C().NavigationRouter?.transitionTo(path);

function servers(): Entry[] {
    const { GuildStore, GuildChannelStore } = C();
    if (!GuildStore) return [];
    const sorted = lazy()?.findStore?.("SortedGuildStore");
    const ids: string[] = sorted?.getFlattenedGuildIds?.() ?? Object.keys(GuildStore.getGuilds());
    const out: Entry[] = [
        { id: "home", name: "Home", sub: "friends", run: () => go("/channels/@me") }
    ];
    for (const id of ids) {
        const g = GuildStore.getGuild(id);
        if (!g) continue;
        out.push({
            id,
            name: g.name,
            unread: readOf("GuildReadStateStore", id),
            run: () => go(`/channels/${id}`),
            open: () => {
                const chans: any[] = GuildChannelStore.getSelectableChannels(id) ?? [];
                const have = new Set(chans.map(c => (c.channel ?? c).id));
                for (const v of GuildChannelStore.getVocalChannelIds?.(id) ?? []) {
                    const ch = C().ChannelStore?.getChannel(v);
                    if (ch && !have.has(v)) chans.push(ch);
                }
                return chans
                    .map(c => c.channel ?? c)
                    .filter(ch => [0, 2, 5, 13, 15].includes(ch.type))
                    .map<Entry>(ch => {
                        const voice = ch.type === 2 || ch.type === 13;
                        return {
                            id: ch.id,
                            name: (voice ? "~ " : "# ") + ch.name,
                            sub: voice ? `${g.name} · voice` : g.name,
                            unread: readOf("ReadStateStore", ch.id),
                            run: () => {
                                go(`/channels/${id}/${ch.id}`);
                                if (voice) lazy()?.findByProps?.("selectVoiceChannel")?.selectVoiceChannel(ch.id);
                            }
                        };
                    });
            }
        });
    }
    return out;
}

function friends(): Entry[] {
    const { ChannelStore, UserStore, RelationshipStore, PresenceStore } = C();
    if (!ChannelStore || !UserStore) return [];
    const status = (uid?: string): Entry["dot"] => {
        const s = uid && PresenceStore?.getStatus(uid);
        return s === "online" ? "on" : s === "dnd" ? "dnd" : s === "idle" ? "idle" : "off";
    };
    const seen = new Set<string>();
    const out: Entry[] = [];
    for (const ch of ChannelStore.getSortedPrivateChannels?.() ?? []) {
        const isGroup = ch.recipients?.length > 1;
        const u = !isGroup && UserStore.getUser(ch.recipients?.[0]);
        if (u) seen.add(u.id);
        const name = isGroup
            ? ch.name || ch.recipients.map((r: string) => UserStore.getUser(r)?.globalName ?? UserStore.getUser(r)?.username).join(", ")
            : u?.globalName ?? u?.username ?? "unknown";
        out.push({ id: ch.id, name, sub: isGroup ? "group" : u?.username, dot: u ? status(u.id) : undefined, unread: readOf("ReadStateStore", ch.id), run: () => go(`/channels/@me/${ch.id}`) });
    }
    for (const uid of RelationshipStore?.getFriendIDs?.() ?? []) {
        if (seen.has(uid)) continue;
        const u = UserStore.getUser(uid);
        if (!u) continue;
        out.push({
            id: uid,
            name: u.globalName ?? u.username,
            sub: u.username,
            dot: status(uid),
            run: () => lazy()?.findByProps?.("openPrivateChannel")?.openPrivateChannel(uid)
        });
    }
    return out;
}

class Menu {
    root = document.createElement("div");
    panel = document.createElement("div");
    wheel = document.createElement("div");
    input = document.createElement("input");
    title = document.createElement("span");
    count = document.createElement("span");
    kind: "servers" | "friends" | null = null;
    stack: Entry[][] = [];
    items: Entry[] = [];
    view: Entry[] = [];
    sel = 0;

    constructor() {
        this.root.id = "nc-menu";
        this.panel.className = "nc-panel";
        const head = document.createElement("div");
        head.className = "nc-head";
        this.title.className = "nc-title";
        this.count.className = "nc-count";
        head.append(this.title, this.count);
        this.wheel.className = "nc-wheel";
        const foot = document.createElement("div");
        foot.className = "nc-foot";
        foot.textContent = "↑↓ move   ↵ open   ⌫ back   ctrl/alt+d fav   esc close";
        this.input.placeholder = "search";
        this.input.spellcheck = false;
        this.panel.append(head, this.input, this.wheel, foot);
        this.root.append(this.panel);
        this.input.addEventListener("input", () => this.filter());
        document.documentElement.append(this.root);
    }

    get isOpen() {
        return this.root.classList.contains("open");
    }

    show(kind: "servers" | "friends") {
        this.kind = kind;
        this.root.className = (kind === "servers" ? "top" : "bottom") + " open";
        this.title.textContent = kind === "servers" ? "servers" : "friends";
        this.stack = [];
        this.items = kind === "servers" ? servers() : friends();
        this.input.value = "";
        this.sel = 0;
        this.filter();
        setTimeout(() => this.input.focus(), 30);
    }

    hide() {
        this.root.classList.remove("open");
        this.input.blur();
    }

    filter() {
        const q = this.input.value.trim().toLowerCase();
        const fv = favs();
        this.view = this.items
            .map(e => ({ e, s: Math.max(fz(e.name, q), q ? fz(e.sub ?? "", q) / 2 : 0) }))
            .filter(x => x.s > 0)
            .sort((a, b) => (fv.has(b.e.id) ? 1 : 0) - (fv.has(a.e.id) ? 1 : 0) || (q ? b.s - a.s : 0))
            .map(x => x.e);
        this.sel = Math.min(this.sel, Math.max(0, this.view.length - 1));
        this.render(true);
    }

    render(rebuild = false) {
        if (rebuild) {
            this.wheel.textContent = "";
            if (!this.view.length) {
                const e = document.createElement("div");
                e.className = "nc-empty";
                e.textContent = "nothing here";
                this.wheel.append(e);
            }
            this.view.forEach((en, i) => {
                const r = document.createElement("div");
                r.className = "nc-row";
                if (en.dot) {
                    const d = document.createElement("span");
                    d.className = "nc-dot " + en.dot;
                    r.append(d);
                }
                const n = document.createElement("span");
                n.className = "nc-name";
                n.textContent = (favs().has(en.id) ? "★ " : "") + en.name;
                r.append(n);
                const u = en.unread?.();
                if (u && (u.n || u.dot)) {
                    const b = document.createElement("span");
                    b.className = u.n ? "nc-badge num" : "nc-badge";
                    b.textContent = u.n ? String(u.n > 99 ? "99+" : u.n) : "";
                    r.append(b);
                }
                if (en.sub) {
                    const s = document.createElement("span");
                    s.className = "nc-sub";
                    s.textContent = en.sub;
                    r.append(s);
                }
                r.addEventListener("click", () => {
                    this.sel = i;
                    this.choose();
                });
                this.wheel.append(r);
            });
        }
        const rows = Array.from(this.wheel.querySelectorAll<HTMLElement>(".nc-row"));
        rows.forEach((r, i) => {
            const d = i - this.sel;
            const a = Math.abs(d);
            r.classList.toggle("sel", d === 0);
            r.style.transform = `translateY(${d * 62}px)`;
            r.style.fontSize = a === 0 ? "52px" : a === 1 ? "30px" : "20px";
            r.style.opacity = a === 0 ? "1" : a === 1 ? ".45" : a === 2 ? ".18" : "0";
            r.style.color = a === 0 ? "#fff" : "#8c8c8c";
            r.style.pointerEvents = a > 2 ? "none" : "auto";
        });
        const pad = (n: number) => String(n).padStart(2, "0");
        this.count.textContent = this.view.length ? `${pad(this.sel + 1)}/${pad(this.view.length)}` : "00";
    }

    move(d: number) {
        if (!this.view.length) return;
        this.sel = (this.sel + d + this.view.length) % this.view.length;
        this.render();
    }

    choose() {
        const e = this.view[this.sel];
        if (!e) return;
        if (e.open) {
            const kids = e.open();
            if (kids.length) {
                this.stack.push(this.items);
                this.items = kids;
                this.title.textContent = e.name;
                this.input.value = "";
                this.sel = 0;
                this.filter();
                return;
            }
        }
        this.hide();
        e.run();
    }

    back() {
        const prev = this.stack.pop();
        if (!prev) return this.hide();
        this.items = prev;
        this.title.textContent = this.kind === "servers" ? "servers" : "friends";
        this.sel = 0;
        this.filter();
    }

    key(e: KeyboardEvent): boolean {
        if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "s" || e.key === "f")) {
            const kind = e.key === "s" ? "servers" : "friends";
            if (this.isOpen && this.kind === kind) this.hide();
            else this.show(kind);
            return true;
        }
        if (!this.isOpen) return false;
        if ((e.ctrlKey || e.altKey) && !e.metaKey && (e.code === "KeyD" || e.key.toLowerCase() === "d")) {
            const en = this.view[this.sel];
            if (en && en.id !== "home") {
                toggleFav(en.id);
                this.filter();
            }
            return true;
        }
        switch (e.key) {
            case "Escape": this.hide(); return true;
            case "ArrowDown": this.move(1); return true;
            case "ArrowUp": this.move(-1); return true;
            case "Tab": this.move(e.shiftKey ? -1 : 1); return true;
            case "Enter": this.choose(); return true;
            case "Backspace":
                if (!this.input.value) { this.back(); return true; }
                return false;
        }
        return false;
    }
}

function init() {
    setTimeout(() => {
        try {
            const p = (window as any).Vencord?.Settings?.plugins?.SpotifyControls;
            if (p && !p.enabled) p.enabled = true;
        } catch {}
    }, 6000);
    const style = document.createElement("style");
    style.id = "nothingcord-menu-css";
    style.textContent = css;
    (document.head ?? document.documentElement).append(style);
    const now = document.createElement("div");
    now.id = "nc-now";
    now.innerHTML = '<span class="nc-eq"><b></b><b></b><b></b><b></b><b></b></span><span class="nc-title"></span>';
    (document.body ?? document.documentElement).append(now);
    const tick = () => {
        try {
            const { PresenceStore, UserStore } = C();
            const me = UserStore?.getCurrentUser?.();
            const acts: any[] = (me && PresenceStore?.getActivities?.(me.id)) ?? [];
            const a = acts.find(x => x.type === 2);
            const t = now.querySelector(".nc-title")!;
            if (a) {
                t.innerHTML = "";
                t.append(a.details ?? a.name ?? "");
                if (a.state) {
                    const i = document.createElement("i");
                    i.textContent = "— " + a.state;
                    t.append(i);
                }
            }
            now.classList.toggle("on", !!a);
        } catch {}
    };
    setInterval(tick, 3000);
    const menu = new Menu();
    window.addEventListener(
        "keydown",
        e => {
            if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "p") {
                document.querySelector<HTMLElement>('[class*="panels_"] > div:last-child [class*="avatarWrapper_"]')?.click();
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (menu.key(e)) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        },
        true
    );
}

try {
    if (document.documentElement) init();
    else document.addEventListener("DOMContentLoaded", init, { once: true });
} catch (e) {
    console.error("[NothingCord] menu init failed", e);
}
