export default function ContainerNarrow({ children, className = '', style = {} }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className={`mx-auto max-w-3xl ${className}`} style={style}>
        {children}
      </div>
    </div>
  );
}
