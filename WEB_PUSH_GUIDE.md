# Web 폴더 푸시 가이드

## 개요
WEDDING_SUMMARY 블록 추가 작업으로 web 폴더의 타입 정의가 업데이트되었습니다.

## 수정된 파일
- `web/src/types/invitation.ts`

## 변경 내용
1. `BlockType`에 `WEDDING_SUMMARY` 타입 추가
2. `WeddingSummaryBlockData` 인터페이스 추가
3. `BlockDataByType`에 `WEDDING_SUMMARY` 매핑 추가

---

## 푸시 절차

### 1. web 폴더로 이동
```bash
cd /Users/eonjeongcha/Desktop/myCode/CamelliaLetter/web
```

### 2. Git 상태 확인
```bash
git status
```

### 3. 변경된 파일 추가
```bash
git add src/types/invitation.ts
```

### 4. 커밋 생성
```bash
git commit -m "$(cat <<'EOF'
Feature(apps-web): WEDDING_SUMMARY 블록 타입 추가

예식 요약 정보를 간단히 표시하는 블록 타입 정의 추가
- BlockType에 WEDDING_SUMMARY 추가
- WeddingSummaryBlockData 인터페이스 추가
- BlockDataByType 매핑 추가

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### 5. 원격 저장소 확인 (필요시)
```bash
git remote -v
```

원격 저장소가 설정되지 않았다면:
```bash
git remote add origin <web-repository-url>
```

### 6. 푸시
```bash
git push origin main
```

또는 브랜치가 다르다면:
```bash
git push origin <branch-name>
```

---

## 충돌 발생 시

### Pull 후 Rebase
```bash
git pull origin main --rebase
```

### 충돌 해결 후
```bash
git add .
git rebase --continue
git push origin main
```

---

## 타입 검증

푸시 전 타입 체크 권장:
```bash
npm run typecheck
```

---

## 참고사항

- 커밋 메시지는 `docs/COMMIT_CONVENTION.md` 규칙을 따릅니다
- Type은 대문자로 시작: `Feature`, `Fix`, `Docs` 등
- Subject는 50자 이내로 작성
- Body는 선택사항이지만 상세 설명이 필요한 경우 추가

---

## 문제 해결

### 인증 오류
GitHub 토큰이 필요할 수 있습니다:
```bash
git config --global credential.helper store
```

### 브랜치 확인
현재 브랜치 확인:
```bash
git branch
```

다른 브랜치로 전환:
```bash
git checkout <branch-name>
```
