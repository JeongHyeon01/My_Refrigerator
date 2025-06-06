<h1 align="center">🍳 My_Refrigerator</h1>
<p align="center">냉장고의 식재료로 레시피를 추천받는 웹 서비스</p>

---

## 📌 프로젝트 소개

이 프로젝트는 사용자가 보유한 재료와 태그를 기반으로,  
사용자에게 어울리는 레시피를 추천해주는 웹 애플리케이션입니다.  
프론트엔드는 React, 백엔드는 Node.js/Express를 기반으로 제작되었습니다.  

재료 유사도 정렬, 레시피 API 연동, 사용자 편의성을 고려한 UI 등을 포함합니다.

---

## 👥 팀원 소개

| 이름 | 역할 |
|------|------|
| 이정현 | 팀장 / 백엔드 개발 (Node.js/Express, API) |
| 제연우 | 팀원 / 백엔드 개발 (MongoDB 구축, API) |
| 박동진 | 팀원 / 프론트 개발 (React) |

## ⚠️ Firebase 서비스 계정 키 관리 안내

- `BE/User_Recipe/src/main/resources/firebase-service-account.json` 파일은 **절대 깃허브에 올리지 마세요!**
- 이 파일은 각자 [Firebase 콘솔](https://console.firebase.google.com/)에서 서비스 계정 키를 발급받아 직접 넣어야 합니다.
- 예시 파일(`firebase-service-account.example.json`)을 참고해 본인 키로 파일을 만들어 주세요.

### 서비스 계정 키 발급 및 적용 방법
1. [Firebase 콘솔](https://console.firebase.google.com/)에서 본인 프로젝트 생성
2. 프로젝트 설정 > 서비스 계정 > 새 비공개 키 발급 → 다운로드
3. `BE/User_Recipe/src/main/resources/firebase-service-account.json` 파일로 저장
4. (이 파일은 절대 깃허브에 올리지 마세요!)

---

## 프로젝트 실행 방법 (예시)

### 프론트엔드(React)
```bash
cd FE
npm install
npm start
```

### 백엔드(Spring Boot)
```bash
cd BE/User_Recipe
./gradlew bootRun
```

### FastAPI (크롤링 서버)
```bash
cd BE/User_Recipe/crawling_py
pip install -r requirements.txt
uvicorn main:app --reload
```

---

자세한 환경 변수 및 실행 방법은 각 디렉토리의 README를 참고하세요.
