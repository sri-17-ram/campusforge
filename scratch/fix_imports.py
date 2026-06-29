import os

app_dir = r"d:\work\campousforge\app"

for root, _, files in os.walk(app_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if '<Image' in content and "import Image from 'next/image'" not in content and 'import Image from "next/image"' not in content:
                # Add to the top, right after 'use client' if it exists, or just at top
                if content.startswith("'use client'"):
                    content = content.replace("'use client'", "'use client'\nimport Image from 'next/image'")
                elif content.startswith('"use client"'):
                    content = content.replace('"use client"', '"use client"\nimport Image from "next/image"')
                else:
                    content = "import Image from 'next/image';\n" + content
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed import in {filepath}")

print("Fix completed.")
