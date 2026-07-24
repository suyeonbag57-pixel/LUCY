import { ENERGY_LABEL, type Energy } from '../types/song'

const LEVELS: Energy[] = [1, 2, 3, 4, 5]

interface EnergyPickerProps {
  selected: Energy | null
  onSelect: (value: Energy | null) => void
}

/**
 * 곡의 세기 선택. 고르지 않아도 추천은 되므로 '상관없어요'가 기본값이다.
 * 한 번 더 누르면 선택이 풀린다.
 */
export function EnergyPicker({ selected, onSelect }: EnergyPickerProps) {
  return (
    <fieldset className="chip-group">
      <legend className="chip-group__label">
        곡의 세기 <span className="chip-group__optional">선택 안 해도 돼요</span>
      </legend>

      <div className="chip-group__list">
        <button
          type="button"
          className={`chip${selected === null ? ' chip--selected' : ''}`}
          aria-pressed={selected === null}
          onClick={() => onSelect(null)}
        >
          상관없어요
        </button>

        {LEVELS.map((level) => {
          const isSelected = selected === level
          return (
            <button
              key={level}
              type="button"
              className={`chip${isSelected ? ' chip--selected' : ''}`}
              aria-pressed={isSelected}
              aria-label={ENERGY_LABEL[level]}
              onClick={() => onSelect(isSelected ? null : level)}
            >
              <span className="chip__bars" aria-hidden="true">
                {'●'.repeat(level)}
                <span className="chip__bars--dim">{'○'.repeat(5 - level)}</span>
              </span>
              {ENERGY_LABEL[level]}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
