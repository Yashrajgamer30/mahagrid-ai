/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Auth & Error Pages (Login, 403 Forbidden, 404 Not Found)
   Cinematic split-layout landing page featuring a streamlined 2-step
   role-based workspace access for Admin, Maintenance Team, and Manager.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Lock,
  Mail,
  ShieldAlert,
  HelpCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  KeyRound,
  Loader2,
  ShieldCheck,
  Wrench,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button, Dialog, useToast } from '@/components/ui';
import { APP_NAME } from '@/lib/constants';
import { Role } from '@/types';
import { EnergyGridBackground } from '@/components/auth/EnergyGridBackground';
import styles from './AuthPages.module.css';

export type PortalType = 'admin' | 'maintenance' | 'manager';

interface PortalConfig {
  id: PortalType;
  title: string;
  badge: string;
  role: Role;
  roleName: string;
  defaultEmail: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  icon: typeof Zap;
  summary: string;
}

const PORTALS: Record<PortalType, PortalConfig> = {
  admin: {
    id: 'admin',
    title: 'Admin',
    badge: 'System Control',
    role: Role.ADMIN,
    roleName: 'Chief Grid Engineer',
    defaultEmail: 'admin@mahagrid.gov.in',
    accentColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.45)',
    icon: ShieldCheck,
    summary: 'Central Control, Users, Assets & Digital Twin Simulation',
  },
  maintenance: {
    id: 'maintenance',
    title: 'Maintenance Team',
    badge: 'Field Operations',
    role: Role.FIELD_WORKER,
    roleName: 'Field Squad Lead',
    defaultEmail: 'maintenance@mahagrid.gov.in',
    accentColor: '#D45C3D',
    accentBg: 'rgba(212, 92, 61, 0.14)',
    accentBorder: 'rgba(212, 92, 61, 0.45)',
    icon: Wrench,
    summary: 'Assigned Work Orders, Fault Queue, Testing & Restoration',
  },
  manager: {
    id: 'manager',
    title: 'Manager',
    badge: 'Regional Oversight',
    role: Role.MANAGER,
    roleName: 'Regional Shift In-Charge',
    defaultEmail: 'manager@mahagrid.gov.in',
    accentColor: '#3b82f6',
    accentBg: 'rgba(59, 130, 246, 0.14)',
    accentBorder: 'rgba(59, 130, 246, 0.45)',
    icon: BarChart3,
    summary: '8 Regional Circles, Outage Severity, Health & Approvals',
  },
};

/* ── Login Page ─────────────────────────────────────────── */
export function LoginPage() {
  const navigate = useNavigate();
  const { login, checkSession } = useAuth();
  const { addToast } = useToast();
  const prefersReduced = useReducedMotion();

  // Step 1: 'select-role' | Step 2: 'login'
  const [step, setStep] = useState<'select-role' | 'login'>('select-role');
  const [selectedPortal, setSelectedPortal] = useState<PortalType>('admin');

  // Form State
  const [email, setEmail] = useState(PORTALS['admin'].defaultEmail);
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Switch Selected Role
  const handleSelectRole = (portalId: PortalType) => {
    setSelectedPortal(portalId);
    setEmail(PORTALS[portalId].defaultEmail);
    setEmailError(null);
    setPasswordError(null);
    setErrorMessage(null);
  };

  // Step Transition
  const handleContinueToLogin = () => {
    setErrorMessage(null);
    setEmailError(null);
    setPasswordError(null);
    setStep('login');
  };

  const handleBackToRoleSelection = () => {
    setErrorMessage(null);
    setStep('select-role');
  };

  // Launch Simulated Demo Session
  const handleSimulatedLaunch = async (portalId?: PortalType) => {
    const target = PORTALS[portalId || selectedPortal];
    const demoUser = {
      id: `usr-demo-${target.id}`,
      email: target.defaultEmail,
      name: `Officer ${target.roleName}`,
      role: target.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('mahagrid_user', JSON.stringify(demoUser));
    if (rememberMe) {
      localStorage.setItem('mahagrid_remember_me', 'true');
    }
    window.dispatchEvent(new Event('storage'));
    await checkSession();

    addToast({
      type: 'info',
      title: `${target.title} Workspace (Simulated)`,
      message: `Launched demo session as ${target.roleName}. Maharashtra digital twin active.`,
    });

    if (target.id === 'maintenance') {
      navigate('/maintenance');
    } else {
      navigate('/dashboard');
    }
  };

  // Real backend submission with validation
  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!email.trim()) {
      setEmailError('Officer email or Work ID is required');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid official email address');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Security passcode is required');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('mahagrid_remember_me', 'true');
      }
      addToast({
        type: 'success',
        title: 'Authenticated',
        message: 'Connected successfully via backend session.',
      });
      if (selectedPortal === 'maintenance') {
        navigate('/maintenance');
      } else {
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Backend Grid API (http://localhost:3001) is offline. Launch simulated demo mode to evaluate the complete Maharashtra digital twin.';
      setErrorMessage(msg);
      addToast({
        type: 'warning',
        title: 'Backend Offline',
        message: 'Live REST API not responding. Demo mode is fully operational.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    const target = PORTALS[selectedPortal];
    setEmail(target.defaultEmail);
    setPassword('Demo@123');
    setEmailError(null);
    setPasswordError(null);
    addToast({
      type: 'info',
      title: 'Credentials Prefilled',
      message: `Loaded credentials for ${target.title}.`,
    });
  };

  const currentPortalConfig = PORTALS[selectedPortal];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.45,
        staggerChildren: prefersReduced ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.35 },
    },
  };

  const stepCardVariants = {
    initial: { opacity: 0, x: prefersReduced ? 0 : 12 },
    animate: { opacity: 1, x: 0, transition: { duration: prefersReduced ? 0 : 0.28 } },
    exit: { opacity: 0, x: prefersReduced ? 0 : -12, transition: { duration: prefersReduced ? 0 : 0.2 } },
  };

  return (
    <div className={styles.authWrapper}>
      <EnergyGridBackground />

      <motion.div
        className={styles.splitLayout}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── LEFT SHOWCASE: Brand & Infrastructure ── */}
        <motion.div className={styles.leftShowcase} variants={itemVariants}>
          {/* Logo & Headline */}
          <div className={styles.brandLockup}>
            <div className={styles.logoBadge} aria-hidden="true">
              <Zap size={26} className={styles.zapIcon} />
              <div className={styles.logoGlowRing} />
            </div>
            <div className={styles.brandTextCol}>
              <div className={styles.authTitle}>{APP_NAME}</div>
              <div className={styles.brandTagline}>SMART GRID DIGITAL TWIN</div>
            </div>
          </div>

          <div className={styles.headlineBlock}>
            <h1 className={styles.heroHeadline}>Smarter Grid. Safer Tomorrow.</h1>
            <p className={styles.heroSubtitle}>
              Physics-informed digital twin and SCADA intelligence platform for Maharashtra state electrical distribution.
            </p>
          </div>

          {/* At Most Three Compact Feature Highlights */}
          <div className={styles.featureHighlights}>
            <div className={styles.featurePill}>
              <div className={styles.featureDot} style={{ background: '#10b981' }} />
              <div className={styles.featureText}>
                <strong>Real-Time Digital Twin:</strong> 8 regional SLDC nodes & 765kV/400kV corridor telemetry.
              </div>
            </div>

            <div className={styles.featurePill}>
              <div className={styles.featureDot} style={{ background: '#D45C3D' }} />
              <div className={styles.featureText}>
                <strong>Automated Fault Localization:</strong> Millisecond distance protection & rapid crew dispatch.
              </div>
            </div>

            <div className={styles.featurePill}>
              <div className={styles.featureDot} style={{ background: '#3b82f6' }} />
              <div className={styles.featureText}>
                <strong>Role-Based Operational Command:</strong> Granular authority for Admin, Field, & Management.
              </div>
            </div>
          </div>

          {/* Live Telemetry Pill */}
          <div className={styles.telemetryPill} role="status" aria-label="Grid Status">
            <span className={styles.pulseDot} aria-hidden="true" />
            <span className={styles.telemetryLabel}>GRID FREQ:</span>
            <strong className={styles.telemetryValue}>50.02 Hz</strong>
            <span className={styles.telemetryDivider}>•</span>
            <span className={styles.telemetryLabel}>SLDC KALWA:</span>
            <strong className={styles.telemetryValue}>SYNCHRONIZED</strong>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: Compact Two-Step Access Panel ── */}
        <motion.div className={styles.rightHub} variants={itemVariants}>
          <div className={styles.authCard}>
            <AnimatePresence mode="wait">
              {step === 'select-role' ? (
                /* ── STEP 1: CHOOSE WORKSPACE ── */
                <motion.div
                  key="step-select-role"
                  variants={stepCardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={styles.stepContent}
                >
                  <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Choose your workspace</h2>
                    <p className={styles.cardSubtitle}>
                      Select your role to access designated operational tools and permissions.
                    </p>
                  </div>

                  {/* Three Role Cards */}
                  <div className={styles.roleCardsGroup} role="radiogroup" aria-label="Operational Role">
                    {/* Admin */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPortal === 'admin'}
                      className={`${styles.roleCard} ${selectedPortal === 'admin' ? styles.roleCardActiveAdmin : ''}`}
                      onClick={() => handleSelectRole('admin')}
                    >
                      <div className={styles.roleCardLeft}>
                        <div className={`${styles.roleIconBox} ${styles.iconBoxAdmin}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div className={styles.roleCardInfo}>
                          <div className={styles.roleCardTitleRow}>
                            <span className={styles.roleName}>Admin</span>
                            <span className={styles.roleBadge} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
                              System Control
                            </span>
                          </div>
                          <span className={styles.roleSummary}>Central Control, Users, Assets & Digital Twin Simulation</span>
                        </div>
                      </div>
                      <div className={styles.roleRadioIndicator}>
                        {selectedPortal === 'admin' && <div className={styles.activeDot} style={{ background: '#10b981' }} />}
                      </div>
                    </button>

                    {/* Maintenance Team */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPortal === 'maintenance'}
                      className={`${styles.roleCard} ${selectedPortal === 'maintenance' ? styles.roleCardActiveMaintenance : ''}`}
                      onClick={() => handleSelectRole('maintenance')}
                    >
                      <div className={styles.roleCardLeft}>
                        <div className={`${styles.roleIconBox} ${styles.iconBoxMaintenance}`}>
                          <Wrench size={19} />
                        </div>
                        <div className={styles.roleCardInfo}>
                          <div className={styles.roleCardTitleRow}>
                            <span className={styles.roleName}>Maintenance Team</span>
                            <span className={styles.roleBadge} style={{ color: '#D45C3D', background: 'rgba(212, 92, 61, 0.14)' }}>
                              Field Dispatch
                            </span>
                          </div>
                          <span className={styles.roleSummary}>Assigned Work Orders, Fault Queue, Testing & Restoration</span>
                        </div>
                      </div>
                      <div className={styles.roleRadioIndicator}>
                        {selectedPortal === 'maintenance' && <div className={styles.activeDot} style={{ background: '#D45C3D' }} />}
                      </div>
                    </button>

                    {/* Manager */}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedPortal === 'manager'}
                      className={`${styles.roleCard} ${selectedPortal === 'manager' ? styles.roleCardActiveManager : ''}`}
                      onClick={() => handleSelectRole('manager')}
                    >
                      <div className={styles.roleCardLeft}>
                        <div className={`${styles.roleIconBox} ${styles.iconBoxManager}`}>
                          <BarChart3 size={19} />
                        </div>
                        <div className={styles.roleCardInfo}>
                          <div className={styles.roleCardTitleRow}>
                            <span className={styles.roleName}>Manager</span>
                            <span className={styles.roleBadge} style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.14)' }}>
                              Regional Oversight
                            </span>
                          </div>
                          <span className={styles.roleSummary}>8 Regional Circles, Outage Severity, Health & Approvals</span>
                        </div>
                      </div>
                      <div className={styles.roleRadioIndicator}>
                        {selectedPortal === 'manager' && <div className={styles.activeDot} style={{ background: '#3b82f6' }} />}
                      </div>
                    </button>
                  </div>

                  {/* Primary Continue Button */}
                  <div className={styles.actionBlock}>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleContinueToLogin}
                      rightIcon={<ArrowRight size={16} />}
                      style={{
                        backgroundColor: currentPortalConfig.accentColor,
                        borderColor: currentPortalConfig.accentColor,
                      }}
                    >
                      Continue as {currentPortalConfig.title}
                    </Button>

                    {/* Secondary Direct Simulated Demo Launch */}
                    <button
                      type="button"
                      className={styles.secondaryDemoLink}
                      onClick={() => handleSimulatedLaunch(selectedPortal)}
                    >
                      <Sparkles size={14} className={styles.sparkleIcon} />
                      <span>Explore Demo Mode directly (Simulated)</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── STEP 2: DEDICATED ROLE LOGIN ── */
                <motion.div
                  key="step-login"
                  variants={stepCardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={styles.stepContent}
                >
                  {/* Top Bar with Back Button & Selected Role Badge */}
                  <div className={styles.stepTwoHeader}>
                    <button
                      type="button"
                      onClick={handleBackToRoleSelection}
                      className={styles.backButton}
                      aria-label="Back to role selection"
                    >
                      <ArrowLeft size={15} />
                      <span>Back to Roles</span>
                    </button>

                    <div
                      className={styles.selectedRolePill}
                      style={{
                        color: currentPortalConfig.accentColor,
                        backgroundColor: currentPortalConfig.accentBg,
                        borderColor: currentPortalConfig.accentBorder,
                      }}
                    >
                      <currentPortalConfig.icon size={13} />
                      <span>{currentPortalConfig.title} • {currentPortalConfig.badge}</span>
                    </div>
                  </div>

                  {/* Backend Offline / Error Alert */}
                  {errorMessage && (
                    <div className={styles.errorAlert} role="alert">
                      <div className={styles.errorRow}>
                        <AlertTriangle size={15} className={styles.alertIcon} />
                        <div className={styles.errorText}>{errorMessage}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimulatedLaunch(selectedPortal)}
                        className={styles.launchDemoFromErrorBtn}
                      >
                        Launch Simulated Demo Mode Instead →
                      </button>
                    </div>
                  )}

                  {/* Sign In Form */}
                  <form onSubmit={handleRealLogin} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="login-email" className={styles.inputLabel}>
                        Officer Email / Work ID
                      </label>
                      <div className={`${styles.inputContainer} ${emailError ? styles.inputError : ''}`}>
                        <Mail size={16} className={styles.inputIcon} />
                        <input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          placeholder="e.g. officer@mahagrid.gov.in"
                          className={styles.darkInput}
                          autoComplete="username"
                          disabled={isLoading}
                        />
                      </div>
                      {emailError && <span className={styles.fieldErrorText}>{emailError}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="login-password" className={styles.inputLabel}>
                        Security Passcode
                      </label>
                      <div className={`${styles.inputContainer} ${passwordError ? styles.inputError : ''}`}>
                        <Lock size={16} className={styles.inputIcon} />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError(null);
                          }}
                          placeholder="••••••••••••"
                          className={styles.darkInput}
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className={styles.eyeToggleBtn}
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {passwordError && <span className={styles.fieldErrorText}>{passwordError}</span>}
                    </div>

                    {/* Options Row: Remember Me & Forgot Password */}
                    <div className={styles.optionsRow}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={styles.checkbox}
                        />
                        <span>Remember terminal</span>
                      </label>

                      <button
                        type="button"
                        className={styles.forgotBtn}
                        onClick={() => setIsForgotOpen(true)}
                      >
                        Forgot passcode?
                      </button>
                    </div>

                    {/* Primary Sign In Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      fullWidth
                      leftIcon={isLoading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                      style={{
                        backgroundColor: currentPortalConfig.accentColor,
                        borderColor: currentPortalConfig.accentColor,
                      }}
                    >
                      {isLoading ? 'Connecting to SCADA...' : `Sign In to ${currentPortalConfig.title}`}
                    </Button>

                    {/* Secondary Explore Demo Mode Option */}
                    <button
                      type="button"
                      className={styles.demoSecondaryBtn}
                      onClick={() => handleSimulatedLaunch(selectedPortal)}
                    >
                      <Sparkles size={14} />
                      <span>Explore Demo Mode (Simulated Session)</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Forgot Passcode Protocol Modal ── */}
      <Dialog
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Terminal Passcode Protocol"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, width: '100%' }}>
            <Button variant="secondary" onClick={() => setIsForgotOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 size={16} />}
              onClick={() => {
                handleFillDemoCredentials();
                setIsForgotOpen(false);
              }}
            >
              Apply Test Credentials
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 'var(--space-3)', background: 'var(--warm-gray-100)', borderRadius: 'var(--radius-md)' }}>
            <KeyRound size={22} color="var(--forest-green)" style={{ flexShrink: 0 }} />
            <div>
              <strong>LDAP & SCADA Session Security</strong>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--warm-gray-600)' }}>
                Production accounts require SLDC Duty Engineer credential reset authorization.
              </div>
            </div>
          </div>
          <p>
            For this <strong>ENTC Smart Grid Engineering Demonstration</strong>, you do not need a reset token. Click <strong>Apply Test Credentials</strong> to populate the active passcode for {currentPortalConfig.title}.
          </p>
        </div>
      </Dialog>
    </div>
  );
}

/* ── 403 Forbidden ───────────────────────────────────────── */
export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.authWrapper}>
      <EnergyGridBackground />
      <div className={styles.errorContainer}>
        <div className={`${styles.authCard} ${styles.errorCard}`}>
          <div className={styles.logoBadge} style={{ background: 'var(--burnt-orange)' }}>
            <ShieldAlert size={28} />
          </div>
          <div className={`${styles.errorCode} ${styles.errorCodeWarning}`}>403</div>
          <h1 className={styles.errorTitle}>Access Restricted</h1>
          <p className={styles.errorDesc}>
            Your current account role does not have authorization to view this module. Role permissions are enforced according to smart-grid operational guidelines.
          </p>
          <div className={styles.actionsRow}>
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 404 Not Found ───────────────────────────────────────── */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.authWrapper}>
      <EnergyGridBackground />
      <div className={styles.errorContainer}>
        <div className={`${styles.authCard} ${styles.errorCard}`}>
          <div className={styles.logoBadge} style={{ background: 'var(--warm-gray-600)' }}>
            <HelpCircle size={28} />
          </div>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.errorTitle}>Route Not Found</h1>
          <p className={styles.errorDesc}>
            The requested grid endpoint or module route does not exist in the MahaGrid AI digital twin navigation tree.
          </p>
          <div className={styles.actionsRow}>
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
