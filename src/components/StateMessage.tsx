interface StateMessageProps {
  icon: string
  title: string
  description?: string
  /** 있으면 버튼을 함께 보여준다 */
  actionLabel?: string
  onAction?: () => void
}

/**
 * 로딩 / 결과 없음 / 오류를 같은 모양으로 보여주는 컴포넌트.
 * 화면마다 제각각 만들면 문구가 흩어지므로 한 곳에 모았다.
 */
export function StateMessage({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: StateMessageProps) {
  return (
    <div className="state-message" role="status">
      <div className="state-message__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="state-message__title">{title}</p>
      {description && <p className="state-message__desc">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="button button--ghost" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
