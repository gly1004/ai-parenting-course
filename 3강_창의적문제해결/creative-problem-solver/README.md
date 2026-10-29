# 불편함에서 기회 찾기 - 창의적 문제 해결 훈련

## Vercel 배포 방법

### 1. 사전 준비
- GitHub 계정
- Vercel 계정 (https://vercel.com - GitHub로 가입 가능)
- Anthropic API 키 (https://console.anthropic.com)

### 2. GitHub에 업로드
1. GitHub에서 새 저장소(repository) 생성
2. 이 폴더의 파일들을 업로드

### 3. Vercel에 배포
1. https://vercel.com 접속 후 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. **Environment Variables 설정** (중요!)
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-...` (본인의 API 키)
5. "Deploy" 클릭

### 4. 배포 완료
- 배포 완료 후 `https://프로젝트명.vercel.app` 주소로 접속 가능
- API 키는 서버에만 저장되어 안전합니다

## 파일 구조
```
creative-problem-solver/
├── index.html          # 프론트엔드 페이지
├── api/
│   └── generate.js     # API 엔드포인트 (Claude 호출)
├── package.json        # 의존성 설정
├── vercel.json         # Vercel 설정
└── README.md           # 이 파일
```

## 로컬 테스트 (선택사항)
```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (.env 파일 생성)
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env

# 3. 로컬 서버 실행
npx vercel dev
```
