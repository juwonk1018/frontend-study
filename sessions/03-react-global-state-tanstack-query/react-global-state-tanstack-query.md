# React 전역 상태와 TanStack Query

## 먼저 알아보기: 전역 상태와 상태 관리 도구

### 전역 상태란?

React에서 **상태(state)**는 입력한 글자, 선택한 탭, 사용자 정보처럼 화면을 그리는 데 사용하는, 바뀔 수 있는 데이터다. 하나의 컴포넌트 안에서만 필요한 값은 보통 `useState`로 관리하는 **로컬 상태**로 둔다.

**전역 상태(global state)**는 여러 컴포넌트나 화면에서 함께 읽고 변경해야 하는 상태다. 예를 들어 설정 화면에서 다크 모드를 켰을 때 헤더와 본문도 함께 바뀌려면, 같은 테마 값을 공유해야 한다. 여기서 ‘전역’은 반드시 앱 전체가 사용한다는 뜻은 아니며, 필요한 컴포넌트들이 공통으로 접근하는 범위일 수 있다.

### 전역 상태 라이브러리는 왜 필요할까?

**전역 상태 라이브러리**는 공유할 상태를 저장하고, 값을 바꾸는 방법을 제공하며, 그 값을 사용하는 컴포넌트가 변경 내용을 화면에 반영하도록 돕는 도구다. 여러 화면이 함께 쓰는 ‘공용 보관함’과 그 내용이 바뀌었음을 알려 주는 장치로 생각하면 쉽다.

모든 상태를 전역으로 만들 필요는 없다. 한 화면의 입력값처럼 사용 범위가 좁은 상태는 로컬에 두고, 공유가 필요한 상태부터 범위를 넓히면 된다.

### UI/client state와 server state의 차이

| 구분         | UI / 클라이언트 상태(client state)                      | 서버 상태(server state)                    |
| ---------- | ------------------------------------------------ | -------------------------------------- |
| 의미         | 앱이 직접 관리하는 화면·사용자 작업 상태. UI 상태는 클라이언트 상태의 한 종류다. | 서버가 원본을 관리하고 앱이 요청해서 가져오는 데이터          |
| 예시         | 모달 열림 여부, 선택한 탭, 저장 전 입력 초안                      | API로 받은 사용자 프로필, 게시글 목록, 주문 내역         |
| 변경의 기준     | 사용자의 클릭·입력과 앱 내부 로직                              | 서버의 처리 결과. 다른 사용자나 기기의 작업으로도 바뀔 수 있음   |
| 관리할 때의 관심사 | 어떤 컴포넌트가 공유하고 어떻게 값을 변경할지                        | 로딩·에러, 캐시(받아 둔 데이터의 재사용), 최신 데이터와의 동기화 |

**로컬/전역은 ‘누가 공유하는가’, 클라이언트/서버는 ‘누가 원본을 관리하는가’라는 서로 다른 구분이다.** 여러 화면이 공유하는 프로필도 서버 상태이며, 한 컴포넌트만 쓰는 API 응답 역시 서버 상태다. 서버 상태는 브라우저에 가져와 보관해도 원본이 서버에 있다는 점이 달라지지 않는다.

### Redux / Zustand / Jotai / Context API와 TanStack Query의 역할

| 도구                                | 쉽게 이해하는 역할                                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Redux (주로 Redux Toolkit으로 사용)** | 공유 상태를 스토어에 모으고, 액션과 리듀서라는 정해진 규칙으로 변경한다. 복잡한 상태 변경 흐름을 일관되게 관리할 때 활용한다.                                    |
| **Zustand**                       | 비교적 간단한 API로 공유 스토어와 상태 변경 함수를 만들고, 컴포넌트가 필요한 값을 구독하게 한다.                                                   |
| **Jotai**                         | 상태를 `atom`이라는 작은 단위로 나누고, 필요한 atom을 읽거나 조합해 관리한다.                                                           |
| **Context API**                   | 별도 라이브러리가 아닌 **React 내장 기능**이다. Provider 아래의 컴포넌트에 값을 전달하며, 상태 저장·변경은 보통 `useState`나 `useReducer`와 함께 구성한다. |
| **TanStack Query (React Query)**  | 서버 데이터의 요청, 캐시 공유, 로딩·에러 상태, 재요청과 동기화를 돕는다. 모달이나 선택한 탭 같은 일반 UI 상태를 관리하는 도구와는 주된 역할이 다르다.                   |

예를 들어 **프로필 편집 모달의 열림 여부**는 로컬 상태나 Zustand 등으로 관리하고, **서버에서 가져온 프로필과 저장 후 데이터 갱신**은 TanStack Query로 관리할 수 있다. 편집 중인 입력 초안은 별도의 클라이언트 상태로 두면 된다. 이 도구들은 역할을 나누어 함께 사용할 수 있다.

> Redux·Zustand·Jotai에서도 서버 응답을 저장하거나 비동기 처리를 할 수 있다. 차이는 ‘저장할 수 있는가’보다 **서버 데이터의 캐시와 동기화를 누가 담당하는가**에 있다. Redux Toolkit에는 이 역할을 위한 **RTK Query**도 있다. 아래의 Redux 비교 예시는 RTK Query가 아니라, thunk와 slice로 서버 응답을 직접 관리하는 방식이다. 또한 TanStack Query의 캐시는 서버 원본의 복사본이며, 원본 자체를 대체하지 않는다.

개념 참고: [React의 상태 공유와 Context](https://react.dev/learn/scaling-up-with-reducer-and-context), [TanStack Query의 서버 상태 관리](https://tanstack.com/query/v4/docs/framework/react/overview), [Jotai의 atom 모델](https://jotai.org/), [RTK Query 소개](https://redux-toolkit.js.org/rtk-query/overview).

이제 전역 상태가 필요해진 배경을 살펴보고, 서버 데이터를 일반 전역 스토어에서 직접 관리할 때 생기는 문제를 TanStack Query가 어떻게 해결하는지 이어서 알아보자.

---
## 1. 전역 상태가 필요해진 배경

### 로컬 state만으로 부족할 때

- props drilling: `App → Layout → Header → UserMenu`처럼 값을 여러 단계에 전달해야 할 수 있음
- 같은 UI 플래그를 여러 화면이 공유 (테마, 사이드바 open, 모달)
- “한곳에서 바꾸고 여러 곳이 반응”이 필요

**Props drilling 자체가 나쁜 것은 아니다.** 몇 단계까지 허용한다는 고정된 숫자도 없다. 부모와 자식 사이의 값 전달은 데이터 흐름이 명확하다는 장점이 있다. 깊이보다 **중간 컴포넌트가 값을 사용하지 않고 전달만 하는 일이 반복되는지**, 구조를 바꿀 때 여러 파일을 함께 수정해야 하는지를 보자.

| 상황 | 먼저 고려할 방법 |
| --- | --- |
| 한 컴포넌트에서만 사용 | 로컬 `useState` |
| 가까운 부모·자식이 사용 | props |
| 중간 컴포넌트가 전달만 함 | 컴포넌트 분리 또는 `children`으로 구성 변경 |
| 특정 화면의 깊은 여러 컴포넌트가 공유 | 그 화면 범위의 Context |
| 멀리 떨어진 화면들이 같은 클라이언트 상태를 읽고 변경 | 공유 스토어 검토 |
| API에서 받은 데이터 | 사용 범위와 관계없이 TanStack Query 같은 서버 상태 도구 검토 |

예를 들어 `Layout`과 `Header`가 `user`를 쓰지 않고 `UserMenu`로 전달만 한다면 구조를 개선할 이유가 있다. 그렇다고 바로 앱 전체 전역 스토어에 넣을 필요는 없다. 필요한 공유 범위까지만 넓히자. React 공식 문서도 Context를 도입하기 전에 props나 `children`을 고려하라고 안내한다. [React: Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)

### 그래서 나온 전역 패턴들

| 도구                       | 한 줄 요약                       | 잘 맞는 곳                      |
| ------------------------ | ---------------------------- | --------------------------- |
| **Context + useReducer** | React 기본. Provider로 트리에 값 주입 | 테마, 인증 UI 플래그, 작은 앱         |
| **Redux Toolkit**        | 예측 가능한 스토어 + 미들웨어·DevTools   | 복잡한 클라이언트 워크플로, 팀 표준이 필요할 때 |
| **Zustand**              | 작은 API, boilerplate 적음       | 모달·UI 전역, 중간 규모             |
| **Jotai / Recoil**       | atom 단위 구독                   | 파생 상태가 많고 세밀한 구독이 필요할 때     |

> 포인트: 전부 **클라이언트(UI) 상태**를 잘 다루도록 설계된 도구에 가깝다.  
> “API에서 받아온 목록·상세·로딩·에러”까지 전역에 넣기 시작하면 보일러플레이트와 동기화 버그가 늘어난다.

---

## 2. 서버 상태 문제 — 전역에 넣었을 때의 고통 

서버에서 온 데이터를 전역 스토어에 두면 자주 생기는 일:

- fetch를 여러 컴포넌트가 **각자** 다시 짬 → 중복 요청
- 로딩/에러/성공을 **액션·리듀서**로 매번 손으로 모델링
- 목록에서 수정 후 상세·다른 탭과 **캐시가 안 맞음**
- 포커스 복귀·폴링·재시도·캐시 만료를 직접 구현

→ 이게 “전역 라이브러리의 한계”라기보다, **서버 상태를 클라이언트 스토어처럼 취급한 설계 문제**에 가깝다.

---

## 3. TanStack Query가 나온 이유 

**TanStack Query (React Query)** = 서버 상태를 위한 비동기 캐시 레이어.

핵심 아이디어:

- 서버 데이터는 “소유”하지 말고 **캐시 + 구독**한다
- 식별자는 `queryKey`
- 신선함(`stale` / `fresh`), 재요청, 무효화(`invalidate`)를 라이브러리가 담당

```
클라이언트 상태  →  Context / Zustand / Redux …
서버 상태        →  TanStack Query (cache)
```



> 즉, 전역 스토어는 UI 진실의 원천, Query는 서버 진실의 원천(캐시)이다.

---

## 4. Before / After — 같은 화면, 두 가지 설계

시나리오: 사용자 프로필을 헤더와 설정 페이지에서 함께 씀.  
**같은 API(`api.getMe` / `api.updateMe`)를 Redux에 넣었을 때 vs TanStack Query로 뺐을 때**를 나란히 둔다.

### Before — Redux Toolkit에 서버 유저를 복사

예전 실무에서 흔했던 그림:

`createAsyncThunk`로 fetch → `createSlice`가 state 갱신 → 화면은 `dispatch` / `useSelector`로 스토어만 바라봄.

발표할 때 이 순서로 코드를 짚으면 된다. (**store 자체는 thunk가 만들지 않는다.** slice들을 합친 store가 “방”이고, thunk는 그 방에 결과를 액션으로 흘려보낸다.)

#### (1) `createAsyncThunk` — 비동기 작업 정의 

API를 호출하고, 진행 상황을 **액션 세 갈래**로 알려 준다.

| 액션          | 언제    | 대략 의미             |
| ----------- | ----- | ----------------- |
| `pending`   | 요청 시작 | 로딩 시작해도 됨         |
| `fulfilled` | 성공    | `payload`에 응답 데이터 |
| `rejected`  | 실패    | 에러 처리             |

```tsx
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// "user/fetchMe" = 액션 type prefix. 실행은 dispatch(fetchMe()) 할 때.
export const fetchMe = createAsyncThunk("user/fetchMe", () => api.getMe());

export const updateMe = createAsyncThunk(
  "user/updateMe",
  async (body: Partial<User>) => api.updateMe(body),
);
```

| “thunk는 ‘이 API 호출해 줘’라는 **비동기 일꾼**이다. 전역 저장소 생성기가 아니다.”

#### (2) `createSlice` — 이 도메인의 state 모양 + 액션 오면 어떻게 바꿀지

`user`라는 칸의 초기값과, 위에서 흘러온 액션을 받았을 때 `data` / `status`를 어떻게 바꿀지 정한다. 여러 slice를 store에 붙이면 그게 전역 저장소가 된다.

```tsx
const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null as User | null,
    status: "idle" as "idle" | "loading" | "failed",
  },
  // reducers: 이 slice가 직접 만드는 동기 액션 (예: setTheme, 컴포넌트에서 즉시 처리하는 로컬 변경)
  reducers: {},
  // extraReducers: 밖(특히 createAsyncThunk)에서 온 액션 처리, `createAsyncThunk`가 만든 API 요청 결과
  extraReducers: (b) => {
    b.addCase(fetchMe.pending, (s) => {
      s.status = "loading";
    });
    b.addCase(fetchMe.fulfilled, (s, a) => {
      s.status = "idle";
      s.data = a.payload; // 서버 유저를 스토어에 복사
    });
    b.addCase(fetchMe.rejected, (s) => {
      s.status = "failed";
    });
    // 저장 성공 시에도 스토어를 손으로 맞춰 줘야 함
    b.addCase(updateMe.fulfilled, (s, a) => {
      s.data = a.payload;
    });
  },
});

export default userSlice.reducer;
```

#### `reducers` vs `extraReducers`

|        | `reducers`            | `extraReducers`                                    |
| ------ | --------------------- | -------------------------------------------------- |
| 누구 액션? | **이 slice가 만든** 동기 액션 | **밖에서 온** 액션 (thunk의 pending/fulfilled/rejected 등) |
| 예      | `toggleSidebar`       | `fetchMe.fulfilled` 때 `data` 넣기                    |
| 이 예시   | 비어 있음 `{}`            | fetch/update 결과를 state에 반영                         |

비동기 thunk 결과를 slice에 넣을 때는 거의 항상 `extraReducers`다. thunk 액션 type을 slice가 “소유”하지 않기 때문이다.

#### (3) 화면 — `useDispatch`로 시키고, `useSelector`로 읽기

- **`useDispatch`**: store에 “이 일 해줘” 요청을 보내는 함수를 가져온다. `dispatch(fetchMe())` = thunk 실행.
- **`useSelector`**: store를 **읽기만** 한다. `s.user.data` / `s.user.status` 구독.

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.user.data);
  const status = useSelector((s: RootState) => s.user.status);

  useEffect(() => {
    // 마운트마다 fetch 요청 → ProfileForm도 똑같이 하면 중복 fetch
    dispatch(fetchMe());
  }, [dispatch]);

  if (status === "loading" && !user) return <Skeleton />;
  if (status === "failed") return <ErrorHint />;
  return <span>{user?.name}</span>;
}

function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.user.data);

  useEffect(() => {
    dispatch(fetchMe()); // Header와 또 한 번
  }, [dispatch]);

  const onSave = async (body: Partial<User>) => {
    await dispatch(updateMe(body));
    // 헤더를 최신으로 맞추려면 또 dispatch(fetchMe())를 고민하게 됨
    // (이 예시는 updateMe.fulfilled에서 data를 직접 넣는 방식)
  };

  // ...
}
```

#### 한 줄 정리
1. `dispatch(fetchMe())` → thunk가 `api.getMe()` 호출  
2. `pending` → `extraReducers`가 `status = "loading"`  
3. `fulfilled` → `data = payload` (서버 응답을 스토어에 복사)  
4. `useSelector`로 구독 중인 Header / ProfileForm이 리렌더  

> 클래식 thunk든 RTK든, **서버 응답을 클라이언트 스토어에 복사**하는 구조는 같다.

#### 보이는 증상 (이 Before가 아픈 이유)

- 헤더·설정이 각각 `dispatch(fetchMe())` → **중복 요청**
- 화면 들어올 때마다 스피너가 깜빡이거나, 한쪽만 최신
- “저장 성공 후 헤더 이름 안 바뀜” → `updateMe.fulfilled`에서 `data`를 직접 넣거나 `fetchMe`를 또 호출해야 함
- 로딩/에러를 액션·리듀서로 API마다 매번 모델링

 > Redux의 일반적인 slice와 thunk는 데이터를 공유할 수 있지만, 서버 데이터의 캐시·중복 요청·최신 상태·재요청까지 자동으로 관리하지는 않는다.

### After — 같은 화면을 TanStack Query로

Before와의 대비만 먼저:

| Before (Redux)             | After (Query)                     |
| -------------------------- | --------------------------------- |
| `dispatch(fetchMe())`      | `useQuery`가 구독·fetch 담당           |
| `data`/`status`를 slice에 복사 | `queryKey` 캐시에 둠 (user slice 불필요) |
| 화면마다 fetch 호출하기 쉬움         | 같은 키면 캐시 공유·요청 합침                 |
| 저장 후 스토어를 손으로 맞춤           | `invalidateQueries`로 구독 UI 갱신     |

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const userKeys = {
  all: ["user"] as const,
  me: () => ["user", "me"] as const,
};

function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: api.getMe,
    staleTime: 60_000, // 1분 fresh → 헤더·설정이 같이 써도 즉시 재요청 안 함
  });
}

function Header() {
  const { data: user, isPending, isError } = useMe();
  if (isPending) return <Skeleton />;
  if (isError) return <ErrorHint />;
  return <span>{user.name}</span>;
}

function ProfileForm() {
  const qc = useQueryClient();
  const { data: user } = useMe(); // 같은 queryKey → 캐시 공유, 요청 합쳐짐

  const mutation = useMutation({
    mutationFn: api.updateMe,
    onSuccess: () => {
      // 서버가 바뀜 → 캐시 무효화 → Header 등 구독 UI가 따라옴
      qc.invalidateQueries({ queryKey: userKeys.me() });
    },
  });

  const onSave = (body: Partial<User>) => mutation.mutate(body);
  // ...
}
```

조회와 무효화는 **같은 키**를 가리켜야 한다. 예를 들어 조회 키가 `["user", filter]`인데 무효화 키가 `["user", "me"]`라면, 원하는 쿼리가 갱신되지 않을 수 있다. `getMe`처럼 필터가 없는 요청은 위처럼 키를 통일한다. 필터에 따라 응답이 달라지는 요청이라면 `queryKey`에도 그 필터를 포함한다. [TanStack Query: Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

#### `useQuery` 결과에서 필요한 속성만 읽기

컴포넌트에서 `const { data: user, isPending, isError } = useMe()`처럼 꺼내는 것은 로딩·에러 UI를 실제로 표시한다면 자연스럽다. 다만 모든 화면이 `user`만 필요한 것은 아니다. 공용 훅 안에서 세 속성을 미리 꺼내 반환하면, 호출하는 컴포넌트가 `user`만 사용하더라도 훅이 이미 `isPending`과 `isError`에 접근한 셈이다.

```tsx
// 모든 호출자가 세 속성의 변경을 추적하게 되는 형태
function useMeSummary() {
  const { data: user, isPending, isError } = useQuery({
    queryKey: userKeys.me(),
    queryFn: api.getMe,
  });
  return { user, isPending, isError };
}

// 공용 훅은 결과를 그대로 반환하고, 호출자가 필요한 속성만 읽는다.
function UserName() {
  const { data: user } = useMe();
  return <span>{user?.name}</span>;
}
```

TanStack Query는 결과 객체에서 **접근한 속성**을 추적해 해당 속성이 바뀔 때 재렌더링을 알린다. 따라서 위 `UserName`은 `data`만 읽는다. 여기서 말하는 재렌더링은 값을 화면에 모두 표시한다는 뜻이 아니라 **컴포넌트 함수가 다시 실행될 수 있다**는 뜻이다. 실제로 `data`도 함께 바뀌었다면 어차피 재렌더링이 필요하다. `{ data, ...rest }`처럼 나머지 속성을 한꺼번에 구조 분해하면 이 최적화가 깨진다. [TanStack Query: Render Optimizations](https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations)

`const { data: user } = useQuery(...)`에서 `data: user`는 변수 이름을 `user`로 바꾸는 문법이다. 이후에는 `return data`가 아니라 `return user`라고 써야 한다. 공용 훅이 데이터만 반환해도 동작하지만, 호출자가 로딩·에러·재시도 상태를 사용할 수 없고 첫 요청 중 데이터가 `undefined`일 수 있으므로 반환 형태를 의도적으로 정해야 한다.

**After에서 얻는 것**

- 같은 `queryKey`를 쓰는 컴포넌트는 **캐시 공유** (스토어에 user slice를 안 둬도 됨)
- 마운트·포커스·재연결 정책은 옵션으로 조절
- 갱신 후에는 `invalidateQueries` 한 줄로 구독 중인 UI가 따라옴
- Redux/Zustand는 테마·모달 같은 **클라이언트 상태**에만 남겨도 됨

---

## 5. 한 장 체크리스트 — 전역 vs Query 

| 넣어도 되는 곳 (전역/로컬)                | Query로 빼는 곳              |
| ------------------------------- | ------------------------ |
| 테마, 로케일                         | REST/GraphQL로 가져온 목록·상세  |
| 모달·드로어 open                     | 무한스크롤·페이지네이션 커서와 페이지 데이터 |
| 위자드 스텝(아직 서버 전)                 | “내가 좋아요 했는지” 같은 서버 플래그   |
| 로그인 토큰을 **메모리에만** 두는 UI 세션 플래그* | 검색 결과, 필터가 서버에 있는 경우     |

\*토큰 저장 위치(쿠키/httpOnly 등)는 보안 정책에 따름. 여기서는 “서버에서 온 프로필 JSON을 Redux에 또 두지 말자”는 구분.

### `staleTime` / `invalidate` 한 장

| 개념             | 의미                                      | 실무 감각                           |
| -------------- | --------------------------------------- | ------------------------------- |
| **fresh**      | `staleTime` 안 → 새 구독이 와도 즉시 refetch 안 함 | 프로필·설정처럼 자주 안 바뀌면 `staleTime`↑  |
| **stale**      | 낡음. 캐시는 보이되 백그라운드 refetch 가능            | 기본값 `staleTime: 0`이면 “항상 stale” |
| **invalidate** | “이 키는 더 이상 믿을 수 없음” 표시 → 활성 쿼리 재요청      | mutation 성공 직후 목록/상세 키에 호출      |

---

## 6. 최소 사용법 치트시트 

```tsx
// 앱 루트
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

```tsx
// 읽기
useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

// 쓰기
useMutation({ mutationFn: postTodo, onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }) });
```

`queryKey` 규칙 팁:

- 배열로, 구체적인 것부터: `["todos"]`, `["todos", id]`, `["todos", { filter }]`
- 요청 결과를 바꾸는 변수는 키에도 포함한다. 키가 달라지면 **다른 캐시 슬롯**을 사용한다.
- 객체 속성의 순서는 키 비교에 영향을 주지 않지만, 배열 요소의 순서는 영향을 준다. 키 값은 직렬화 가능해야 한다.

**키는 어디에 선언할까?** 같은 키를 조회·무효화·prefetch·캐시 수정 등 **두 곳 이상에서 참조한다면**, 기능별 `keys.ts`에 키 생성 함수를 모으는 것을 기본 규칙으로 삼자. 어디에 선언했는지 찾기 쉽고, 같은 데이터에 다른 키를 쓰거나 다른 데이터에 같은 키를 쓰는 실수를 줄인다. 한 화면의 쿼리에서만 참조하고 다른 곳에서 그 키를 사용하지 않는다면 인라인 선언도 충분하다. 모든 기능의 키를 앱 전체의 거대한 파일 하나에 모을 필요는 없다.

```ts
// user/keys.ts
export const userKeys = {
  all: ["user"] as const,
  me: () => ["user", "me"] as const,
  detail: (id: string) => ["user", "detail", id] as const,
};
```


---

## 참고

- TanStack Query 공식 문서: https://tanstack.com/query/latest
- 핵심 키워드: server state, queryKey, staleTime, invalidateQueries, QueryClientProvider
