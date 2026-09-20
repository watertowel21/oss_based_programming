# 과제 3: 개선 계획 수립

> 기준일: 2026-09-20  
> 분석 대상: `watertowel21/oss_based_programming`  
> 데이터 출처: [Pulseboard 대시보드](https://watertowel21.github.io/oss_based_programming/)와 GitHub REST API 최근 30일 데이터

## 1. 현재 프로젝트 메트릭 측정

현재 대시보드는 저장소 메타데이터, Pull Request, Issue, Commit, Deployment를 GitHub REST API로 수집합니다. 기준일에 확인한 핵심 지표는 다음과 같습니다.

| 지표 | 현재값 | 해석 |
| --- | ---: | --- |
| Lead time for changes | **약 3.1시간** | 최근 병합 PR 3개의 생성부터 병합까지 평균 시간 |
| 병합 Pull Request | **3건** | 최근 30일 |
| Deployment frequency | **0.07회/일** | 최근 30일 배포 2회 기준 |
| Open issues | **2건** | 현재 미해결 이슈 |
| Issue cycle time | **측정 대기** | 최근 30일 내 종료된 이슈가 없어 기준선이 아직 없음 |

### 데이터 해석 시 주의점

- PR과 배포 표본이 작기 때문에 현재값은 팀의 장기 성과라기보다 초기 기준선이다.
- 대시보드는 각 GitHub API 리소스에서 최신 100개 항목을 사용한다.
- Issue cycle time은 종료 이슈가 쌓인 뒤부터 의미 있는 추세를 볼 수 있다.
- 배포 빈도는 GitHub Deployments API에 기록된 배포만 포함하므로, 모든 운영 배포가 GitHub Deployment로 기록되도록 해야 한다.

## 2. 병목 지점 분석

### 병목 1: 배포 흐름이 수동 또는 불규칙하다

최근 30일 배포가 2회뿐이고, 배포 자동화가 최근에 추가되었다. 코드가 완성되어도 배포 이벤트가 일정하게 기록되지 않으면 배포 빈도와 변경 리드타임을 팀 의사결정에 활용하기 어렵다.

**원인 가설**

- `main` 병합 후 자동 배포를 기본 경로로 고정하지 않음
- 배포 성공/실패 상태가 GitHub Deployments에 일관되게 남지 않음
- 작은 변경을 자주 배포하는 대신 여러 변경을 모아 배포함

### 병목 2: 작업 흐름의 기준선이 부족하다

Lead time은 약 3.1시간으로 짧지만 PR 표본이 3건뿐이다. 또한 종료된 이슈가 없어 이슈 cycle time을 검증할 수 없다. 즉, 현재는 속도보다 측정 체계의 지속성이 더 큰 병목이다.

**원인 가설**

- 이슈에 시작/완료 상태를 표현하는 라벨과 담당자가 일관되지 않음
- PR 템플릿과 연결된 이슈가 없어 작업 시작점이 불분명함
- 지표를 주기적으로 검토하는 회고 루틴이 없음

### 병목 3: 변경 단위와 리뷰 흐름이 표준화되지 않았다

짧은 lead time을 지속하려면 작은 PR, 명확한 완료 조건, 자동 검증이 필요하다. 현재는 이를 보장하는 저장소 규칙과 템플릿이 부족하다.

## 3. SMART 개선 목표

| 목표 | 구체적 기준 | 기한 | 측정 방법 |
| --- | --- | --- | --- |
| 배포 cadence 안정화 | `main` 병합 후 GitHub Pages 자동 배포를 유지하고, 주 1회 이상 배포 이벤트를 기록 | 4주 | Deployment frequency ≥ **0.14회/일** |
| PR 흐름 개선 | 모든 PR에 연결 이슈와 검증 결과를 남기고, PR 생성부터 병합까지 평균 시간을 4시간 이하로 유지 | 4주 | Lead time ≤ **4시간**, 병합 PR ≥ **8건/30일** |
| 작업 가시성 확보 | 모든 작업에 `todo`, `in-progress`, `done` 중 하나의 상태 라벨을 적용하고 이슈를 최소 4건 종료 | 4주 | Issue cycle time 표본 ≥ **4건** |
| 품질 안전망 확보 | PR마다 테스트/빌드 검증을 통과한 뒤 병합 | 2주 | GitHub Actions 성공률 **100%** |

목표는 현재 표본이 작다는 점을 고려해 절대적인 속도 향상보다 **반복 가능한 측정과 배포 습관**에 우선순위를 둔다.

## 4. 실행 계획 및 Roadmap

### 1주차: 측정 체계 정리

- PR 템플릿 추가: 목적, 연결 이슈, 변경 범위, 테스트 결과, 스크린샷
- 이슈 템플릿 추가: 문제 정의, 완료 조건, 우선순위
- `status:todo`, `status:in-progress`, `status:done` 라벨 정의
- 모든 배포가 GitHub Deployments API에 기록되는지 확인
- 매주 같은 요일에 Pulseboard 지표를 기록할 담당자 지정

### 2주차: 개발 흐름 자동화

- PR 생성 시 `npm test -- --watchAll=false --runInBand` 실행
- PR 병합 시 GitHub Pages 배포 실행
- 배포 실패 시 로그와 실패 원인을 Issue로 자동 기록
- 작은 기능 단위로 PR을 나누고, 하나의 PR이 하나의 이슈를 해결하도록 운영

### 3주차: 병목 제거 실험

- 진행 중인 이슈 수를 팀원 1명당 1개 이하로 제한
- 24시간 이상 리뷰 대기 중인 PR을 매일 확인
- 주 1회 20분 지표 리뷰: lead time, 배포 빈도, 미해결 이슈, 실패 배포
- 가장 오래된 열린 이슈 1건을 우선 처리하여 cycle time 표본 확보

### 4주차: 결과 검증과 표준화

- 30일 지표를 다시 측정하고 목표 달성 여부 비교
- 달성한 규칙은 README와 CONTRIBUTING 문서에 운영 규칙으로 반영
- 미달성 목표는 원인, 조정된 목표, 다음 실험을 회고에 기록
- 다음 달 개선 주기에서 유지할 지표와 폐기할 지표를 결정

## 5. 예상 성과

이 계획을 실행하면 단순히 배포 횟수를 늘리는 것이 아니라, 작업의 시작부터 배포까지 흐름을 관찰할 수 있게 된다.

- 배포 빈도 증가: 변경을 작게 나누고 자동 배포하여 피드백 주기가 짧아짐
- Lead time 안정화: PR 템플릿과 리뷰 대기 점검으로 불필요한 대기 감소
- 품질 향상: 병합 전 테스트/빌드 검증으로 배포 후 회귀 위험 감소
- 의사결정 개선: 주관적 체감 대신 30일 추세와 표본 수를 근거로 우선순위 결정
- Issue cycle time 확보: 완료된 이슈 데이터를 축적하여 backlog 건강도를 측정 가능

## 6. 제출 자료

- **대시보드:** https://watertowel21.github.io/oss_based_programming/
- **구현 코드:** https://github.com/watertowel21/oss_based_programming/tree/watertowel21-github-metrics-dashboard
- **API 및 도구 문서:** [README의 Pulseboard 섹션](README.md#pulseboard-dashboard)
- **배포 워크플로:** [.github/workflows/deploy-dashboard.yml](.github/workflows/deploy-dashboard.yml)
