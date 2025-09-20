# 나만의티켓 (MyTicket)

인하대학교 소프트웨어융합공학과  
SW 융합프로젝트1 최종보고서  
2025년 6월 17일  

팀명: **나만의티켓**  
팀원: 길윤서, 남주현, 조정현  

---

## 📑 목차
1. 서론  
2. 서비스 요구사항  
3. 서비스 구성 및 기능  
4. 설계  
5. 일정 계획  
6. 개발 내용  
7. 기대 효과 및 활용 계획  
8. 참고 문헌  

---

## 1. 서론

### 1.1 시스템 개요 및 배경
기존 티켓 발급 서비스는 대규모 행사 중심(3,000명 이상), 사업자등록증 필요, 다양한 앱 설치 필요 등의 불편함이 있었습니다.  

👉 이를 해결하기 위해 **소규모 모임/소상공인도 활용 가능한 범용 QR코드 티켓 발급/관리 애플리케이션**을 개발했습니다.  

---

## 2. 서비스 요구사항

### 2.1 기능적 요구사항
- 단발성/갱신형 티켓 발급 지원
- 발급 개수 및 사용자 수 확인
- 구글폼 연동 신청
- 회원가입/로그인
- 권한 기반 입장권 발송
- 관리자 추가
- 참여자 관리 (추가/수정)
- 통계 확인

### 2.2 비기능적 요구사항
- QR 인식 기능 필수

---

## 3. 서비스 구성 및 기능

### 3.1 유즈케이스 다이어그램
```mermaid
usecaseDiagram
    actor 관리자 as "모임 관리자"
    actor 사용자 as "사용자"

    관리자 --> (회원가입)
    관리자 --> (로그인)
    관리자 --> (모임 생성)
    관리자 --> (입장권 검증)
    관리자 --> (입장권 발송)
    관리자 --> (참가자 통계 조회)

    (모임 생성) ..> (모임 관리자 추가) : <<extend>>
    (모임 생성) ..> (참가자 명단 추가 및 수정) : <<extend>>
    (모임 생성) ..> (참여 신청 링크 생성) : <<extend>>

    (참여 신청 링크 생성) ..> (참여 신청) : <<include>>
    사용자 --> (참여 신청)

    (입장권 발송) ..> (입장권 발송 이벤트 설정) : <<extend>>

flowchart TD
    사용자 -->|회원가입/로그인| 로그인
    로그인 --> 메인화면

    메인화면 -->|모임 생성| 모임생성
    메인화면 -->|참가자 관리| 참가자관리
    메인화면 -->|입장권 발송| 입장권발송
    메인화면 -->|입장권 검증| 입장권검증
    메인화면 -->|통계 확인| 통계

    모임생성 --> DB[(모임 DB)]
    참가자관리 --> DB
    입장권발송 --> DB
    입장권검증 --> DB
    통계 --> DB

    DB -->|QR 생성| QR코드

erDiagram
    USER {
        int user_id PK
        string name
        string email
        string phone
        string password
    }

    EVENT {
        int event_id PK
        string name
        date date
        string description
        int organizer_id FK
    }

    TICKET {
        int ticket_id PK
        int event_id FK
        int user_id FK
        string qr_code
        datetime issued_at
    }

    PARTICIPANT {
        int participant_id PK
        int event_id FK
        int user_id FK
        string role
    }

    STATISTICS {
        int stat_id PK
        int event_id FK
        int participants_count
        int tickets_count
    }

    USER ||--o{ EVENT : organizes
    USER ||--o{ PARTICIPANT : joins
    EVENT ||--o{ TICKET : issues
    EVENT ||--o{ PARTICIPANT : has
    EVENT ||--o{ STATISTICS : generates
    USER ||--o{ TICKET : ownsgraph TD
    A[메인화면]
    A --> B[모임 생성]
    A --> C[모임 편집]
    A --> D[참가자 명단 보기]
    A --> E[입장권 발송]
    A --> F[입장권 검증]
    A --> G[참가자 통계]
    A --> H[입장권 확인 (QR코드)]

flowchart TD
    A[입장권 확인 화면] --> B[구매 정보 표시]
    B --> B1[상품명/구매자/연락처/구매일자]
    B --> B2[유효기간]

    A --> C[QR코드 표시]
    C --> C1[주문번호]
    C --> C2[입장권명]

    A --> D[닫기 버튼]

기능별 모듈 & DB 설계
📌 기능별 모듈 구조
1. 인증 모듈 (Authentication Module)

기능

회원가입 (이메일/전화번호 기반)

로그인 (JWT 또는 세션 기반)

비밀번호 해시/검증

세부 모듈

auth/register.js : 사용자 회원가입 처리

auth/login.js : 로그인 처리, 토큰 발급

auth/middleware.js : 인증 미들웨어 (API 접근 제어)

연결 DB 테이블

USER

2. 모임 관리 모듈 (Event Management Module)

기능

모임 생성/수정/삭제

모임 정보 조회

모임 썸네일 및 설명 관리

세부 모듈

event/create.js : 모임 생성

event/update.js : 모임 수정

event/delete.js : 모임 삭제

event/get.js : 모임 상세 조회

연결 DB 테이블

EVENT

PARTICIPANT (모임과 참가자 연결)

3. 관리자 관리 모듈 (Admin Management Module)

기능

모임 관리자 추가/삭제

권한 부여/회수

세부 모듈

admin/add.js : 관리자 등록

admin/remove.js : 관리자 제거

admin/permissions.js : 권한 관리

연결 DB 테이블

USER

PARTICIPANT (role = 관리자/참가자 구분)

4. 참가자 관리 모듈 (Participant Management Module)

기능

참가자 명단 추가/수정/삭제

참여 신청 링크 생성 및 처리

세부 모듈

participant/add.js : 참가자 수동 추가

participant/update.js : 참가자 수정

participant/remove.js : 참가자 삭제

participant/join.js : 링크를 통한 참가 신청 처리

연결 DB 테이블

PARTICIPANT

5. 티켓 발급/발송 모듈 (Ticket Issuance & Delivery Module)

기능

QR코드 티켓 발급

이메일/SMS를 통한 티켓 발송

중복 입장 방지 설정

세부 모듈

ticket/generate.js : QR코드 생성

ticket/sendEmail.js : 이메일 발송

ticket/sendSMS.js : SMS 발송

연결 DB 테이블

TICKET

6. 티켓 검증 모듈 (Ticket Validation Module)

기능

입장 시 QR 스캔 → 참가자 확인

중복 입장 체크

세부 모듈

validate/scan.js : QR 코드 스캔/검증

validate/log.js : 입장 로그 기록

연결 DB 테이블

TICKET

PARTICIPANT

7. 통계 모듈 (Statistics Module)

기능

모임별 발급 티켓 수, 입장자 수 집계

기간별 통계 제공

세부 모듈

stats/eventStats.js : 모임별 통계

stats/participantStats.js : 참가자 통계

연결 DB 테이블

STATISTICS

📌 데이터베이스 구조 (ERD 기반)
USER 테이블
컬럼명	타입	설명
user_id (PK)	INT	사용자 고유 ID
name	VARCHAR	이름
email	VARCHAR	이메일
phone	VARCHAR	전화번호
password	VARCHAR	암호화된 비밀번호
created_at	DATETIME	생성일
