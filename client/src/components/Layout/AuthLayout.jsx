import React from 'react';
import { Link } from 'react-router-dom';
import authBg from '../../assets/auth_bg.png';
import { Shield } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="font-outfit min-h-screen w-full flex bg-[var(--bg)] text-[var(--ink)] overflow-hidden">
            {/* Left Side: Premium Image (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-[#0A0D14]">
                <img
                    src={authBg}
                    alt="Avaya Background"
                    className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-60 mix-blend-luminosity grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/50 to-transparent"></div>

                {/* Branding Overlay */}
                <div className="animate-slide-up-stagger relative z-10 flex flex-col items-center justify-center h-full w-full px-10 lg:px-14 xl:px-20 pb-10">
                    <div className="w-full max-w-md flex flex-col items-center text-center">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#CBA052]/10 flex items-center justify-center border border-[#CBA052]/20">
                                <Shield className="text-[#CBA052]" size={30} strokeWidth={2} />
                            </div>
                            <h1 className="text-[2.5rem] font-bold tracking-tight text-white">Avaya</h1>
                        </div>
                        
                        {/* Main Text Content */}
                        <div className="mt-12 xl:mt-14 w-full">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#CBA052]"></div>
                                <span className="text-[#CBA052] text-sm font-bold tracking-[0.25em] uppercase">Seamless Security Platform</span>
                            </div>
                            
                            <h2 className="text-[3.5rem] xl:text-[4.5rem] font-bold mb-8 leading-[1.05] font-garamond text-white">
                                Seamless<br />Security,<br />
                                <span className="text-[#CBA052] italic font-serif tracking-normal block mt-1">Ultimate<br />Confidence.</span>
                            </h2>
                            
                            <p className="text-[1.05rem] text-gray-300 leading-relaxed font-light mx-auto max-w-sm">
                                Experience the next generation of safe navigation and real-time security alerts. Join the elite network of travelers today.
                            </p>
                        </div>
                    </div>
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
