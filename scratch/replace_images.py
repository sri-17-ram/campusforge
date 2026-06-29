import os
import re

app_dir = r"d:\work\campousforge\app"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<img ' not in content:
        return
        
    print(f"Processing {filepath}")
    
    # 1. Add import Image from 'next/image' if not present
    if "import Image from 'next/image'" not in content:
        # Find the first import
        content = re.sub(r"^(import .+?;?(\r?\n))", r"\1import Image from 'next/image';\n", content, count=1)
        
    # 2. Replace <img ...> with <Image ... width={500} height={500} />
    # Using width/height is safer than fill because fill requires relative parent.
    # To keep the original aspect ratio styling, we can use width={500} height={500} and rely on Tailwind object-cover
    
    def img_replacer(match):
        img_tag = match.group(0)
        # We just replace <img with <Image and add width/height
        # Since these are generic profile/banner images, w-500 h-500 is a safe placeholder size 
        # (Next.js will optimize down, CSS will constrain display size)
        if 'width=' not in img_tag and 'fill' not in img_tag:
            return img_tag.replace('<img', '<Image width={500} height={500}')
        return img_tag.replace('<img', '<Image')
        
    new_content = re.sub(r'<img [^>]*>', img_replacer, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for root, _, files in os.walk(app_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

print("Image replacements completed.")
