# 시작하기

## 프로젝트 소개

이 프로젝트는 가상의 주식 매수·매도 주문을 가격·시간 우선순위로 처리하고, 처리 결과와 소프트웨어 delivery 지표를 확인하는 학습용 저장소입니다.

- **대시보드:** [Pulseboard](https://watertowel21.github.io/oss_based_programming/)
- **칸반 보드:** [OSS Delivery Sprint Board](https://github.com/users/watertowel21/projects/1)
- **협업 가이드:** [CONTRIBUTING.md](../../CONTRIBUTING.md)

## 로컬 실행

```bash
cd react-practice
npm install
npm start
```

브라우저에서 `http://localhost:3000`을 열고 `owner/name` 형식의 공개 GitHub 저장소를 입력합니다.

## 선택적 GitHub 토큰

공개 API의 요청 제한을 피하려면 읽기 전용 fine-grained token을 환경 변수로 설정합니다.

```powershell
$env:REACT_APP_GITHUB_TOKEN="github_pat_..."
$env:REACT_APP_GITHUB_REPOSITORY="owner/name"
npm start
```

토큰은 커밋하지 않으며, 운영용 비밀키를 브라우저 번들에 넣지 않습니다.

## 관련 문서

- [개발 가이드](Development-Guide.md)
- [문제 해결](Troubleshooting.md)
