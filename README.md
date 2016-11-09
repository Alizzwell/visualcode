# Visual Code

### npm proxy setting
```bash
$ npm config -g set proxy http://[proxy-host]:[proxy-port]
$ npm config -g set https-proxy http://[proxy-host]:[proxy-port]
$ npm config -g set strict-ssl false
```

### jspm 설치
```bash
$ npm install -g jspm
```
### gulp 설치
```bash
$ npm install -g gulp
```

### jspm proxy 설정
- C:\Users\[username]\AppData\Local\.jspm\config 파일에 "strictSSL": false 속성 추가

### 의존성 모듈 설치
```bash
$ npm install
$ # jspm 설치 시 프록시 서버 설정
$ set HTTP_PROXY=http://[proxy-host]:[proxy-port]
$ set HTTPS_PROXY=http://[proxy-host]:[proxy-port]
$ jspm install
```

### server 의존성 설치
```bash
$ cd server
$ npm install
$ cd ..
```

### 개발환경 실행
```bash
$ gulp
```

### 빌드 하기
```bash
$ gulp build
```

### production 환경 실행
```bash
$ cd server
$ npm run serve
```
