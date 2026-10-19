"""Local UI fixture. Does not install an extension or access university accounts."""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import json
import re
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_GET(self):
        route=self.path.split('?')[0]
        if route not in ['/preview-popup','/preview-moodle','/preview-public']:return super().do_GET()
        if route=='/preview-popup':
            html=(ROOT/'popup/popup.html').read_text(encoding='utf-8').replace('href="popup.css"','href="/popup/popup.css"').replace('src="popup.js"','src="/popup/popup.js"').replace('../src/','/src/')
            html=html.replace('<script src="/src/settings.js">','<script src="/tests/browser-mock.js"></script><script src="/src/settings.js">')
        elif route=='/preview-public':
            m=json.loads((ROOT/'manifest.json').read_text(encoding='utf-8'))
            html=(ROOT.parent/'espoch-public.html').read_text(encoding='utf-8')
            html=re.sub(r'<script\b[^>]*>.*?</script\s*>','',html,flags=re.I|re.S)
            html=re.sub(r'<base\b[^>]*>','',html,flags=re.I)
            css=''.join(f'<link rel="stylesheet" href="http://127.0.0.1:8766/{p}">' for p in m['content_scripts'][0]['css'])
            html=html.replace('<head>','<head><base href="https://elearning.espoch.edu.ec/">').replace('</head>',css+'</head>')
            scripts=''.join(f'<script src="http://127.0.0.1:8766/{p}"></script>' for p in ['tests/browser-mock.js','src/settings.js','src/content.js'])
            html=html.replace('</body>',scripts+'</body>')
        else:
            m=json.loads((ROOT/'manifest.json').read_text(encoding='utf-8'))
            css=''.join(f'<link rel="stylesheet" href="/{p}">' for p in m['content_scripts'][0]['css'])
            html=(ROOT/'tests/moodle-fixture.html').read_text(encoding='utf-8').replace('</head>',css+'</head>')
            html=html.replace('</body>','<script src="/tests/browser-mock.js"></script><script src="/src/settings.js"></script><script src="/src/content.js"></script></body>')
        body=html.encode('utf-8');self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
if __name__=='__main__':
    print('Preview: http://127.0.0.1:8766/preview-popup and /preview-moodle',flush=True)
    ThreadingHTTPServer(('127.0.0.1',8766),Handler).serve_forever()
