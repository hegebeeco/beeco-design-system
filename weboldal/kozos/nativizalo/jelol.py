# Az eredeti HTML-ben minden kezdőcímkét megjelöl (data-nk), és az fs <style> blokkokat (data-fs).
import re,sys
h=open('eredeti.html').read()
out=[];i=0;n=0
pat=re.compile(r'<(script|style)\b[^>]*>.*?</\1>|<([a-zA-Z][\w-]*)(?=[\s>/])',re.S|re.I)
for m in pat.finditer(h):
    out.append(h[i:m.start()])
    if m.group(1):
        blk=m.group(0)
        if m.group(1).lower()=='style' and '.fs-' in blk and len(blk)>3000:
            blk=blk.replace('<style','<style data-fs="1"',1)
        out.append(blk)
    else:
        out.append(m.group(0)+f' data-nk="{n}"');n+=1
    i=m.end()
out.append(h[i:])
open('jelolt.html','w').write(''.join(out));print('elemek',n)
