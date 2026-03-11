import { useUser, UserButton } from "@clerk/react";

export default function UserProfileMenu() {
    const { user } = useUser();

    if (!user) return null;

    return (
        <div
            className="panel-card animate-fade-in"
            style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 6px 6px 14px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #e8e6e0',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#141414',
                    lineHeight: 1.2
                }}>
                    {user.firstName || user.username}
                </span>
                <span style={{
                    fontSize: '11px',
                    color: '#6b6b6b',
                    fontWeight: 500
                }}>
                    Verified Pro
                </span>
            </div>

            <UserButton
                appearance={{
                    elements: {
                        userButtonAvatarBox: "w-9 h-9 border-2 border-[#e8a020]/30 hover:border-[#e8a020] transition-colors"
                    }
                }}
            />
        </div>
    );
}
