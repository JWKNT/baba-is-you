#!/usr/bin/env python3
"""Plan no-push simultaneous-YOU travel, then a specified push on an observed grid.
This only models supplied walls, lethal cells and text, never reads game internals.
The caller must verify active rules and the resulting screen before accepting state.
"""
import json,sys,collections,pathlib
s=json.load(open(sys.argv[1])); w,h=s['size']; walls=set(map(tuple,s['blocked'])); hazards=set(map(tuple,s.get('hazards',[]))); words=set(map(tuple,s['words'])); target=tuple(map(int,sys.argv[2:4])); finish=sys.argv[4]
dirs={'U':(0,-1),'D':(0,1),'L':(-1,0),'R':(1,0)}
def add(p,d):return p[0]+d[0],p[1]+d[1]
def solid(p):return p in walls or not(0<=p[0]<w and 0<=p[1]<h)
def travel(st,key):
 d=dirs[key];out=[]
 for p in st:
  dest=add(p,d)
  if dest in words:
   end=dest
   while end in words:end=add(end,d)
   if not solid(end):return
   dest=p
  elif solid(dest):dest=p
  if dest in hazards:return
  out.append(dest)
 return tuple(out) if len(set(out))==len(out) else None
def final(st):
 if target not in st:return
 active=st.index(target);ps=list(st);ws=set(words)
 for key in finish:
  d=dirs[key];out=[]
  for i,p in enumerate(ps):
   dest=add(p,d)
   if solid(dest):dest=p
   elif dest in ws:
    chain=[];end=dest
    while end in ws:chain.append(end);end=add(end,d)
    if solid(end):dest=p
    elif i!=active:return
    else:
     ws.difference_update(chain);ws.update(add(q,d) for q in chain)
   if dest in hazards:return
   out.append(dest)
  if len(set(out))!=len(out):return
  ps=out
 if s.get('goalOther') and any(p not in set(map(tuple,s['goalOther'])) for i,p in enumerate(ps) if i!=active):return
 return ps,ws
start=tuple(map(tuple,s['players']));q=collections.deque([start]);seen={start:None};prev={};goal=None
while q:
 st=q.popleft();done=final(st)
 if done:goal=st;break
 for key in dirs:
  ns=travel(st,key)
  if ns is not None and ns not in seen:seen[ns]=st;prev[ns]=key;q.append(ns)
if goal is None:raise SystemExit('No safe route; explored '+str(len(seen)))
path=[];st=goal
while seen[st] is not None:path.append(prev[st]);st=seen[st]
route=''.join(reversed(path));ps,ws=done
proposal=dict(s,players=ps,words=sorted(ws));pathlib.Path(sys.argv[1]+'.proposed').write_text(json.dumps(proposal))
print(json.dumps({'route':route,'finish':finish,'moves':route+finish,'beforeFinish':goal,'players':ps,'states':len(seen)}))
