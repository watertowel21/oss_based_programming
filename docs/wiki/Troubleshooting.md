# 문제 해결

## 대시보드가 로딩되지 않음

1. `http://localhost:3000`을 새로고침합니다.
2. 저장소 이름이 `owner/name` 형식인지 확인합니다.
3. 브라우저 개발자 도구에서 GitHub API 오류를 확인합니다.
4. 공개 API 제한에 도달했다면 읽기 전용 `REACT_APP_GITHUB_TOKEN`을 설정합니다.

## GitHub API 403 오류

GitHub 공개 API 요청 제한에 도달했을 가능성이 있습니다. 토큰을 설정한 뒤 개발 서버를 다시 시작합니다.

```powershell
$env:REACT_APP_GITHUB_TOKEN="github_pat_..."
npm start
```

토큰 값은 로그, 스크린샷, 커밋에 포함하지 않습니다.

## 데이터가 비어 있음

- 최근 30일 내 병합된 PR이나 종료된 이슈가 없으면 lead time 또는 cycle time이 `—`로 표시될 수 있습니다.
- GitHub Deployments를 사용하지 않으면 deployment frequency가 `0.00/day`로 표시됩니다.
- 대시보드는 각 API 리소스의 최신 100개 항목을 사용합니다.

## 테스트 또는 빌드 실패

의존성을 다시 설치하고 명령을 재실행합니다.

```bash
cd react-practice
npm install
npm test -- --watchAll=false --runInBand
npm run build
```

## 추가 도움

재현 방법, 저장소 이름, 오류 메시지, 실행한 명령을 포함해 [Bug 이슈 템플릿](../../.github/ISSUE_TEMPLATE/bug_report.md)으로 이슈를 작성합니다.

## 관련 문서

- [시작하기](Getting-Started.md)
- [개발 가이드](Development-Guide.md)
