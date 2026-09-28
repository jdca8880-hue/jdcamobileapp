import re
import sys

def check_missing_policies():
    schema = open('c:/Users/lenovo/Desktop/WEBBDEV/JDCA/supabase_schema.sql', 'r', encoding='utf-8').read()
    fix_rls = open('c:/Users/lenovo/Desktop/WEBBDEV/JDCA/fix_rls.sql', 'r', encoding='utf-8').read()
    missing_rls = open('c:/Users/lenovo/Desktop/WEBBDEV/JDCA/07_missing_rls_policies.sql', 'r', encoding='utf-8').read()

    # find all tables with RLS enabled
    pattern = re.compile(r'alter table (\w+) enable row level security', re.IGNORECASE)
    rls_tables = set(pattern.findall(schema))

    # find tables with policies
    policy_pattern = re.compile(r'policy.*on (\w+)', re.IGNORECASE)
    tables_with_policies = set(policy_pattern.findall(schema + fix_rls + missing_rls))

    missing_tables = rls_tables - tables_with_policies

    print(f"Tables with RLS enabled: {len(rls_tables)}")
    print(f"Tables with policies: {len(tables_with_policies)}")
    print("Tables missing policies:")
    for t in sorted(missing_tables):
        print(f" - {t}")

if __name__ == '__main__':
    check_missing_policies()
