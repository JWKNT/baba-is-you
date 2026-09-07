#!/usr/bin/env python3
"""Route one pushable object on a manually observed board; avoid moving all others.
No game files or rule engine are consulted. Only valid while supplied properties hold.
"""
import json,sys,collections,pathlib
s=json.load(open(sys.argv[1]));assert len(s['players'])==1
w,h=s['size'];start_player=tuple(s['players'][0]);obj=tuple(map(int,sys.argv[2:4]));target=tuple(map(int,sys.argv[4:6]));walls=set(map(tuple,s['blocked']));hazards=set(map(tuple,s.get('hazards',[])));words=set(map(tuple,s['words']));assert obj in words
forbidden=set(map(tuple,s.get('objectForbidden',[])))
others=words-{obj};dirs={'U':(0,-1),'D':(0,1),'L':(-1,0),'R':(1,0)}
def add(p,d):return p[0]+d[0],p[1]+d[1]
def blocked(p):return p in walls or p in others or not(0<=p[0]<w and 0<=p[1]<h)
start=(start_player,obj);seen={start:None};prev={};q=collections.deque([start]);goal=None
while q:
 st=q.popleft();p,b=st
 if b==target:goal=st;break
 for key,d in dirs.items():
  np=add(p,d);nb=b
  if np==b:
   nb=add(b,d)
   if blocked(nb) or nb in forbidden:continue
  elif blocked(np):continue
  if np in hazards:continue
  ns=(np,nb)
  if ns not in seen:seen[ns]=st;prev[ns]=key;q.append(ns)
if goal is None:raise SystemExit('No route; explored '+str(len(seen)))
path=[];st=goal
while seen[st] is not None:path.append(prev[st]);st=seen[st]
moves=''.join(reversed(path));proposal=dict(s,players=[goal[0]],words=sorted(others|{target}));pathlib.Path(sys.argv[1]+'.proposed').write_text(json.dumps(proposal))
print(json.dumps({'moves':moves,'players':[goal[0]],'object':target,'states':len(seen)}))
