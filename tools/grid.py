#!/usr/bin/env python3
"""Analysis-only grid overlay for a CUA game screenshot; never publish this image."""
from PIL import Image,ImageEnhance,ImageDraw
import argparse
p=argparse.ArgumentParser();p.add_argument('input');p.add_argument('output');p.add_argument('--origin',nargs=2,type=int,default=[151,112]);p.add_argument('--size',nargs=2,type=int,default=[24,14]);p.add_argument('--tile',type=int,default=24);a=p.parse_args()
im=ImageEnhance.Brightness(Image.open(a.input)).enhance(3).resize((1708,1016));d=ImageDraw.Draw(im)
for col in range(a.size[0]):
 for row in range(a.size[1]):
  x=(a.origin[0]+col*a.tile)*2;y=(a.origin[1]+row*a.tile)*2;t=a.tile
  d.rectangle((x-t,y-t,x+t,y+t),outline=(110,100,130),width=1)
  d.text((x-t+2,y-t+2),f'{col},{row}',fill='white')
im.save(a.output)
