let titleFontSize = 14; // px; overridden by stored setting

function enhanceTitles() {
  const titles = document.querySelectorAll('.docs-homescreen-grid-item-title');

  titles.forEach(title => {
    title.style.fontSize = `${titleFontSize}px`;
    if (title.dataset.enhanced === 'true') return;

    // Allow up to 2 lines with ellipsis
    // Apply consistent 2-line space for all titles
    title.style.display = '-webkit-box';
    title.style.webkitBoxOrient = 'vertical';
    title.style.webkitLineClamp = '2';
    title.style.overflow = 'hidden';
    title.style.textOverflow = 'ellipsis';
    title.style.whiteSpace = 'normal';
    title.style.lineHeight = '1.4em';
    title.style.height = '2.8em'; // exactly 2 lines
    // Use a 2-line clamp with ellipsis and reserve a small gutter for the overflow menu
    title.style.display = '-webkit-box';
    title.style.webkitBoxOrient = 'vertical';
    title.style.webkitLineClamp = '2';
    title.style.overflow = 'hidden';
    title.style.textOverflow = 'ellipsis';
    title.style.whiteSpace = 'normal';
    title.style.lineHeight = '1.4em';
    title.style.height = '2.8em'; // 2 lines
    title.style.width = '100%';
    title.style.paddingRight = '12px';
    title.style.boxSizing = 'border-box';
    title.style.marginBottom = '0.1em';
    title.style.marginBottom = '0.1em';

    const card = title.closest('.docs-homescreen-grid-item, .docs-homescreen-grid-item-content, .docs-homescreen-grid-item-inner, .docs-homescreen-grid-item-title-container');
    if (card) {
      card.style.position = 'relative';
      // Do NOT change card padding or width — keep layout stable.
    }

    moveOverflowMenu(title);

    // Tooltip for overflow
    title.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.textContent = title.textContent;
      tooltip.id = 'custom-doc-title-tooltip';

      Object.assign(tooltip.style, {
        position: 'fixed',
        background: '#333',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '14px',
        maxWidth: '400px',
        whiteSpace: 'normal',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 9999
      });

      document.body.appendChild(tooltip);
      const rect = title.getBoundingClientRect();
      tooltip.style.top = `${rect.bottom + 6}px`;
      tooltip.style.left = `${rect.left}px`;
    });

    title.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('custom-doc-title-tooltip');
      if (tooltip) tooltip.remove();
    });

    title.dataset.enhanced = 'true';
  });
}

function moveOverflowMenu(title) {
  const card = title.closest('.docs-homescreen-grid-item, .docs-homescreen-grid-item-content, .docs-homescreen-grid-item-inner, .docs-homescreen-grid-item-title-container');
  if (!card) return;

  // prefer anchoring to the metadata row so we don't affect the overall card width
  const metadataRow = card.querySelector('.docs-homescreen-grid-metadata-row');
  const menu = card.querySelector('[aria-label*="More actions"], [aria-label*="More"], button[aria-label*="More"], div[aria-label*="More"], .docs-homescreen-grid-item-menu, .grid-menu, .docs-homescreen-item-overflow');
  if (!menu || menu.dataset.menuAdjusted === 'true') return;

  if (metadataRow) metadataRow.style.position = 'relative';

  // position the menu inside the metadata row (so it lines up with the date line)
  menu.style.position = 'absolute';
  // place the overflow icon closer in and nudge it lower so it sits below the title
  menu.style.right = '12px';
  menu.style.top = '72.5%';
  menu.style.transform = 'translateY(-50%)';
  menu.style.margin = '0';
  menu.style.zIndex = '2';
  menu.dataset.menuAdjusted = 'true';
}

// Re-run on mutations
const observer = new MutationObserver(() => enhanceTitles());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
window.addEventListener('load', () => setTimeout(enhanceTitles, 1000));

// Title font size — restore the stored value, and update live from the popup.
chrome.storage.sync.get({ titleFontSize: 14 }, (stored) => {
  titleFontSize = stored.titleFontSize;
  enhanceTitles();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SET_TITLE_FONT_SIZE') {
    titleFontSize = message.size;
    document.querySelectorAll('.docs-homescreen-grid-item-title')
      .forEach(title => title.style.fontSize = `${titleFontSize}px`);
  }
});
