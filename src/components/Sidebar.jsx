const icons = {
  'shopping-cart': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  'package': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>,
  'calendar': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  'trending-up': <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
}

export default function Sidebar({ items, activePath, onNavigate, mode, onToggle, onCollapse, onExpand }) {
  const isExpanded = mode === 'expanded'
  const isCollapsed = mode === 'collapsed'
  const isHidden = mode === 'hidden'

  return (
    <>
      {isHidden && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-600 lg:hidden"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      )}

      <aside
        className={`
          ${isHidden ? '-translate-x-full' : 'translate-x-0'}
          fixed inset-y-0 left-0 z-40
          bg-white border-r border-slate-200 shadow-md
          transition-all duration-200 ease-in-out
          flex flex-col
          ${isExpanded ? 'w-[260px]' : 'w-[260px] md:w-[80px]'}
          ${isHidden ? 'lg:hidden' : ''}
          ${isCollapsed ? 'block' : ''}
          ${isExpanded ? 'block' : ''}
        `}
      >
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 ${isCollapsed && 'md:justify-center'}`}>
          {isExpanded ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
                <span className="font-bold text-lg text-slate-900">Kasir Toko</span>
              </div>
              <button
                onClick={onCollapse}
                className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Collapse sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="15 6 21 12 15 18"/></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full md:justify-center">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <div className="flex items-center">
                <button
                  onClick={onExpand}
                  className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Expand sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><polyline points="9 18 3 12 9 6"/></svg>
                </button>
                <button
                  onClick={onToggle}
                  className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {items.map((item) => {
            const isActive = activePath === item.path
            return (
              <button
                key={item.path}
                onClick={() => { onNavigate(item.path); if (isHidden) onToggle() }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isCollapsed ? 'md:justify-center md:px-0' : ''}`}
                title={!isExpanded ? item.label : undefined}
              >
                <span className={`${isActive ? 'text-emerald-600' : 'text-slate-400'} shrink-0`}>
                  {icons[item.icon]}
                </span>
                {isExpanded && <span>{item.label}</span>}
                {isCollapsed && <span className="hidden md:hidden">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className={`p-3 border-t border-slate-200 ${isCollapsed && 'md:flex md:justify-center'}`}>
          {isExpanded ? (
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>v1.0.0</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </div>
          )}
        </div>
      </aside>

      {isExpanded && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={onToggle} />
      )}
    </>
  )
}
