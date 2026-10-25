import { lazy, Suspense, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import './App.css'
import { AuthProvider } from './auth/AuthProvider'
import { LanguageProvider, useI18n } from './i18n'
import { StoreProvider } from './store'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import Logo from './components/Logo'
import { FullPageLoader, RequireAuth } from './components/RequireAuth'
import { usePageMeta } from './lib/seo'

const Landing = lazy(() => import('./pages/Landing'))
const PublicProfile = lazy(() => import('./pages/PublicProfile'))
const Enquiry = lazy(() => import('./pages/Enquiry'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const SignIn = lazy(() => import('./pages/SignIn'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Settings = lazy(() => import('./pages/Settings'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function NotFound() {
  const { t } = useI18n()
  usePageMeta({ title: t('Page not found') + ' · MUALink', noindex: true })
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Logo />
      <p className="mt-10 eyebrow">404</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{t('This page is off getting ready.')}</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        {t('The link may have changed, or the profile is no longer active.')}
      </p>
      <Button asChild className="mt-7 rounded-full">
        <Link to="/"><ArrowLeft className="size-4" /> {t('Back to MUALink')}</Link>
      </Button>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <StoreProvider>
          <ScrollToTop />
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/p/:username" element={<PublicProfile />} />
              <Route path="/p/:username/request" element={<Enquiry />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
              <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster position="top-center" richColors closeButton />
        </StoreProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
