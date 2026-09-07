#!/usr/bin/env python3
"""Join retained attempts and rebase every input for the normal idle-only editor.
Usage: join_attempts.py recordings/NNN.mov recordings/name-part1.mov ...
Each input MOV needs its .start and corresponding .jsonl sidecar.
Originals are never modified; an existing output is refused.
"""
import argparse,hashlib,json,pathlib,subprocess,tempfile
p=argparse.ArgumentParser();p.add_argument('output',type=pathlib.Path);p.add_argument('parts',nargs='+',type=pathlib.Path);a=p.parse_args()
for f in (a.output,a.output.with_suffix('.jsonl'),pathlib.Path(str(a.output)+'.start')):
 if f.exists():raise SystemExit('Refusing existing output: '+str(f))
def probe(f):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(f)]))
base=float(pathlib.Path(str(a.parts[0])+'.start').read_text()); elapsed=0; events=[]; manifest=[]; lines=['ffconcat version 1.0']
for part in a.parts:
 info=probe(part); streams=info['streams'];assert len(streams)==1 and streams[0]['codec_type']=='video'
 duration=float(info['format']['duration']); start=float(pathlib.Path(str(part)+'.start').read_text())
 original=[json.loads(l) for l in part.with_suffix('.jsonl').read_text().splitlines() if l.strip()]
 for event in original:
  assert -.2 <= event['start']-start <= duration+.2,(part,event)
  events.append({**event,'start':base+elapsed+event['start']-start,'end':base+elapsed+event['end']-start})
 manifest.append({'source':part.name,'sha256':hashlib.file_digest(part.open('rb'),'sha256').hexdigest(),'sourceSeconds':duration,'joinedStart':elapsed,'inputCount':len(original)})
 path=str(part.resolve()).replace("'", "'\\''")
 lines.extend(["file '"+path+"'",'duration '+str(duration)]);elapsed+=duration
with tempfile.NamedTemporaryFile(mode='w',suffix='.ffconcat') as listing:
 listing.write('\n'.join(lines)+'\n');listing.flush()
 subprocess.run(['ffmpeg','-n','-hide_banner','-loglevel','error','-safe','0','-f','concat','-i',listing.name,'-map','0:v:0','-an','-c:v','copy',str(a.output)],check=True)
actual=float(probe(a.output)['format']['duration']);assert abs(actual-elapsed)<.2,(actual,elapsed)
pathlib.Path(str(a.output)+'.start').write_text(str(base)+'\n')
a.output.with_suffix('.jsonl').write_text(''.join(json.dumps(e)+'\n' for e in events))
a.output.with_suffix('.parts.json').write_text(json.dumps({'parts':manifest,'inputCount':len(events),'duration':actual},indent=2)+'\n')
print(json.dumps({'parts':len(a.parts),'inputCount':len(events),'seconds':actual}))
