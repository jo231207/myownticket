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

짜줘
