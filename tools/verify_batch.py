#!/usr/bin/env python3
"""Audit silent exports, input coverage, and generate a victory contact sheet."""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('first',type=int);p.add_argument('last',type=int);p.add_argument('--repo',type=Path,default=Path('/Users/jw/Desktop/bin/baba-is-you'));a=p.parse_args()
levels=json.loads((a.repo/'data/levels.json').read_text());frames=[];total=0
for n in range(a.first,a.last+1):
 m=json.loads((a.repo/f'data/pause-edits-{n:03}.json').read_text());start=float(Path(f'recordings/{n:03}.mov.start').read_text());spans=m['keptIntervals'];begin=spans[0][0];end=spans[-1][1]
 events=[json.loads(x) for x in Path(f'recordings/{n:03}.jsonl').read_text().splitlines() if x.strip()];events=[e for e in events if e['end']-start>=begin and e['start']-start<=end]
 assert len(events)==m['inputCount'],(n,'input count')
 for e in events:assert any(lo-.04<=max(begin,e['start']-start) and hi+.04>=min(end,e['end']-start) for lo,hi in spans),(n,e)
 level=next(l for l in levels if l['number']==n);video=a.repo/level['file'];probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(video)]));assert [s['codec_type'] for s in probe['streams']]==['video'];assert video.stat().st_size<100*1024*1024
 target=min(end-.2,max(e['end'] for e in events)-start+2);position=sum(max(0,min(hi,target)-lo) for lo,hi in spans if lo<target)
 frame=Path(f'recordings/victory-{n:03}.jpg');subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss',str(position),'-i',str(video),'-frames:v','1','-vf','scale=504:288',str(frame)],check=True);frames.append((level,Image.open(frame).copy()));total+=len(events);print(n,len(events),level['seconds'],video.stat().st_size)
canvas=Image.new('RGB',(1008,((len(frames)+1)//2)*320),'#202127');draw=ImageDraw.Draw(canvas)
for i,(level,img) in enumerate(frames):
 x=(i%2)*504;y=(i//2)*320;draw.text((x+8,y+7),str(level['number'])+' '+level['title'],fill='white');canvas.paste(img,(x,y+30))
output=f'recordings/batch-{a.first:03}-{a.last:03}-victories.jpg';canvas.save(output);print('PASS',total,'inputs;',output)
