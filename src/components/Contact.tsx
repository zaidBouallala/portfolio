import { useState, useRef, useEffect } from 'react';
import {
    Mail, Github, Linkedin, Send, MessageCircle,
    CheckCircle2, Loader2, AlertCircle, MapPin, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { siteConfig } from '../data/site';
import { useDir } from '../hooks/useDir';

/* ─── EmailJS config ──────────────────────────────────────────────────────── */
const EMAILJS_SERVICE_ID = 'service_63a7m7o';
const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'template_r18zmhe'; // Portfolio Contact Notification
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_zzq3mw5';    // Portfolio Auto Reply
const EMAILJS_PUBLIC_KEY = '2VsMi5MOg77M9kNIV';

/* ─── Types ───────────────────────────────────────────────────────────────── */
type FormStatus = 'idle' | 'sending' | 'success' | 'error';

interface FormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface EmailTemplateParams extends Record<string, unknown> {
    name: string;
    email: string;
    subject: string;
    message: string;
    from_name: string;
    from_email: string;
    reply_to: string;
    to_email: string;
    to_name: string;
}

/* ─── Animated floating particles ────────────────────────────────────────── */
const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            ...style,
        }}
    />
);

/* ─── Contact card data ───────────────────────────────────────────────────── */
const contactCards = [
    {
        key: 'email',
        href: `mailto:${siteConfig.email}`,
        icon: Mail,
        label: 'Email',
        value: siteConfig.email,
        color: 'blue',
        gradient: 'from-blue-500/10 to-blue-600/5',
        ring: 'group-hover:ring-blue-500/30',
        iconBg: 'bg-blue-500/10 text-blue-400',
        external: false,
    },
    {
        key: 'linkedin',
        href: siteConfig.social.linkedin,
        icon: Linkedin,
        label: 'LinkedIn',
        value: '/in/bouallala-zaid',
        color: 'blue',
        gradient: 'from-blue-600/10 to-indigo-600/5',
        ring: 'group-hover:ring-blue-400/30',
        iconBg: 'bg-blue-600/10 text-blue-400',
        external: true,
    },
    {
        key: 'github',
        href: siteConfig.social.github,
        icon: Github,
        label: 'GitHub',
        value: '/zaidBouallala',
        color: 'slate',
        gradient: 'from-slate-500/10 to-slate-600/5',
        ring: 'group-hover:ring-slate-400/30',
        iconBg: 'bg-slate-500/10 text-slate-300',
        external: true,
    },
    {
        key: 'telegram',
        href: siteConfig.social.telegram,
        icon: Send,
        label: 'Telegram',
        value: '@zaidBouallala',
        color: 'sky',
        gradient: 'from-sky-500/10 to-sky-600/5',
        ring: 'group-hover:ring-sky-500/30',
        iconBg: 'bg-sky-500/10 text-sky-400',
        external: true,
    },
    {
        key: 'whatsapp',
        href: siteConfig.social.whatsapp,
        icon: MessageCircle,
        label: 'WhatsApp',
        value: '+212 602 819 259',
        color: 'green',
        gradient: 'from-green-500/10 to-emerald-600/5',
        ring: 'group-hover:ring-green-500/30',
        iconBg: 'bg-green-500/10 text-green-400',
        external: true,
    },
];

/* ─── Main Component ──────────────────────────────────────────────────────── */
const Contact = () => {
    const { t } = useTranslation();
    const { isRTL } = useDir();

    const formRef = useRef<HTMLFormElement>(null);
    const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<FormStatus>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    /* Auto-clear success/error after 6 s */
    useEffect(() => {
        if (status === 'success' || status === 'error') {
            const timer = setTimeout(() => setStatus('idle'), 6000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'sending') return;

        // Basic validation
        if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
            return;
        }

        setStatus('sending');

        const templateParams: EmailTemplateParams = {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
            from_name: form.name,
            from_email: form.email,
            reply_to: form.email,
            to_email: form.email,
            to_name: form.name,
        };

        try {
            // 1. Send Auto Reply to visitor
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_AUTOREPLY_TEMPLATE_ID, // "template_r18zmhe"
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            // 2. Send Notification to portfolio owner (zaidbouallala.official@gmail.com)
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_NOTIFICATION_TEMPLATE_ID, // "template_zzq3mw5"
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Failed to send contact email via EmailJS:', error);
            setStatus('error');
        }
    };

    /* ── Animation variants ─────────────────────────────────────────────── */
    const sectionVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    };

    const inputBase =
        'w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 outline-none ' +
        'bg-white/5 dark:bg-white/[0.03] ' +
        'text-[var(--text-primary)] placeholder-[var(--text-tertiary)] ';

    const inputBorder = (field: string) =>
        focusedField === field
            ? 'border-blue-500/60 shadow-[0_0_0_3px_rgba(59,130,246,0.12),0_0_16px_rgba(59,130,246,0.08)]'
            : 'border-[var(--border-primary)] hover:border-blue-400/30';

    return (
        <section
            id="contact"
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative py-20 md:py-32 overflow-hidden transition-colors duration-300"
        >
            {/* ── Ambient background orbs ── */}
            <FloatingOrb style={{ width: 480, height: 480, top: -120, left: -180, filter: 'blur(80px)', opacity: 0.6 }} />
            <FloatingOrb style={{ width: 360, height: 360, bottom: -80, right: -100, filter: 'blur(80px)', opacity: 0.5 }} />
            <FloatingOrb style={{ width: 200, height: 200, top: '40%', left: '40%', filter: 'blur(60px)', opacity: 0.3 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Section Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16 md:mb-20 space-y-3"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                            {t('contact.label')}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        {t('contact.title')}
                    </h2>
                    <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-medium leading-relaxed">
                        {t('contact.description')}
                    </p>
                </motion.div>

                {/* ── Two-column layout ── */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 xl:gap-12 items-start"
                >

                    {/* ══ LEFT — Contact Form ══════════════════════════════ */}
                    <motion.div variants={itemVariants}>
                        <div className="relative rounded-2xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-md shadow-2xl">
                            {/* Glowing top border line */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-transparent to-indigo-500/[0.02] pointer-events-none" />

                            <div className="relative p-6 md:p-8">
                                {/* Form header */}
                                <div className="mb-7">
                                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-1">
                                        {t('contact.form.title')}
                                    </h3>
                                    <p className="text-sm text-[var(--text-tertiary)] font-medium">
                                        {t('contact.form.subtitle')}
                                    </p>
                                </div>

                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name + Email row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="contact-name" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                                {t('contact.form.name')}
                                            </label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                type="text"
                                                required
                                                placeholder={t('contact.form.namePlaceholder')}
                                                value={form.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`${inputBase} ${inputBorder('name')}`}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="contact-email" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                                {t('contact.form.email')}
                                            </label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder={t('contact.form.emailPlaceholder')}
                                                value={form.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`${inputBase} ${inputBorder('email')}`}
                                            />
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-subject" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                            {t('contact.form.subject')}
                                        </label>
                                        <input
                                            id="contact-subject"
                                            name="subject"
                                            type="text"
                                            required
                                            placeholder={t('contact.form.subjectPlaceholder')}
                                            value={form.subject}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('subject')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${inputBase} ${inputBorder('subject')}`}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="contact-message" className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                                            {t('contact.form.message')}
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            name="message"
                                            rows={5}
                                            required
                                            placeholder={t('contact.form.messagePlaceholder')}
                                            value={form.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`${inputBase} ${inputBorder('message')} resize-none`}
                                        />
                                    </div>

                                    {/* Submit button */}
                                    <motion.button
                                        id="contact-submit"
                                        type="submit"
                                        disabled={status === 'sending'}
                                        whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                                        whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
                                        className="relative w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #3b82f6 100%)',
                                            boxShadow: '0 4px 24px rgba(37,99,235,0.35), 0 0 0 1px rgba(59,130,246,0.2)',
                                        }}
                                    >
                                        {/* Shimmer sweep on hover */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                                        <span className="relative flex items-center justify-center gap-2">
                                            {status === 'sending' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {t('contact.form.sending')}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    {t('contact.form.send')}
                                                </>
                                            )}
                                        </span>
                                    </motion.button>

                                    {/* Status messages */}
                                    <AnimatePresence>
                                        {status === 'success' && (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-400">
                                                        {t('contact.form.successTitle')}
                                                    </p>
                                                    <p className="text-xs text-emerald-400/80 mt-0.5">
                                                        {t('contact.form.successMessage')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                        {status === 'error' && (
                                            <motion.div
                                                key="error"
                                                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm"
                                            >
                                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold text-red-400">
                                                        {t('contact.form.errorTitle')}
                                                    </p>
                                                    <p className="text-xs text-red-400/80 mt-0.5">
                                                        {t('contact.form.errorMessage')}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>
                        </div>
                    </motion.div>

                    {/* ══ RIGHT — Contact Cards ════════════════════════════ */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-4">
                        {/* Quick info strip */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mb-1">
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-primary)] backdrop-blur-sm">
                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">{t('contact.info.location')}</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Morocco 🇲🇦</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-primary)] backdrop-blur-sm">
                                <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">{t('contact.info.status')}</p>
                                    <p className="text-sm font-bold text-green-400">{t('contact.info.available')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-primary)] backdrop-blur-sm">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">{t('contact.info.response')}</p>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">{t('contact.info.responseTime')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact cards */}
                        {contactCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <motion.a
                                    key={card.key}
                                    href={card.href}
                                    target={card.external ? '_blank' : undefined}
                                    rel={card.external ? 'noopener noreferrer' : undefined}
                                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    id={`contact-card-${card.key}`}
                                    className={`group relative flex items-center gap-4 p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/60 backdrop-blur-sm overflow-hidden cursor-pointer transition-all duration-300 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 ring-1 ring-transparent ${card.ring} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                                >
                                    {/* Hover bg gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    {/* Glowing top edge */}
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Icon */}
                                    <div className={`relative z-10 w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Text */}
                                    <div className="relative z-10 flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{card.label}</p>
                                        <p className="text-xs text-[var(--text-tertiary)] font-medium truncate">{card.value}</p>
                                    </div>

                                    {/* Arrow chevron */}
                                    <div className="relative z-10 w-7 h-7 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-300 flex-shrink-0">
                                        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                        </svg>
                                    </div>
                                </motion.a>
                            );
                        })}

                        {/* Footer note */}
                        <p className="text-center text-xs text-[var(--text-tertiary)] font-medium pt-1">
                            {t('contact.footer')}
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;