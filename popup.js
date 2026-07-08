const select = document.getElementById('fontSize');

chrome.storage.sync.get({ titleFontSize: 14 }, ({ titleFontSize }) => {
  select.value = titleFontSize;
});

select.addEventListener('change', async () => {
  const size = Number(select.value);
  await chrome.storage.sync.set({ titleFontSize: size });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: 'SET_TITLE_FONT_SIZE', size }, () => {
      void chrome.runtime.lastError; // ignore: not a Docs tab
    });
  }
});
