#!/usr/bin/env python3
import json,pathlib,subprocess,shutil,sys
from datetime import datetime
from zoneinfo import ZoneInfo
root=pathlib.Path('/Users/jw/Desktop/bin/baba-is-you')
number=int(sys.argv[1]);slug=sys.argv[2];title=sys.argv[3];code=sys.argv[4];world=sys.argv[5] if len(sys.argv)>5 else 'The Map'
file=f'media/{number:03d}-{slug}.mp4';poster=f'assets/level-{number:02d}.jpg'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(root/file)]))
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss','2.3','-i',str(root/file),'-frames:v','1',str(root/poster)],check=True)
startfile=pathlib.Path(f'recordings/{number:03d}.mov.start')
recorded=datetime.fromtimestamp(float(startfile.read_text()),ZoneInfo('America/New_York')).date().isoformat() if startfile.exists() else datetime.now(ZoneInfo('America/New_York')).date().isoformat()
entry={'id':f'level-{number:02d}','number':number,'title':title,'file':file,'poster':poster,'seconds':float(probe['format']['duration']),'recorded':recorded,'world':world,'code':code,'name':title}
levels=json.loads((root/'data/levels.json').read_text());previous=next((x for x in levels if x['number']==number),{});entry.update({'notes':previous['notes']} if 'notes' in previous else {});levels=[x for x in levels if x['number']!=number]+[entry];levels.sort(key=lambda x:x['number']);(root/'data/levels.json').write_text(json.dumps(levels,indent=2)+'\n')
manifest=(root/file).with_suffix('.edit.json');shutil.move(manifest,root/f'data/pause-edits-{number:03d}.json')
print(entry)
