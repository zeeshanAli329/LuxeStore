"use client";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UserNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const dropdownRef = useRef(null);
    const lastCountRef = useRef(0);
    const router = useRouter();
    const audioRef = useRef(null);

    // Initialize Audio and Sound Setting
    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/sounds/notify.mp3");
            const savedSound = localStorage.getItem("userSoundEnabled");
            if (savedSound === "true") setSoundEnabled(true);
        }
    }, []);

    const toggleSound = () => {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        localStorage.setItem("userSoundEnabled", newState);
    };

    const fetchNotifications = async () => {
        try {
            const [listRes, countRes] = await Promise.all([
                api.get("/notifications/me?since=" + (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())), // Last 7 days
                api.get("/notifications/me/count")
            ]);

            setNotifications(listRes.data);
            const newCount = countRes.data.count;

            if (newCount > lastCountRef.current && soundEnabled) {
                audioRef.current?.play().catch(err => console.log("Audio play blocked:", err));
            }

            setUnreadCount(newCount);
            lastCountRef.current = newCount;
        } catch (error) {
            console.error("Failed to fetch user notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [soundEnabled]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/me/mark-all-read");
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            lastCountRef.current = 0;
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await api.patch(`/notifications/${notification._id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
                lastCountRef.current = Math.max(0, lastCountRef.current - 1);
            } catch (error) {
                console.error("Failed to mark notification as read", error);
            }
        }

        setIsOpen(false);
        if (notification.type === "ORDER_STATUS_UPDATED" || notification.type === "ORDER_PLACED") {
            router.push("/profile");
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none relative transition-colors transform hover:scale-110 cursor-pointer"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-600 rounded-full border border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                            <button
                                onClick={toggleSound}
                                className={`p-1 rounded-full transition-colors ${soundEnabled ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:bg-gray-200'}`}
                                title={soundEnabled ? "Sound On" : "Sound Off"}
                            >
                                {soundEnabled ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                )}
                            </button>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[10px] cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 text-xs">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-2 ${!notif.isRead ? "bg-blue-50/40" : ""}`}
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? "bg-blue-600" : "bg-transparent"}`} />
                                    <div className="flex-1">
                                        <p className={`text-xs ${!notif.isRead ? "text-gray-900 font-semibold" : "text-gray-600"}`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {formatTime(notif.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
