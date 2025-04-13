export default function ContainerConstrained({ children, className = '', style = {} }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} style={style}>
      {children}
    </div>
  );
}
