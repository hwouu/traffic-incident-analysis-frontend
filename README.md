# Traffic Incident Analysis System - Frontend

실시간 교통사고 감지 및 분석을 위한 웹 기반 플랫폼의 프론트엔드 레포지토리입니다.

## 🌟 주요 기능

### 1. 실시간 사고 감지
- 웹캠을 통한 실시간 영상 스트리밍
- 영상 녹화 및 서버 전송
- 사고 발생 시 자동 분석 및 보고서 생성

### 2. 사고 신고 챗봇
- 사용자 친화적인 챗봇 인터페이스
- 사고 상황 실시간 보고
- GPT 기반 상황 분석

### 3. 관리자 대시보드
- 사고 분석 결과 실시간 모니터링
- 이전 사고 기록 조회
- 상세 분석 보고서 확인

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: JWT + HTTP-only Cookies
- **API Communication**: Fetch API
- **Media Handling**: WebRTC, MediaRecorder API

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Deployment**: Vercel
- **Code Quality**: ESLint, Prettier

## 📁 프로젝트 구조
```
src/
├── app/                      # Next.js 14 App Router
│   ├── dashboard/           # 대시보드 관련 페이지
│   ├── login/              # 인증 관련 페이지
│   └── register/          # 회원가입 페이지
├── components/             # React 컴포넌트
│   ├── auth/              # 인증 관련 컴포넌트
│   ├── chat/             # 챗봇 관련 컴포넌트
│   ├── dashboard/        # 대시보드 UI 컴포넌트
│   └── ui/              # 공통 UI 컴포넌트
├── lib/                  # 유틸리티 및 API 함수
├── types/               # TypeScript 타입 정의
└── middleware.ts       # Next.js 미들웨어 (인증 등)
```

## 🚀 시작하기

### 환경 설정
1. 레포지토리 클론:
```bash
git clone https://github.com/hwouu/traffic-incident-analysis-frontend.git
cd traffic-incident-analysis-frontend
```

2. 의존성 설치:
```bash
npm install
```

3. 환경 변수 설정:
```bash
# .env.development 파일 생성
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# .env.production 파일 생성
NEXT_PUBLIC_API_BASE_URL=https://www.hwouu.shop

```

4. 개발 서버 실행:
```bash
npm run dev
```

### 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔒 보안 기능
- JWT 기반 인증
- 보안된 쿠키 설정
- 미들웨어를 통한 경로 보호
- CORS 설정
- API 요청 인증

## 🤝 기여하기
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 커밋 메시지 규칙
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩터링
- test: 테스트 코드
- chore: 기타 변경사항

## 📝 라이선스
MIT License

## 👥 팀원
- 노현우 (PM, Frontend)
- 황서진 (Frontend, Design)
- 김강연 (Backend, DevOps)
- 안승환 (Backend, DB)
- 기하영 (Backend, QA)

## 🔗 관련 링크
- [배포 사이트](https://www.kautas.shop)
- [백엔드 레포지토리](https://github.com/hwouu/traffic-incident-analysis-backend)

## ✨ 향후 계획
- [ ] 실시간 알림 시스템 구현
- [ ] 사고 예측 모델 통합
- [ ] 모바일 앱 개발
- [ ] 다국어 지원
