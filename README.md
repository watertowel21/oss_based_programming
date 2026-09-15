# oss_based_programming
Assignments and practice codes for oss-based programming class, 2026-2.
기본정보 (Basic Info)
프로젝트명: 큐 기반 호가 매칭 프로그램
개요: 가상의 주식 매수/매도 주문을 우선순위 큐로 관리하고 체결시키는 시뮬레이터
동기: 자료구조의 핵심개념을 실제 금융시장의 호가 매칭 원리에 직접 구현하며 학습하기 위함
예상 결과물: 주문 체결 로그가 출력되는 C++ 프로그램 및 체결 결과 분석 대시보드

기술 스택(Tech stack)
Frontend: Python
Backend: C++
Database: Local CSV File
Deployment: Github

주요 기능(Key Feature)

핵심기능1: 가격과 시간 우선순위에 따른 매수, 매도, 호가창 자료구조 구현
핵심기능2: 매수, 매도 조건 충족 시 주문을 체결하고 잔여 수량을 업데이트 하는 매칭 기능
핵심기능3: Python으로 생성한 수만 건의 가상주문을 C++엔진에서 읽어들여 처리 후 결과 반환

마일스톤(Milestones)
W 1-4: 우선순위 큐 개념 학습, C++ 헤더/소스코드 분할 컴파일 환경 세팅, 가상 주문 세팅
W 5-8: 핵심기능 구현(C++기반 힙 자료구조 직접 구현 및 매칭 알고리즘 작성)
W 9-12: 파이썬 연동(C++ 체결 처리 결과를 파이썬에서 읽어들여 체결률 및 가격변동 시각화)
W 13-16: 프로그램 테스트, 코드 리팩토링, 발표준비