interface DebounceFunction<F extends (...args: any[]) => void> {
  (...args: Parameters<F>): void;
}

function debounce<F extends (...args: any[]) => void>(
  func: F,
  delay: number,
): DebounceFunction<F> {
  // Node.js 20 버전부터 setTimeout 반환값이 number로 변경되어 number로 해도 되지만
  // 호환성을 위해 ReturnType<typeof setTimeout> 사용

  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (this: any, ...args: Parameters<F>) {
    // timer가 null이 아니면서 falsy인 케이스(0)
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, delay);
  };

  return debounced;
}

export { debounce };
