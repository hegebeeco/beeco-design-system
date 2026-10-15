# CsicsergŐsz: minden kezdőcímke data-nk; a body-beli w-embed <style> blokkok data-fs (az oldal saját CSS-e).
import re
h=open('eredeti.html').read()
out=[];i=0;n=0;body=h.find('<body')
pat=re.compile(r'<(script|style)\b[^>]*>.*?</\1>|<([a-zA-Z][\w-]*)(?=[\s>/])',re.S|re.I)
for m in pat.finditer(h):
    out.append(h[i:m.start()])
    if m.group(1):
        blk=m.group(0)
        if m.group(1).lower()=='style' and m.start()>body and h[max(0,m.start()-40):m.start()].rstrip().endswith('class="w-embed">'):
            blk=blk.replace('<style','<style data-fs="1"',1)
        out.append(blk)
    else:
        out.append(m.group(0)+f' data-nk="{n}"');n+=1
    i=m.end()
out.append(h[i:])
s=''.join(out);open('jelolt.html','w').write(s);print('elemek',n,'fs-blokk',s.count('data-fs="1"'))
