# Firebase Nuxt SSR template #
Default template for Nuxt JS and firebase integration.
This template allow you to easy local development without woryng about install dependencies, testing, building and deploying. It`s all automated by Docker & Jenkins.

### <b>Requirements</b> ###
<b>docker</b>, <b>docker-compose</b> installed.
 
<a href="https://docs.docker.com/get-docker/">Docker instalation guide</a>

### <b>Setup guide</b>

### <b>Commands</b>
#### See help

    bin/run.sh -h|--help
#### Start development
    
    bin/run.sh
#### Stop project
    
    bin/stop.sh
#### Clear docker instances
    
    bin/clear.sh
### <b>Links to services</b>

Before visit link bellow <b>start</b> in dev mode or <b>build</b> for production mode.

- <a href="http://localhost:3000">Frontend app ( only for development )</a>
- <a href="http://localhost:5000">Cloud Hosting ( local production build )</a>
- <a href="http://localhost:4000">Firebase Emulator UI</a>

### <b>Template Stack</b>
List of technologies used in project
- #### <b>Containerization</b>
    - Docker
    - Docker-compose
- #### <b>Databases</b>
    - Firebase Firestore
    - Firebase Realtime DB

- #### Hosting ####
    - Cloud Hosting as CDN
    - Cloud Functions for SSR and API

- #### <b>Frontend</b> | <a href="https://gitlab.com/reverse.studio/docker-firebase-nuxt-template/-/blob/master/services/frontend/README.md">More</a> #### 
    
    - Nuxt JS - Frontend framework

- #### API Docs #### 
    - Swagger - API Docs generator
    - Postman - API Client
- #### CI/CD #### 
    - Jenkins
    - Husky
    - Jest - unit & integration testing
    - Selenium
    - Hermione
    - Newman - for API testing
- #### Metrics, Logs and Trace #### 
    - ELK
    - Jaeger
    - Prometheus
    - Grafna

- #### Analytics #### 
    - Yandex Metrika
    - Google Analytics


Stylelint, настроить браузеры, посмотреть как работает futoprefixed
ESlint config
Тестирование коллекций по ссылке, необходимо взять коллекцию, привязанную.

Привязать открытый репозиторий для тестирования с newman, он получает доступ к коллекции

Тестирование API:

Получить доступ к коллекции,

chai.js

facker

Интеграция Jenkins и Postman

Импорт/ Экспорт аккаунтов https://firebase.google.com/docs/cli/auth