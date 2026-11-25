import re
from PIL import Image, ImageDraw, ImageChops
from svgpathtools import parse_path

S = 1024
SS = 4
svg = open("scripts/discord.svg", encoding="utf-8").read()
d_attr = re.search(r'\bd="([^"]+)"', svg).group(1)
path = parse_path(d_attr)

# Logo area: 24x24 viewbox scaled/centered into the icon
scale = 40
ox = (S - 24 * scale) / 2
oy = (S - 24 * scale) / 2 + 14

mask = Image.new("L", (S, S), 0)
for sub in path.continuous_subpaths():
    pts = [sub.point(i / 400) for i in range(401)]
    poly = [(p.real * scale + ox, p.imag * scale + oy) for p in pts]
    layer = Image.new("L", (S, S), 0)
    ImageDraw.Draw(layer).polygon(poly, fill=255)
    mask = ImageChops.logical_xor(mask.convert("1"), layer.convert("1")).convert("L")

img = Image.new("RGBA", (S * SS, S * SS), (0, 0, 0, 0))
g = ImageDraw.Draw(img)
step = 28
r = 11
for y in range(step // 2, S, step):
    for x in range(step // 2, S, step):
        if mask.getpixel((x, y)) > 128:
            g.ellipse(((x - r) * SS, (y - r) * SS, (x + r) * SS, (y + r) * SS), fill=(255, 255, 255, 255))

g.ellipse((860 * SS, 70 * SS, 940 * SS, 150 * SS), fill=(215, 25, 33, 255))

import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else "build"
out = img.resize((S, S), Image.LANCZOS)
out.save(f"{OUT}/icon.png")
out.save(f"{OUT}/icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
