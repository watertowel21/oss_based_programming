# 개발 가이드

## 브랜치와 커밋

`main`에는 직접 푸시하지 않고 PR로 변경을 반영합니다.

- 기능: `feature/<짧은-설명>`
- 버그 수정: `fix/<짧은-설명>`
- 문서: `docs/<짧은-설명>`
- 유지보수: `chore/<짧은-설명>`

커밋은 Conventional Commits 형식을 사용합니다.

```text
<type>(<scope>): <imperative summary>
```

허용되는 타입은 `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`입니다.

## Pull Request

1. 관련 이슈를 PR 본문에 `Closes #이슈번호`로 연결합니다.
2. 변경 유형과 검증 결과를 PR 템플릿에 작성합니다.
3. 테스트와 빌드를 실행합니다.
4. 리뷰 피드백은 `[MUST]` 또는 `[SHOULD]` 태그로 구조화합니다.
5. CI 통과와 리뷰 완료 후 병합합니다.

## 검증 명령

```bash
cd react-practice
npm test -- --watchAll=false --runInBand
npm run build
```

## API 구조

대시보드는 브라우저에서 GitHub REST API를 호출합니다.

- `/repos/{owner}/{repo}`
- `/repos/{owner}/{repo}/pulls`
- `/repos/{owner}/{repo}/issues`
- `/repos/{owner}/{repo}/commits`
- `/repos/{owner}/{repo}/deployments`

최근 30일 데이터를 기준으로 lead time, issue cycle time, deployment frequency와 활동량을 계산합니다.

## 관련 문서

- [시작하기](Getting-Started.md)
- [문제 해결](Troubleshooting.md)
