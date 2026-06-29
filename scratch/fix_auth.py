import os
import re

app_dir = r"d:\work\campousforge\app\api"

for root, _, files in os.walk(app_dir):
    for file in files:
        if file == 'route.ts':
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'authHeader' in content:
                # Add getServerSession import if missing
                if 'getServerSession' not in content:
                    content = content.replace('import { verifyToken } from "@/lib/auth";', 'import { verifyToken, getServerSession } from "@/lib/auth";')
                    content = content.replace("import { verifyToken } from '@/lib/auth';", "import { verifyToken, getServerSession } from '@/lib/auth';")
                
                # Replace the block
                pattern = r'const authHeader = req\.headers\.get\([\'"]authorization[\'"]\);\s*if \(!authHeader\) return [^;]+;\s*const token = authHeader\.replace\([\'"]Bearer [\'"], [\'"][\'"]\);\s*const decoded = verifyToken\(token\);'
                content = re.sub(pattern, 'const decoded = getServerSession(req);', content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Fixed authHeader in {filepath}")

print("Fix completed.")
