"""Reproducible packages using Python's standard library; no source minification."""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT/'manifest.json').read_text(encoding='utf-8'))
assets = [ROOT/'themes.json']
for folder in ['src','css','popup','icons']:
    assets.extend(p for p in (ROOT/folder).rglob('*') if p.is_file())
artifacts = ROOT/'artifacts'
artifacts.mkdir(exist_ok=True)
checksums = []
for browser in ['firefox','chromium']:
    target = ROOT/'dist'/browser
    if target.is_symlink() or (ROOT/'dist').is_symlink() or not target.resolve().is_relative_to(ROOT.resolve()/'dist'):
        raise RuntimeError('Build directory must remain inside this project/dist')
    target.mkdir(parents=True,exist_ok=True)
    # Only this tool's generated tree is replaced; never traverse arbitrary paths.
    for old in sorted(target.rglob('*'),reverse=True):
        if old.is_symlink():
            raise RuntimeError(f'Unexpected symbolic link: {old}')
        if old.is_file(): old.unlink()
        elif old.is_dir(): old.rmdir()
    data = json.loads(json.dumps(manifest))
    if browser == 'chromium':
        data.pop('browser_specific_settings',None)
        data['minimum_chrome_version'] = '120'
    (target/'manifest.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    for asset in assets:
        relative = asset.relative_to(ROOT)
        (target/relative).parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(asset,target/relative)
    name = f"espoch-themes-{manifest['version']}-{browser}-unsigned.zip"
    package = artifacts/name
    with zipfile.ZipFile(package,'w',zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(target.rglob('*')):
            if path.is_file():
                info = zipfile.ZipInfo(path.relative_to(target).as_posix(),date_time=(2026,1,1,0,0,0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                archive.writestr(info,path.read_bytes())
    checksums.append(hashlib.sha256(package.read_bytes()).hexdigest()+'  '+name)
    print(package)
(artifacts/'SHA256SUMS.txt').write_text('\n'.join(checksums)+'\n',encoding='utf-8')
