function enhanceTitles() {
  const titles = document.querySelectorAll('.docs-homescreen-grid-item-title');

  titles.forEach(title => {
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

// Re-run on mutations
const observer = new MutationObserver(() => enhanceTitles());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
window.addEventListener('load', () => setTimeout(enhanceTitles, 1000));
