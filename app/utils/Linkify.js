const linkifyContent = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1e40af; font-weight: 600;">${url}</a>`;
  });
};

export default linkifyContent;
