#!/usr/bin/env python3
"""Preserve all game inputs; shorten only long gaps between them.
Input JSONL events contain wall-clock `start`, `end`, and `key`.
The recorder writes the first-frame epoch to SOURCE.mov.start.
"""
import argparse, json, pathlib, subprocess, hashlib
p=argparse.ArgumentParser()
p.add_argument('source', type=pathlib.Path)
p.add_argument('events', type=pathlib.Path)
p.add_argument('output', type=pathlib.Path)
p.add_argument('--crop', default='1680:960:14:56')
p.add_argument('--gap', type=float, default=8)
p.add_argument('--begin', type=float, default=0, help='source-relative start of level')
p.add_argument('--end', type=float, help='source-relative end after victory animation')
p.add_argument('--tail', type=float, default=10, help='seconds retained after final input, including victory animations')
a=p.parse_args()
def probe(f):
 return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(f)]))
start=float(pathlib.Path(str(a.source)+'.start').read_text())
duration=float(probe(a.source)['format']['duration'])
end=min(a.end or duration,duration)
events=[json.loads(l) for l in a.events.read_text().splitlines() if l.strip()]
events=[e for e in events if e['end']-start>=a.begin and e['start']-start<=end]
if not a.end and events: end=min(end,max(e['end'] for e in events)-start+a.tail)
spans=[[a.begin,min(a.begin+2,end)]]
for event in events:
 lo=max(a.begin,event['start']-start-0.75); hi=min(end,event['end']-start+1.5)
 if lo<hi: spans.append([lo,hi])
spans.append([max(a.begin,min(end,max(e['end'] for e in events)-start) if events else end-4),end])
spans.sort(); merged=[]
for lo,hi in spans:
 if merged and lo-merged[-1][1]<a.gap: merged[-1][1]=max(hi,merged[-1][1])
 else: merged.append([lo,hi])
filters=[]
for i,(lo,hi) in enumerate(merged):
 filters.append(f'[0:v]trim=start={lo:.6f}:end={hi:.6f},setpts=PTS-STARTPTS[v{i}]')
filters.append(''.join(f'[v{i}]' for i in range(len(merged)))+f'concat=n={len(merged)}:v=1:a=0,crop={a.crop},fps=30,format=yuv420p[out]')
a.output.parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(a.source),'-filter_complex',';'.join(filters),'-map','[out]','-an','-c:v','libx264','-preset','fast','-crf','20','-movflags','+faststart',str(a.output)],check=True)
info=probe(a.output)
assert len(info['streams'])==1 and info['streams'][0]['codec_type']=='video'
assert a.output.stat().st_size<100*1024**2
manifest={'source':a.source.name,'sha256':hashlib.file_digest(a.source.open('rb'),'sha256').hexdigest(),'sourceSeconds':duration,'keptIntervals':merged,'outputSeconds':float(info['format']['duration']),'inputCount':len(events),'policy':'Keep every input and retry. Remove only idle gaps >=8 seconds between padded action spans. No audio.','crop':a.crop}
a.output.with_suffix('.edit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
