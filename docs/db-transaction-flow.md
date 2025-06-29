```plantuml
@startuml
!theme sketchy
!option handwritten true

start
:Begin DB transaction;
:Call Auth0 API (create/update/suspend/...);
if (Auth0 success?) then (yes)
  :Apply DB change;
  if (DB success?) then (yes)
    :Commit DB transaction;
    :Return success to API client;
  else (no)
    :Rollback DB transaction;
    :[Optional] Compensate in Auth0 (if partial);
    :Return DB error to API client;
  endif
else (no)
  :Rollback DB transaction;
  :Return Auth0 error to API client;
endif
stop
@enduml
```