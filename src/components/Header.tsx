interface HeaderProps {
  /** 결과 화면일 때만 뒤로가기를 보여준다 */
  onBack?: () => void
}

export function Header({ onBack }: HeaderProps) {
  return (
    <header className="header">
      {onBack ? (
        <button className="header__back" onClick={onBack} aria-label="다시 고르기">
          ←
        </button>
      ) : (
        <span className="header__back header__back--hidden" aria-hidden="true" />
      )}

      <div className="header__title">
        <span className="header__logo" aria-hidden="true">
          ♪
        </span>
        <div className="header__text">
          <h1>오늘의 루시</h1>
          <p>LUCY 노래 추천</p>
        </div>
      </div>

      <span className="header__back header__back--hidden" aria-hidden="true" />
    </header>
  )
}
