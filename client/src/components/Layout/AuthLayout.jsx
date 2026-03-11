import React from 'react';
import { Link } from 'react-router-dom';
import authBg from '../../assets/auth_bg.png';
import { Shield } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="font-outfit min-h-screen w-full flex bg-[var(--bg)] text-[var(--ink)] overflow-hidden">
            {/* Left Side: Premium Image (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src={authBg}
                    alt="Avaya Background"
                    className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-65"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[#fdf9f3]/80 to-transparent"></div>

                {/* Branding Overlay */}
                <div className="animate-slide-up-stagger relative z-10 flex flex-col pt-16 pl-16 xl:pl-24 h-full">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[var(--gold-light)] flex items-center justify-center shadow-[0_0_20px_rgba(200,155,60,0.2)]">
                            <Shield className="text-[var(--gold)]" size={26} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl font-extrabold flex tracking-tight font-garamond text-[var(--ink)]">Avaya</h1>
                    </div>
                    <h2 className="text-[3.5rem] font-bold mt-20 mb-6 leading-[1.1] font-garamond text-[var(--ink)]">
                        Seamless Security,<br />
                        <span className="text-[var(--gold)] italic font-serif">Ultimate Confidence.</span>
                    </h2>
                    <p className="text-lg text-[var(--muted)] max-w-md leading-relaxed font-light">
                        Experience the next generation of safe navigation and real-time security alerts. Join the elite network of travelers today.
                    </p>
                </div>
            </div>

            {/* Right Side: Auth Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:p-12 relative min-h-screen overflow-y-auto bg-[var(--bg)]">
                <div className="animate-fade-in w-full max-w-lg flex flex-col items-center">

                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-2 mb-10 mt-6 text-inherit no-underline">
                        <div className="w-10 h-10 rounded-xl bg-[var(--gold-light)] flex items-center justify-center">
                            <Shield className="text-[var(--gold)]" size={22} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-bold font-garamond text-[var(--ink)]">Avaya</h1>
                    </Link>

                    {/* Custom Header */}
                    <div className="text-center w-full mb-10">
                        <h3 className="text-4xl font-bold mb-3 text-[var(--ink)] font-garamond">{title}</h3>
                        <p className="text-[var(--muted)] text-[15px] font-light">{subtitle}</p>
                    </div>

                    {/* Clerk Form Container */}
                    <div className="w-full flex justify-center auth-container hover-lift" style={{
                         backgroundColor: '#ffffff',
                         padding: '24px',
                         borderRadius: '24px',
                         boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                         border: '1px solid var(--border)'
                    }}>
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center text-[13px] text-[var(--muted)] opacity-80">
                        <p>© {new Date().getFullYear()} Avaya Systems. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
