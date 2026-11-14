# CI 최적화 전후 비교

## 변경 내용

- Node.js 18/20 Matrix 검증을 재사용 가능한 workflow로 분리했습니다.
- 설치·lint·test와 캐시 상태/실행 시간을 하나의 composite action으로 통합했습니다.
- `actions/setup-node`의 npm 캐시를 모든 Node 품질 작업과 build에 적용했습니다.
- Pull Request와 push에서는 변경 파일을 감지하고, 실제 `main` 배포는 dashboard 관련 변경이 있을 때만 실행합니다.
- build는 quality matrix가 모두 성공한 뒤에만 실행됩니다.
- 각 Matrix job은 `ci-timing-node-<version>.txt` artifact로 캐시 전후 크기와 실행 시간을 보존합니다.

## 측정 방법

Composite action이 의존성 설치 전후 npm 캐시 크기와 install/lint/test 전체 시간을 초 단위로 기록합니다. GitHub Actions 실행 요약과 timing artifact를 기준으로 같은 runner 조건에서 비교합니다.

## 비교 기준과 결과

| 항목 | 최적화 전 | 최적화 후 |
| --- | --- | --- |
| 품질 검증 중복 | workflow에 설치/lint/test 단계가 직접 반복됨 | reusable workflow + composite action으로 단일 정의 |
| Node.js Matrix | 18/20을 직접 workflow에 정의 | reusable workflow 입력으로 18/20 실행 |
| 캐시 | setup-node 캐시는 있었지만 측정 보고서 없음 | 캐시 전후 크기와 실행 시간 artifact 제공 |
| 배포 조건 | push 시 build 후 배포 job 생성 | `main` push + dashboard 변경일 때만 배포 |
| 실행 시간 | 이전 성공 실행: 약 25초(Node 18), 23초(Node 20) | 새 실행의 Node별 timing artifact로 측정 |

최종 수치와 artifact 링크는 최적화 workflow 실행 후 이 표의 `최적화 후` 열에 기록합니다. PR 실행에서는 배포하지 않으므로 안전하게 변경 검증만 수행합니다.
