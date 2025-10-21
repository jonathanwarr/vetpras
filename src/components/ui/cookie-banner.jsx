'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const COOKIE_CONSENT_KEY = 'vetpras_cookie_consent';
const COOKIE_CONSENT_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      try {
        const { preferences: savedPreferences, timestamp } = JSON.parse(consent);
        const isExpired = Date.now() - timestamp > COOKIE_CONSENT_EXPIRY;

        if (isExpired) {
          setShowBanner(true);
        } else {
          setPreferences(savedPreferences);
          applyConsent(savedPreferences);
        }
      } catch (error) {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (prefs) => {
    const consent = {
      preferences: prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    applyConsent(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const applyConsent = (prefs) => {
    // Dispatch custom event for analytics scripts to listen to
    window.dispatchEvent(
      new CustomEvent('cookie-consent-updated', {
        detail: prefs,
      })
    );

    // Google Analytics
    if (prefs.analytics) {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted',
      });
    } else {
      window.gtag?.('consent', 'update', {
        analytics_storage: 'denied',
      });
    }

    // Meta Pixel
    if (prefs.advertising) {
      window.fbq?.('consent', 'grant');
    } else {
      window.fbq?.('consent', 'revoke');
    }

    // Hotjar - disable if analytics not granted
    if (!prefs.analytics && window.hj) {
      window.hj('stateChange', 'opted-out');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      advertising: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleTogglePreference = (key) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowBanner(false)} />

      {/* Banner */}
      <div className="relative mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-xl ring-1 ring-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Cookie Preferences</h2>
              <p className="mt-2 text-sm text-gray-600">
                We use cookies to improve your experience and understand how visitors interact with
                our site. You can manage your preferences below.
              </p>

              {showPreferences && (
                <div className="mt-4 space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Necessary Cookies
                        </h3>
                        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          Always Active
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Required for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Analytics Cookies</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Google Analytics and Hotjar help us understand how visitors use our site.
                        IPs are anonymized.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        preferences.analytics ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Advertising Cookies */}
                  <div className="flex items-start justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Advertising Cookies</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Meta Pixel helps us measure advertising effectiveness on Facebook and
                        Instagram.
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePreference('advertising')}
                      className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                        preferences.advertising ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.advertising ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className="ml-4 text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            {!showPreferences ? (
              <>
                <button
                  onClick={handleAcceptAll}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <Cog6ToothIcon className="mr-2 h-4 w-4" />
                  Customize
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSavePreferences}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
