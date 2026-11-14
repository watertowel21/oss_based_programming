# 기여 가이드

이 저장소는 작은 Feature 브랜치와 짧은 Pull Request를 중심으로 협업합니다. 모든 변경은 `main`에 직접 푸시하지 않고 PR을 통해 반영합니다.

## 브랜치 전략

`main`은 항상 배포 가능한 상태로 유지합니다. 작업 종류에 따라 다음 접두사를 사용합니다.

| 유형 | 형식 | 예시 |
| --- | --- | --- |
| 기능 | `feature/<짧은-설명>` | `feature/workflow-summary` |
| 버그 수정 | `fix/<짧은-설명>` | `fix/rate-limit-message` |
| 문서 | `docs/<짧은-설명>` | `docs/contributing-guide` |
| 유지보수 | `chore/<짧은-설명>` | `chore/update-actions` |

브랜치는 하나의 목적만 포함하고, 관련 이슈를 PR 본문에 `Closes #이슈번호` 형식으로 연결합니다.

## Conventional Commits

커밋 메시지는 다음 형식을 사용합니다.

```text
<type>(<scope>): <imperative summary>
```

허용되는 `type`은 `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`입니다.

예시:

```text
feat(metrics): add deployment frequency card
fix(api): explain GitHub rate-limit errors
docs(contributing): define pull request review rules
```

제목은 72자 이내로 작성하고, 한 커밋에는 하나의 논리적 변경만 담습니다.

## Pull Request 작성

1. PR 템플릿의 모든 항목을 작성합니다.
2. 관련 이슈를 연결합니다.
3. 테스트와 빌드 결과를 기록합니다.
4. 최소 3명의 리뷰어에게 검토를 요청합니다.
5. 모든 `MUST` 항목을 해결하고, `SHOULD` 항목은 반영하거나 사유를 답변합니다.
6. 승인과 CI 통과 후에만 병합합니다.

### 리뷰 피드백 태그

- `[MUST]`: 병합 전에 반드시 수정하거나 명시적으로 합의해야 하는 문제
- `[SHOULD]`: 품질과 유지보수성을 위해 권장하는 개선

리뷰어는 한 PR에서 최소 한 개의 구체적인 피드백을 남기고, 작성자는 각 피드백에 답변합니다. 단순한 LGTM만 남기지 않습니다.

## 로컬 검증

대시보드 변경 시 다음 명령을 실행합니다.

```bash
cd react-practice
npm test -- --watchAll=false --runInBand
npm run build
```

## 협업 문서

- [PR 템플릿](.github/pull_request_template.md)
- [CODEOWNERS](.github/CODEOWNERS)
- [GitHub Project 칸반 보드](https://github.com/users/watertowel21/projects/1)
