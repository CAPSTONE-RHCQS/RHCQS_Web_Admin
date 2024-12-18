// src/utils/htmlUtils.ts
export const addClassesToHtml = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
  
    const uls = div.getElementsByTagName('ul');
    for (let ul of uls) {
      ul.classList.add('list-disc', 'pl-5');
    }
  
    const ols = div.getElementsByTagName('ol');
    for (let ol of ols) {
      ol.classList.add('list-decimal', 'pl-5');
    }
  
    const lis = div.getElementsByTagName('li');
    for (let li of lis) {
      li.classList.add('mb-2');
    }
  
    return div.innerHTML;
  };