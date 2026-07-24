interface MoodTextInputProps {
  value: string
  onChange: (value: string) => void
  /** 예시 문장을 누르면 그대로 입력창에 채운다 */
  onSubmitExample?: () => void
}

const EXAMPLES = [
  '시험 망해서 새벽에 혼자 걷는 중',
  '오랜만에 친구들 만나서 신남',
  '비 오는 날 창밖 보면서 멍때리는 중',
  '요즘 너무 지치고 위로가 필요해',
  '설레는 사람이 생겼어',
]

/**
 * 지금 상황·기분을 자유롭게 적는 입력창.
 * 개인정보(이름·전화번호 등)는 받지 않고, 적은 문장은 브라우저 안에서만 쓰인다. (팀 규칙)
 */
export function MoodTextInput({ value, onChange, onSubmitExample }: MoodTextInputProps) {
  return (
    <section className="text-input">
      <label className="text-input__label" htmlFor="mood-text">
        지금 상황이나 기분을 적어보세요
        <span className="text-input__optional">칩만 골라도 괜찮아요</span>
      </label>

      <textarea
        id="mood-text"
        className="text-input__area"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="예) 시험 끝나고 홀가분하게 바람 쐬는 중"
        rows={3}
        maxLength={200}
      />

      <div className="text-input__examples" aria-label="예시 문장">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            className="text-input__example"
            onClick={() => {
              onChange(example)
              onSubmitExample?.()
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  )
}
