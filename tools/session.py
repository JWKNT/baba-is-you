#!/usr/bin/env python3
import pathlib,subprocess,sys,time,os,signal,json
root=pathlib.Path(__file__).resolve().parent.parent
os.chdir(root)
state=root/'recordings/active.json'
if sys.argv[1]=='start':
 n=f'{int(sys.argv[2]):03d}'
 path=root/f'recordings/{n}.mov'
 if path.exists(): raise SystemExit('Recording exists: '+str(path))
 log=open(str(path)+'.log','w')
 proc=subprocess.Popen([str(root/'tools/record'),str(path)],stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
 state.write_text(json.dumps({'number':n,'pid':proc.pid,'path':str(path)}))
 for _ in range(30):
  if pathlib.Path(str(path)+'.start').exists(): print('Recording',n,'pid',proc.pid); break
  if proc.poll() is not None: raise SystemExit(pathlib.Path(str(path)+'.log').read_text())
  time.sleep(.1)
else:
 active=json.loads(state.read_text());os.kill(active['pid'],signal.SIGINT)
 for _ in range(100):
  log=pathlib.Path(active['path']+'.log').read_text()
  if 'FINISHED' in log: print(log);break
  time.sleep(.1)
 else: raise SystemExit('Capture has not finalized')
 state.unlink()
