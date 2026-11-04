"""Navigation crawl for the weboldal-kapu: every link of every sitemap page with its area (menu / footer / content),
button styling, external hosts, the first-section (hero) buttons and the header menu structure.
Usage: python3 nav-crawl.py [--base https://www.beeco.hu] [--out nav-nyers.json]"""
import argparse, json, re, ssl, sys, urllib.request, concurrent.futures as cf
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

ap = argparse.ArgumentParser(); ap.add_argument('--base', default='https://www.beeco.hu'); ap.add_argument('--out', default='nav-nyers.json')
ARGS = ap.parse_args()
BASE = ARGS.base.rstrip('/')
CTX = ssl._create_unverified_context()
EXTRA = ['/', '/rolunk', '/tortenetunk', '/csapatunk', '/hatasunk', '/csatlakozz', '/kapcsolat', '/feliratkozas', '/impresszum', '/gyik', '/letoltes']
BTN = re.compile(r'(^|[\s_-])(gomb|button|btn|cta|w-button|footer_download)([\s_-]|$)|ds-gomb|fs-gomb|bc-btn', re.I)
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


def fetch(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 beeco-navi'}), timeout=40, context=CTX)
        return r.status, r.geturl(), r.read().decode('utf8', 'ignore')
    except Exception as e:
        return getattr(e, 'code', 0), u, ''


class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []; self.links = []; self.title = ''; self._t = False; self.h1 = ''; self._h = False
        self.section = -1; self.menu = []; self._a = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get('class') or ''
        area = None
        if tag in ('nav', 'header') or re.search(r'\b(w-nav|menu-)', cls): area = 'menu'
        if tag == 'footer' or re.search(r'\b(lablec|footer)\b', cls): area = 'lablec'
        hidden = 'inert' in a or a.get('aria-hidden') == 'true'
        if tag == 'section' and not any(s[0] == 'section' for s in self.stack) and not any(s[1] for s in self.stack): self.section += 1
        if 'menu-csoport' in cls: self.menu.append({'group': '', 'items': []})
        if 'menu-gomb' in cls and 'w-dropdown-toggle' in cls and self.menu: self.menu[-1]['_t'] = True
        if tag not in VOID: self.stack.append((tag, area, hidden, cls))
        if tag == 'a' and a.get('href'):
            areas = [s[1] for s in self.stack if s[1]]
            self._a = {'href': a['href'], 'area': areas[-1] if areas else 'tartalom', 'hidden': any(s[2] for s in self.stack) or hidden, 'cls': cls[:60],
                       'btn': bool(BTN.search(cls)), 'sec': self.section, 'text': (a.get('aria-label') or '').strip(), 'blank': a.get('target') == '_blank'}
            self.links.append(self._a)
            if 'menu-csempe' in cls and self.menu: self.menu[-1]['items'].append(a['href'])
        if tag == 'title': self._t = True
        if tag == 'h1': self._h = True

    def handle_endtag(self, tag):
        if tag == 'a' and self._a is not None: self._a['_full'] = True; self._a = None
        if tag == 'title': self._t = False
        if tag == 'h1': self._h = False
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag: del self.stack[i:]; break

    def handle_data(self, d):
        if self._a is not None and not self._a.get('_full'):
            self._a['text'] = (self._a['text'] + ' ' + d.strip()).strip()[:80] if d.strip() else self._a['text']
        if self.menu and self.menu[-1].get('_t') and d.strip(): self.menu[-1]['group'] = d.strip(); self.menu[-1]['_t'] = False
        if self._t: self.title += d
        if self._h and len(self.h1) < 120: self.h1 += d


def norm(href, page):
    if href.startswith(('mailto:', 'tel:', 'javascript:')): return None
    u = urlparse(urljoin(page, href))
    if not re.search(r'(^|\.)beeco\.hu$', u.hostname or ''): return None
    p = re.sub(r'/+$', '', u.path) or '/'
    return p


def crawl(path):
    st, final, html = fetch(BASE + path)
    if st != 200: return path, {'status': st}
    p = Links(); p.feed(html)
    out, anchors = {}, []
    for l in p.links:
        if l['hidden']: continue
        t = norm(l['href'], BASE + path)
        ext = None
        if t is None:
            h = urlparse(urljoin(BASE + path, l['href']))
            if h.scheme in ('http', 'https') and h.hostname: ext = h.hostname.replace('www.', '')
        anchors.append({'to': t, 'ext': ext, 'area': l['area'], 'btn': l['btn'], 'sec': l['sec'], 'text': l['text'][:60], 'blank': l['blank'],
                        'self': t == path, 'hash': '#' in l['href']})
        if not t or t == path: continue
        k = (t, l['area']); out[k] = out.get(k, 0) + 1
    menu = [{'group': m['group'], 'items': len(m['items'])} for m in p.menu] if path == '/' else None
    return path, {'status': st, 'final': re.sub(r'/+$', '', urlparse(final).path) or '/', 'title': re.sub(r'\s+', ' ', p.title).strip(), 'h1': re.sub(r'\s+', ' ', p.h1).strip(),
                  'links': [{'to': t, 'area': a, 'n': n} for (t, a), n in out.items()], 'anchors': anchors, 'menu': menu}


_, _, sm = fetch(BASE + '/sitemap.xml')
paths = sorted(set([re.sub(r'/+$', '', urlparse(u).path) or '/' for u in re.findall(r'<loc>([^<]+)</loc>', sm)] + EXTRA))
res = {}
with cf.ThreadPoolExecutor(8) as ex:
    for path, r in ex.map(crawl, paths): res[path] = r
json.dump({'base': BASE, 'sitemap': len(paths), 'pages': res}, open(ARGS.out, 'w'), ensure_ascii=False)
print('oldalak', len(res), 'hibás', sum(1 for r in res.values() if r['status'] != 200))
