import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, MoreVertical, MessageCircle, Users, Archive,
    Star, Settings, LogOut, UserPlus, Camera, Bell, Moon,
    Filter, ChevronDown, X, Check, CheckCheck, Phone, Video,
    Smile, Pin, Trash2, VolumeX, Edit3
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
    { _id: '1', fullName: 'Aria Patel', username: 'ariap', profileImage: null, status: 'online' },
    { _id: '2', fullName: 'Marcus Webb', username: 'mwebb', profileImage: null, status: 'away' },
    { _id: '3', fullName: 'Zoe Chen', username: 'zoec', profileImage: null, status: 'offline' },
];

const MOCK_CHATS = [
    {
        _id: 'c1', name: 'Aria Patel', avatar: null, online: true, unread: 3,
        lastMessage: 'Hey! Are you coming tonight? 🎉', time: '10:42 AM',
        typing: false, pinned: true, muted: false,
    },
    {
        _id: 'c2', name: 'Design Squad 🎨', avatar: null, online: false, unread: 12,
        lastMessage: 'Marcus: Can you review the new mockups?', time: '9:15 AM',
        typing: true, pinned: true, muted: false, isGroup: true,
    },
    {
        _id: 'c3', name: 'Marcus Webb', avatar: null, online: true, unread: 0,
        lastMessage: 'Sounds good, see you then!', time: 'Yesterday',
        typing: false, pinned: false, muted: true,
    },
    {
        _id: 'c4', name: 'Zoe Chen', avatar: null, online: false, unread: 0,
        lastMessage: 'The files are in the shared folder ✅', time: 'Yesterday',
        typing: false, pinned: false, muted: false,
    },
    {
        _id: 'c5', name: 'Project Alpha 🚀', avatar: null, online: false, unread: 0,
        lastMessage: 'You: I will push the update tomorrow', time: 'Mon',
        typing: false, pinned: false, muted: false, isGroup: true,
    },
    {
        _id: 'c6', name: 'Lena Hoffmann', avatar: null, online: false, unread: 1,
        lastMessage: 'Did you see the announcement?', time: 'Sun',
        typing: false, pinned: false, muted: false,
    },
    {
        _id: 'c7', name: 'Dev Team 👨‍💻', avatar: null, online: true, unread: 0,
        lastMessage: 'PR is merged ✓', time: 'Sat',
        typing: false, pinned: false, muted: true, isGroup: true,
    },
];

// ─── Color Seeds ───────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    ['#1a1a2e', '#e94560'], ['#0f3460', '#53d8fb'], ['#16213e', '#f5a623'],
    ['#1b4332', '#40916c'], ['#3d0066', '#c77dff'], ['#7b2d00', '#ff9a3c'],
    ['#0d1b2a', '#e0fbfc'], ['#2d1b69', '#ff6584'],
];

function getAvatarColors(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Avatar Component ──────────────────────────────────────────────────────────
function Avatar({ name, src, size = 48, online, muted }) {
    const [bg, accent] = getAvatarColors(name || 'User');
    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            {src ? (
                <img src={src} alt={name} className="rounded-full object-cover w-full h-full" />
            ) : (
                <div
                    className="rounded-full flex items-center justify-center font-bold select-none"
                    style={{
                        width: size, height: size,
                        background: `linear-gradient(135deg, ${bg}, ${accent})`,
                        fontSize: size * 0.33,
                        color: '#fff',
                        letterSpacing: '0.05em',
                    }}
                >
                    {getInitials(name || 'U')}
                </div>
            )}
            {online !== undefined && (
                <span
                    className="absolute bottom-0 right-0 rounded-full border-2"
                    style={{
                        width: size * 0.27, height: size * 0.27,
                        background: online ? '#25d366' : '#aaa',
                        borderColor: '#111b21',
                    }}
                />
            )}
            {muted && (
                <span className="absolute top-0 right-0 bg-[#111b21] rounded-full p-0.5">
                    <VolumeX size={10} className="text-gray-400" />
                </span>
            )}
        </div>
    );
}

// ─── Message Status ────────────────────────────────────────────────────────────
function MsgStatus({ read }) {
    return read
        ? <CheckCheck size={14} className="text-[#53bdeb] flex-shrink-0" />
        : <Check size={14} className="text-gray-500 flex-shrink-0" />;
}

// ─── Context Menu ──────────────────────────────────────────────────────────────
const CONTEXT_ITEMS = [
    { icon: Pin, label: 'Pin chat' },
    { icon: VolumeX, label: 'Mute notifications' },
    { icon: Archive, label: 'Archive chat' },
    { icon: Trash2, label: 'Delete chat', danger: true },
];

function ContextMenu({ x, y, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[999] rounded-xl overflow-hidden shadow-2xl"
            style={{
                top: y, left: x, minWidth: 180,
                background: '#233138', border: '1px solid rgba(255,255,255,0.08)'
            }}
        >
            {CONTEXT_ITEMS.map((item, i) => (
                <button
                    key={i}
                    onClick={onClose}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors
            ${item.danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-200 hover:bg-white/5'}`}
                >
                    <item.icon size={15} />
                    {item.label}
                </button>
            ))}
        </motion.div>
    );
}

// ─── Sidebar Dropdown Menu ─────────────────────────────────────────────────────
const MENU_ITEMS = [
    { icon: Users, label: 'New group' },
    { icon: Star, label: 'Starred messages' },
    { icon: Settings, label: 'Settings' },
    { icon: Archive, label: 'Archived chats' },
    { icon: Moon, label: 'Dark mode' },
    { icon: LogOut, label: 'Log out', danger: true },
];

function DropdownMenu({ onClose, onLogout }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-14 right-2 z-50 rounded-xl overflow-hidden shadow-2xl"
            style={{ minWidth: 200, background: '#233138', border: '1px solid rgba(255,255,255,0.08)' }}
        >
            {MENU_ITEMS.map((item, i) => (
                <motion.button
                    key={i}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                    onClick={() => { onClose(); item.label === 'Log out' && onLogout?.(); }}
                    className={`flex items-center gap-3 w-full px-5 py-3 text-sm transition-colors
            ${item.danger ? 'text-red-400' : 'text-gray-200'}`}
                >
                    <item.icon size={16} />
                    {item.label}
                </motion.button>
            ))}
        </motion.div>
    );
}

// ─── Filter Tabs ───────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Unread', 'Groups', 'Favourites'];

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar = ({
    currentUser = { fullName: 'You', profileImage: null, _id: 'me' },
    chats = MOCK_CHATS,
    allUsers = MOCK_USERS,
    activeChat = null,
    onSelectChat,
    onStartChat,
    onLogout,
    isOpen = true,          // mobile: controlled from parent
    onClose,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [contextMenu, setContextMenu] = useState(null); // { x, y }
    const [searchFocused, setSearchFocused] = useState(false);
    const fileRef = useRef(null);

    // ── Filter logic ─────────────────────────────────────────────────────────────
    const filteredChats = chats.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchSearch) return false;
        if (activeFilter === 'Unread') return c.unread > 0;
        if (activeFilter === 'Groups') return c.isGroup;
        if (activeFilter === 'Favourites') return c.pinned;
        return true;
    });

    const pinnedChats = filteredChats.filter(c => c.pinned);
    const unpinnedChats = filteredChats.filter(c => !c.pinned);

    const matchedUsers = searchQuery
        ? allUsers.filter(u =>
            u._id !== currentUser._id &&
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    // ── Context menu ─────────────────────────────────────────────────────────────
    function handleContextMenu(e, chat) {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, chat });
    }

    // ── Chat item ─────────────────────────────────────────────────────────────────
    function ChatItem({ chat, index }) {
        const isActive = activeChat?._id === chat._id;
        
        // Get status text - show online or last seen
        const getStatusText = () => {
            if (chat.typing) {
                return <span className="text-[#25d366] font-medium">typing…</span>;
            }
            if (chat.online) {
                return <span className="text-[#25d366]">online</span>;
            }
            // Show last seen if available
            return chat.lastSeenFormatted || 'offline';
        };
        
        return (
            <motion.div
                key={chat._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                onContextMenu={e => handleContextMenu(e, chat)}
                onClick={() => { onSelectChat?.(chat); onClose?.(); }}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl mx-2 my-0.5 transition-colors relative group
          ${isActive ? 'bg-[#2a3942]' : 'hover:bg-[#202c33]'}`}
            >
                <Avatar name={chat.name} src={chat.avatar} online={chat.online} muted={chat.muted} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-[#e9edef] text-sm truncate flex items-center gap-1">
                            {chat.pinned && <Pin size={11} className="text-[#8696a0] flex-shrink-0" />}
                            {chat.name}
                        </span>
                        <span className={`text-[11px] flex-shrink-0 ${chat.unread > 0 ? 'text-[#25d366]' : 'text-[#8696a0]'}`}>
                            {chat.time}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className="text-[13px] text-[#8696a0] truncate flex items-center gap-1">
                            {!chat.isGroup && !chat.typing && <MsgStatus read={chat.unread === 0} />}
                            {chat.typing ? (
                                <span className="text-[#25d366] font-medium">typing…</span>
                            ) : (
                                <span className="truncate">{chat.lastMessage}</span>
                            )}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {chat.muted && <VolumeX size={12} className="text-[#8696a0]" />}
                            {chat.unread > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-[#25d366] text-[#111b21] text-[11px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none"
                                >
                                    {chat.unread > 99 ? '99+' : chat.unread}
                                </motion.span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hover actions */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-[#202c33] rounded-lg p-1 shadow-lg">
                    <button className="p-1 hover:bg-[#2a3942] rounded text-[#8696a0] hover:text-white transition-colors">
                        <Phone size={13} />
                    </button>
                    <button className="p-1 hover:bg-[#2a3942] rounded text-[#8696a0] hover:text-white transition-colors">
                        <Video size={13} />
                    </button>
                    <button
                        className="p-1 hover:bg-[#2a3942] rounded text-[#8696a0] hover:text-white transition-colors"
                        onClick={e => handleContextMenu(e, chat)}
                    >
                        <ChevronDown size={13} />
                    </button>
                </div>
            </motion.div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[29] lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar panel */}
            <motion.aside
                initial={false}
                animate={{ x: isOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed lg:relative top-0 left-0 h-full z-30 lg:translate-x-0 lg:!transform-none"
                style={{
                    width: 360,
                    maxWidth: '100vw',
                    background: '#111b21',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                {/* ── Header ── */}
                <div className="flex-shrink-0 px-4 pt-4 pb-0" style={{ background: '#202c33' }}>
                    <div className="flex items-center justify-between mb-3">
                        {/* Profile */}
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2.5 cursor-pointer group"
                            onClick={() => fileRef.current?.click()}
                        >
                            <div className="relative">
                                <Avatar name={currentUser.fullName} src={currentUser.profileImage} size={40} />
                                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera size={14} className="text-white" />
                                </div>
                            </div>
                            <span className="text-[#e9edef] font-semibold text-sm hidden sm:block">
                                {currentUser.fullName}
                            </span>
                        </motion.div>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" />

                        {/* Action buttons */}
                        <div className="flex items-center gap-0.5">
                            {[
                                { icon: Users, title: 'Communities' },
                                { icon: MessageCircle, title: 'New chat' },
                                { icon: Bell, title: 'Notifications' },
                                { icon: Edit3, title: 'New chat' },
                            ].map((btn, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.12, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.95 }}
                                    title={btn.title}
                                    className="p-2 rounded-full text-[#aebac1] hover:text-[#e9edef] transition-colors"
                                >
                                    <btn.icon size={20} />
                                </motion.button>
                            ))}

                            {/* More menu */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.12, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowMenu(v => !v)}
                                    className="p-2 rounded-full text-[#aebac1] hover:text-[#e9edef] transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </motion.button>
                                <AnimatePresence>
                                    {showMenu && <DropdownMenu onClose={() => setShowMenu(false)} onLogout={onLogout} />}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <motion.div
                            animate={{ borderColor: searchFocused ? '#25d366' : 'transparent' }}
                            className="flex items-center gap-2 rounded-lg px-3 py-2"
                            style={{ background: '#2a3942', border: '1.5px solid transparent', transition: 'border-color 0.2s' }}
                        >
                            <AnimatePresence mode="wait">
                                {searchFocused ? (
                                    <motion.button
                                        key="back"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        onClick={() => { setSearchQuery(''); setSearchFocused(false); }}
                                        className="text-[#25d366]"
                                    >
                                        <ChevronDown size={18} className="rotate-90" />
                                    </motion.button>
                                ) : (
                                    <motion.span key="search" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Search size={16} className="text-[#8696a0]" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            <input
                                type="text"
                                placeholder="Search or start new chat"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => !searchQuery && setSearchFocused(false)}
                                className="flex-1 bg-transparent text-[#e9edef] placeholder-[#8696a0] text-sm outline-none"
                            />
                            <AnimatePresence>
                                {searchQuery && (
                                    <motion.button
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                        onClick={() => setSearchQuery('')}
                                        className="text-[#8696a0] hover:text-[#e9edef] transition-colors"
                                    >
                                        <X size={15} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 pb-1 overflow-x-auto scrollbar-none">
                        {FILTERS.map(f => (
                            <motion.button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all duration-200
                  ${activeFilter === f
                                        ? 'bg-[#25d366] text-[#111b21]'
                                        : 'bg-[#182229] text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef]'
                                    }`}
                            >
                                {f}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* ── List ── */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a3942]">

                    {/* Search results: users */}
                    <AnimatePresence>
                        {searchQuery && matchedUsers.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <div className="px-4 py-2 text-[11px] font-semibold text-[#8696a0] uppercase tracking-widest">
                                    Contacts on Chatify
                                </div>
                                {matchedUsers.map((u, i) => (
                                    <motion.div
                                        key={u._id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => { onStartChat?.(u); onClose?.(); }}
                                        className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[#202c33] transition-colors"
                                    >
                                        <Avatar name={u.fullName} online={u.status === 'online'} />
                                        <div>
                                            <p className="text-[#e9edef] text-sm font-medium">{u.fullName}</p>
                                            <p className="text-[#8696a0] text-xs">@{u.username} · {u.status}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                <div className="h-px mx-4 my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Pinned chats */}
                    <AnimatePresence>
                        {pinnedChats.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="px-5 py-2 text-[11px] font-semibold text-[#8696a0] uppercase tracking-widest flex items-center gap-1">
                                    <Pin size={11} /> Pinned
                                </div>
                                <AnimatePresence>
                                    {pinnedChats.map((c, i) => <ChatItem key={c._id} chat={c} index={i} />)}
                                </AnimatePresence>
                                <div className="h-px mx-4 my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* All chats */}
                    <AnimatePresence>
                        {unpinnedChats.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {pinnedChats.length > 0 && (
                                    <div className="px-5 py-2 text-[11px] font-semibold text-[#8696a0] uppercase tracking-widest">
                                        All chats
                                    </div>
                                )}
                                <AnimatePresence>
                                    {unpinnedChats.map((c, i) => <ChatItem key={c._id} chat={c} index={i} />)}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty state */}
                    {filteredChats.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center h-64 text-center px-8"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.08, 1] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                style={{ background: 'rgba(37,211,102,0.12)' }}
                            >
                                <MessageCircle size={30} className="text-[#25d366]" />
                            </motion.div>
                            <p className="text-[#e9edef] font-semibold mb-1">
                                {searchQuery ? 'No results found' : 'No conversations'}
                            </p>
                            <p className="text-[#8696a0] text-sm">
                                {searchQuery
                                    ? `Try a different name`
                                    : 'Search for a contact to start chatting'}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* ── FAB ── */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    className="absolute bottom-5 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                    style={{ background: '#25d366', zIndex: 20 }}
                >
                    <MessageCircle size={24} className="text-[#111b21]" />
                </motion.button>
            </motion.aside>

            {/* Context menu */}
            <AnimatePresence>
                {contextMenu && (
                    <>
                        <div className="fixed inset-0 z-[998]" onClick={() => setContextMenu(null)} />
                        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} />
                    </>
                )}
            </AnimatePresence>

            <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 99px; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
        </>
    );
};

export default Sidebar;

// ─── Demo wrapper (remove if integrating into your app) ───────────────────────
export function SidebarDemo() {
    const [isOpen, setIsOpen] = useState(true);
    const [activeChat, setActiveChat] = useState(MOCK_CHATS[0]);

    return (
        <div className="flex h-screen bg-[#0b141a] overflow-hidden">
            {/* Mobile toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 bg-[#25d366] text-[#111b21] p-2 rounded-full shadow-lg"
                onClick={() => setIsOpen(v => !v)}
            >
                <MessageCircle size={20} />
            </button>

            <Sidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                activeChat={activeChat}
                onSelectChat={setActiveChat}
                currentUser={{ fullName: 'You', _id: 'me', profileImage: null }}
            />

            {/* Placeholder main area */}
            <div className="flex-1 flex flex-col items-center justify-center" style={{ background: '#0b141a' }}>
                {activeChat ? (
                    <motion.div
                        key={activeChat._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Avatar name={activeChat.name} size={72} online={activeChat.online} />
                        <p className="text-[#e9edef] font-bold text-lg mt-3">{activeChat.name}</p>
                        <p className="text-[#8696a0] text-sm mt-1">{activeChat.online ? 'Online' : 'Last seen recently'}</p>
                    </motion.div>
                ) : (
                    <p className="text-[#8696a0]">Select a chat to start messaging</p>
                )}
            </div>
        </div>
    );
}