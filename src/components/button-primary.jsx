export default function ButtonPrimary({ children, size = 'md', className = '', ...props }) {
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
      className={`rounded-md bg-button-primary-bg text-button-primary-text font-semibold shadow-sm hover:bg-button-primary-bg/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button-primary-bg ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
