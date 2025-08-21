export default function ContainerFull({ children, className = '', style = {} }) {
  return (
    <div className={`mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`} style={style}>
      {children}
    </div>
  );
}
