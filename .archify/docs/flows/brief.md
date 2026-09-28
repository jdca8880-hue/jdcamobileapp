# FLOWS

## Overview
Grounded flow summary from 219 entrypoint candidate(s) and 1021 detected flow(s).

Target path: `C:\Users\lenovo\Desktop\WEBBDEV\JDCA`
Scan root: `.`

## Confirmed Flows
### Confirmed Flows

Grounded sections derived from the analyzed `.archify` artifacts.

- **Subsystems: 182 detected.**
  Evidence: artifact:.archify/architecture-context.json
- **Services: 182 detected.**
  Evidence: artifact:.archify/services.json
- **Routes: 219 detected.**
  Evidence: artifact:.archify/routes.json
- **Tables: 52 detected.**
  Evidence: artifact:.archify/database.json

## Inferred Flow Notes
### Inferred Flow Notes

Inferred summary: These notes are inferred from grounded artifact relationships and remain labeled as inference.

- Inferred: **Inferred: repository boundaries likely follow the detected subsystem, service, route, and persistence surfaces.**
  Evidence: artifact:.archify/architecture-context.json, artifact:.archify/services.json
- Inferred: **Inferred: when evidence is weak, expand this document conservatively and prefer explicit confirmation over assumptions.**
  Evidence: artifact:.archify/docs-summary.json, artifact:.archify/facts.json

## Open Questions / Uncertainty
### Open Questions

- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-16-0-src-components` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_set:src/lib/api.js:316:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_sort:src/lib/api.js:696:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_sort:src/lib/api.js:697:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_touppercase:src/lib/api.js:339:0
- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-176-0-src-components` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_map:src/lib/api.js:1032:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_map:src/lib/api.js:1042:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_map:src/lib/api.js:316:0, edge:file_src_lib_api_js:calls:ref_src_components_selection_selectiondata_js_call_map:src/lib/api.js:525:0
- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-178-0-src-engine` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_src_engine_validationschemas_js_call_date:src/lib/api.js:170:0, edge:file_src_lib_api_js:calls:ref_src_engine_validationschemas_js_call_date:src/lib/api.js:180:0, edge:file_src_lib_api_js:calls:ref_src_engine_validationschemas_js_call_date:src/lib/api.js:190:0, edge:file_src_lib_api_js:calls:ref_src_engine_validationschemas_js_call_date:src/lib/api.js:232:0
- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-23-0-src-engine` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_src_engine_cricketstatemachine_js_call_number:src/lib/api.js:742:0, edge:file_src_lib_api_js:calls:ref_src_engine_cricketstatemachine_js_call_number:src/lib/api.js:773:0, edge:file_src_lib_api_js:calls:ref_src_engine_cricketstatemachine_js_call_number:src/lib/api.js:783:0, edge:file_src_lib_api_js:calls:ref_src_engine_cricketstatemachine_js_call_number:src/lib/api.js:798:0
- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-27-0-apply-bug5-sql-js` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_apply_bug5_sql_js_call_console_error:src/lib/api.js:1104:0, edge:file_src_lib_api_js:calls:ref_apply_bug5_sql_js_call_console_error:src/lib/api.js:487:0, edge:file_src_lib_api_js:calls:ref_apply_bug5_sql_js_call_console_error:src/lib/api.js:586:0, edge:file_src_lib_api_js:calls:ref_apply_bug5_sql_js_call_console_error:src/lib/api.js:898:0
- Inferred: **Does `subsystem-0-0-src-lib` really depend on `subsystem-82-0-delete-season-js` through `calls`?**
  Evidence: edge:file_src_lib_api_js:calls:ref_delete_season_js_call_delete:src/lib/api.js:1059:0, edge:file_src_lib_api_js:calls:ref_delete_season_js_call_delete:src/lib/api.js:153:0, edge:file_src_lib_api_js:calls:ref_delete_season_js_call_delete:src/lib/api.js:24:0, edge:file_src_lib_api_js:calls:ref_delete_season_js_call_delete:src/lib/api.js:254:0
- Inferred: **Does `subsystem-1-0-src-context` really depend on `subsystem-102-0-src-components` through `calls`?**
  Evidence: edge:file_src_context_cricketcontext_jsx:calls:ref_src_components_notificationprompt_jsx_call_localstorage_getitem:src/context/CricketContext.jsx:67:0, edge:file_src_context_cricketcontext_jsx:calls:ref_src_components_notificationprompt_jsx_call_localstorage_getitem:src/context/CricketContext.jsx:793:0, edge:file_src_context_cricketcontext_jsx:calls:ref_src_components_notificationprompt_jsx_call_localstorage_getitem:src/context/CricketContext.jsx:89:0, edge:file_src_context_cricketcontext_jsx:calls:ref_src_components_notificationprompt_jsx_call_localstorage_setitem:src/context/CricketContext.jsx:76:0
- Inferred: **Does `subsystem-1-0-src-context` really depend on `subsystem-105-0-src-components` through `calls`?**
  Evidence: edge:symbol_src_context_cricketcontext_jsx_function_registerplayer:calls:ref_src_components_screens_playerprofilescreen_jsx_call_setplayers:src/context/CricketContext.jsx:1393:0, edge:symbol_src_context_cricketcontext_jsx_function_registerplayer:calls:ref_src_components_screens_playerprofilescreen_jsx_call_setplayers:temp_extraction/src/context/CricketContext.jsx:524:0
