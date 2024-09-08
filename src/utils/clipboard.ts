export function textToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('主方案 copy to clipboard successfully');
      }).catch(err => {
        console.error('主方案 Failed to copy!!: ', err);
        // 回退到 document.execCommand('copy')
        fallbackCopyToClipboard(text);
      });
    } else {
        // 回退到 document.execCommand('copy')
        fallbackCopyToClipboard(text);
    }
  
    function fallbackCopyToClipboard(text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      // textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('备用方案 copy to clipboard ' + msg);
      } catch (err) {
        console.error('备用方案: Failed to copy', err);
      }
      document.body.removeChild(textArea);
    }
  }
  