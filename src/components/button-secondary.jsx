export default function ButtonSecondary({ children, size = 'md', className = '', ...props }) {
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2 py-1 text-sm',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-sm',
    xl: 'px-3.5 py-2.5 text-sm',
  }

  return (
    <button
      type="button"
      className={`rounded-md bg-button-secondary-bg text-button-secondary-text font-semibold ring-1 ring-inset ring-gray-300 shadow-sm hover:bg-button-secondary-bg/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
