```plantuml
@startuml
!theme sketchy
!option handwritten true

skinparam classFontColor #ffcc00
skinparam classFontSize 10
skinparam classFontName Courier
skinparam sequenceMessageAlign center
skinparam sequenceParticipantFontColor #ffcc00
skinparam sequenceActorFontColor #1e1e1e
skinparam databaseFontColor #1e1e1e

actor Admin as A
participant "SPA" as SPA
participant "Backend (API)" as BE
participant "RBAC Guard" as RBAC
database "Database" as DB
participant "Auth0 Service" as Auth0S
participant "Auth0" as Auth0

A -> SPA : <font color=#1e1e1e>Open /users/new</font>
SPA -> BE : <font color=#1e1e1e>POST /users {name, email, dept, roleId}</font>
BE -> RBAC : <font color=#1e1e1e>Check admin/super-user role</font>
RBAC -> BE : <font color=#1e1e1e>Allowed</font>
BE -> Auth0S : <font color=#1e1e1e>Create user in Auth0</font>
Auth0S -> Auth0 : <font color=#1e1e1e>POST /api/v2/users</font>
Auth0 --> Auth0S : <font color=#1e1e1e>201 Created (auth0UserId)</font>
Auth0S -> BE : <font color=#1e1e1e>auth0UserId</font>
BE -> DB : <font color=#1e1e1e>Save user (auth0UserId, roleId, etc.)</font>
BE -> Auth0S : <font color=#1e1e1e>Trigger password reset email</font>
Auth0S -> Auth0 : <font color=#1e1e1e>POST /api/v2/tickets/password-change</font>
Auth0 --> Auth0S : <font color=#1e1e1e>Success</font>
BE -> SPA : <font color=#1e1e1e>201 Created (new user)</font>
@enduml
```