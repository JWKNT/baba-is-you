#!/usr/bin/env python3
"""Shortest no-push route for simultaneous YOU objects on an observed grid.
No game files are read. JSON specifies size, blocked cells, players and targets.
All target cells must be occupied. Players may merge, unless distinct=true.
"""
import json,sys,collections
s=json.load(open(sys.argv[1])); w,h=s['size']; blocked={tuple(p) for p in s['blocked']}; targets={tuple(p) for p in s['targets']}
words={tuple(p) for p in s.get('words',[])}
hazards={tuple(p) for p in s.get('hazards',[])}
start=tuple(sorted(set(map(tuple,s['players'])))); q=collections.deque([start]); seen={start:None}; prev={}
for_state=None
while q:
 st=q.popleft()
 if targets.issubset(st): for_state=st;break
 for key,(dx,dy) in [('U',(0,-1)),('D',(0,1)),('L',(-1,0)),('R',(1,0))]:
  nxt=[]; pushes=False
  for x,y in st:
   p=(x+dx,y+dy)
   if p in words:
    end=p
    while end in words:end=(end[0]+dx,end[1]+dy)
    if 0<=end[0]<w and 0<=end[1]<h and end not in blocked:pushes=True;break
    nxt.append((x,y))
   else:nxt.append((x,y) if not(0<=p[0]<w and 0<=p[1]<h) or p in blocked else p)
  if pushes or any(p in hazards for p in nxt):continue
  ns=tuple(sorted(set(nxt)))
  if s.get('distinct',True) and len(ns)!=len(st):continue
  if ns not in seen:seen[ns]=st;prev[ns]=key;q.append(ns)
if for_state is None:raise SystemExit('No route; explored '+str(len(seen)))
path=[]; st=for_state
while seen[st] is not None:path.append(prev[st]);st=seen[st]
print(json.dumps({'moves':''.join(reversed(path)), 'players':for_state,'states':len(seen)}))
