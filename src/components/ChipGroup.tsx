interface ChipGroupProps<T extends string> {
  label: string
  /** 라벨 옆에 작게 붙는 설명 */
  hint?: string
  /** 고를 수 있는 값들 */
  options: readonly T[]
  /** 값 앞에 붙일 이모지 (없으면 텍스트만) */
  emoji?: Record<T, string>
  selected: T | null
  onSelect: (value: T | null) => void
  /** true면 '상관없어요' 버튼을 맨 앞에 붙인다 */
  allowNone?: boolean
  /** allowNone일 때 그 버튼에 쓸 문구 */
  noneLabel?: string
}

/**
 * 기분 / 상황 / 앨범 종류 / 세기를 고르는 알약 버튼 묶음.
 * 한 번 더 누르면 선택이 풀린다(토글). 여러 화면이 같은 모양을 쓰므로 하나로 모았다.
 */
export function ChipGroup<T extends string>({
  label,
  hint,
  options,
  emoji,
  selected,
  onSelect,
  allowNone = false,
  noneLabel = '상관없어요',
}: ChipGroupProps<T>) {
  return (
    <fieldset className="chip-group">
      <legend className="chip-group__label">
        {label}
        {hint && <span className="chip-group__optional">{hint}</span>}
      </legend>

      <div className="chip-group__list">
        {allowNone && (
          <button
            type="button"
            className={`chip${selected === null ? ' chip--selected' : ''}`}
            aria-pressed={selected === null}
            onClick={() => onSelect(null)}
          >
            {noneLabel}
          </button>
        )}

        {options.map((option) => {
          const isSelected = selected === option
          return (
            <button
              key={option}
              type="button"
              className={`chip${isSelected ? ' chip--selected' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? null : option)}
            >
              {emoji && (
                <span className="chip__emoji" aria-hidden="true">
                  {emoji[option]}
                </span>
              )}
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
