import os, base64
from PIL import Image, ImageDraw
import numpy as np

src_path = r'C:\Users\PC\.gemini\antigravity\brain\0a1ce0db-ef3c-46fc-ba89-dc20a666ae7d\.user_uploaded\media_1795514530114_bdc4dae0.png'
dest_dir = r'C:\Users\PC\.gemini\antigravity\scratch\sabhyam-portfolio'

im = Image.open(src_path).convert('RGBA')

# 1. Save full logo.png (1024x1024)
im.save(os.path.join(dest_dir, 'assets', 'logo.png'), 'PNG')
print('Saved assets/logo.png')

# 2. Transparent background version: Key out the pure blue (#0c3eff)
arr = np.array(im, dtype=np.float32)
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
bg_mask = (b > 180) & (r < 60) & (g < 100)
trans_arr = arr.copy()
trans_arr[bg_mask, 3] = 0
im_trans = Image.fromarray(np.clip(trans_arr, 0, 255).astype(np.uint8))
im_trans.save(os.path.join(dest_dir, 'assets', 'logo-transparent.png'), 'PNG')
print('Saved assets/logo-transparent.png')

# 3. Squircle badge version (for top-left brand card & icons)
size = (256, 256)
im_badge = im.resize(size, Image.Resampling.LANCZOS)
mask = Image.new('L', size, 0)
draw = ImageDraw.Draw(mask)
radius = 52
draw.rounded_rectangle([(0, 0), size], radius=radius, fill=255)
im_badge.putalpha(mask)
im_badge.save(os.path.join(dest_dir, 'assets', 'logo-badge.png'), 'PNG')
print('Saved assets/logo-badge.png')

# 4. Favicon PNG (64x64 and 32x32)
fav = im_badge.resize((64, 64), Image.Resampling.LANCZOS)
fav.save(os.path.join(dest_dir, 'favicon.png'), 'PNG')
print('Saved favicon.png')

# 5. Favicon SVG embedding base64 PNG
with open(os.path.join(dest_dir, 'favicon.png'), 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <image href="data:image/png;base64,{b64}" width="64" height="64"/>
</svg>'''
with open(os.path.join(dest_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('Saved favicon.svg')
