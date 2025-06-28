``` plantuml
@startuml loginFlow
!theme sketchy
!option handwritten true

skinparam classFontColor #ffcc00
skinparam classFontSize 10
skinparam classFontName Courier
skinparam sequenceMessageAlign center
skinparam sequenceParticipantFontColor #ffcc00
skinparam sequenceActorFontColor #1e1e1e
skinparam databaseFontColor #1e1e1e

actor User
participant "Berry-Proof SPA (Vue + Auth0 SDK)" as SPA
participant "Auth0 (Universal Login)" as Auth0
participant "Berry-Proof API (NestJS)" as API
database "Berry-Proof DB (PostgreSQL)" as DB

User -> SPA : <font color=#1e1e1e>Open /login</font>
SPA -> Auth0 : <font color=#1e1e1e>Redirect to login</font>
Auth0 -> User : <font color=#1e1e1e>Auth form (email/password)</font>
User -> Auth0 : <font color=#1e1e1e>Submit credentials</font>
Auth0 -> SPA : <font color=#1e1e1e>Redirect with Auth0 Access Token</font>

SPA -> API : <font color=#1e1e1e>POST /auth/login</font>\n<font color=#1e1e1e>Authorization: Bearer <auth0_token> </font>
API -> Auth0 : <font color=#1e1e1e>Validate token via JWKS</font>
Auth0 -> API : <font color=#1e1e1e>Valid / Invalid response</font>
API -> DB : <font color=#1e1e1e>Find or Create user by sub (auth0)</font>
DB --> API : <font color=#1e1e1e>User entity</font>
API -> SPA : <font color=#1e1e1e>Return Berry JWT (access_token)</font>

== <font color=#ffcc00>Later Session Access</font> ==

SPA -> API : <font color=#1e1e1e>GET /auth/me</font>\n<font color=#1e1e1e>Authorization: Bearer <berry_jwt></font>
API -> API : <font color=#1e1e1e>Verify JWT (issuer, exp, etc)</font>
API -> DB : <font color=#1e1e1e>Get user by userId</font>
DB --> API : <font color=#1e1e1e>User data</font>
API -> SPA : <font color=#1e1e1e>Return user profile</font>
@enduml
```
