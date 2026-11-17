;(function () {
  function ensureSidebar() {
    const ctn = document.getElementById('page-ctn')
    if (!ctn) return null
    let aside = document.getElementById('toc-sidebar')
    if (!aside) {
      aside = document.createElement('aside')
      aside.id = 'toc-sidebar'
      const nav = document.createElement('nav')
      nav.id = 'toc'
      nav.setAttribute('aria-label', 'Table of contents')
      aside.appendChild(nav)
      const md = ctn.querySelector('.markdown-body')
      if (md) {
        ctn.insertBefore(aside, md)
      } else {
        ctn.appendChild(aside)
      }
    }
    return aside
  }

  function slugify(s) {
    return encodeURI(String(s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\- ]+/g, '')
      .replace(/\s+/g, '-'))
  }

  function buildTOC() {
    const aside = ensureSidebar()
    if (!aside) return
    const nav = aside.querySelector('#toc')
    const md = document.querySelector('.markdown-body')
    if (!nav || !md) return
    const hs = Array.from(md.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const ul = document.createElement('ul')
    hs.forEach((el) => {
      const isHeading = /^H[1-6]$/.test(el.tagName)
      const level = isHeading ? Number(el.tagName.substring(1)) : 2
      if (!el.id) el.id = slugify(el.textContent || '')
      const li = document.createElement('li')
      li.className = 'toc-l' + level
      const a = document.createElement('a')
      a.href = '#' + el.id
      a.textContent = (el.innerText || el.textContent || '').trim().slice(0, 120)
      li.appendChild(a)
      ul.appendChild(li)
    })
    nav.innerHTML = ''
    nav.appendChild(ul)
  }

  function init() {
    function start() {
      const md = document.querySelector('.markdown-body')
      if (!md) return false
      buildTOC()
      const obs = new MutationObserver(() => buildTOC())
      obs.observe(md, { childList: true, subtree: true })
      return true
    }
    if (!start()) {
      const wait = new MutationObserver(() => {
        if (start()) wait.disconnect()
      })
      wait.observe(document.body, { childList: true, subtree: true })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
