import json
import glob
import os
import re

paths = glob.glob(r'C:\Users\lenovo\.gemini\antigravity-ide\brain\*\.system_generated\logs\transcript.jsonl')
res = []

error_keywords = ['error', 'bug', 'fix', 'problem', 'stuck', 'not working', 'failing', 'crash', 'issue', 'unable', 'wrong']

for p in paths:
    with open(p, 'r', encoding='utf-8') as f:
        for line in f:
            if '"USER_INPUT"' in line:
                try:
                    data = json.loads(line)
                    if data.get('type') == 'USER_INPUT':
                        content = data.get('content', '')
                        
                        # Extract only what is inside <USER_REQUEST>
                        match = re.search(r'<USER_REQUEST>(.*?)</USER_REQUEST>', content, re.DOTALL)
                        if match:
                            clean_text = match.group(1).strip()
                        else:
                            clean_text = content.strip()
                        
                        content_lower = clean_text.lower()
                        # Simple heuristic to avoid very short generic messages
                        if len(content_lower) < 15:
                            continue
                            
                        is_current_session = '01ada368-86b8-45df-8074-a16cc3391f21' in p
                        
                        if any(kw in content_lower for kw in error_keywords) and ('jdca' in content_lower or is_current_session):
                            if clean_text not in res: # Avoid exact duplicates
                                res.append(clean_text)
                except:
                    pass

# Sort to put latest ones at the top (roughly reverse chronological since we read files arbitrarily, actually let's reverse the array)
res.reverse()

with open('jdca_errors_cleaned.md', 'w', encoding='utf-8') as out:
    out.write('# JDCA Application - Reported Errors and Issues\n\n')
    out.write('This document compiles the issues and bugs you reported for the JDCA application based on our chat history.\n\n')
    for idx, content in enumerate(res, 1):
        out.write(f'### Report {idx}\n\n')
        out.write(f'> {content.replace(chr(10), chr(10) + "> ")}\n\n')

print(f"Extracted {len(res)} clean error reports to jdca_errors_cleaned.md")
