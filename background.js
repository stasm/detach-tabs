browser.contextMenus.create({
    id: "detach-tabs-to-the-right",
    title: browser.i18n.getMessage("detach-to-the-right"),
    contexts: ["tab"],
    onclick: detach_tabs_to_the_right
});

browser.contextMenus.create({
    id: "detach-tabs-same-origin",
    title: browser.i18n.getMessage("detach-same-origin"),
    contexts: ["tab"],
    onclick: detach_tabs_same_origin
});

async function detach_tabs_to_the_right(_, tab) {
    const current_tabs = await browser.tabs.query({ currentWindow: true });
    const ids_to_move = current_tabs
        .sort((a, b) => a.index - b.index)
        .slice(tab.index + 1)
        .map(tab => tab.id);

    const window = await browser.windows.create({ tabId: tab.id });
    await browser.tabs.move(ids_to_move, { windowId: window.id, index: 1 });
}

async function detach_tabs_same_origin(_, tab) {
    const url = new URL(tab.url);
    const tab_origin = `${url.origin}/*`;

    const current_tabs = await browser.tabs.query({ currentWindow: true, url: tab_origin });
    const ids_to_move = current_tabs
        .sort((a, b) => a.index - b.index)
        .map(tab => tab.id);

    const window = await browser.windows.create({ tabId: tab.id });
    await browser.tabs.move(ids_to_move, { windowId: window.id, index: 1 });
}
