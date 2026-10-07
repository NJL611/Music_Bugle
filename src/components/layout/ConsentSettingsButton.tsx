'use client';

// Reopens Google's consent message (AdSense Privacy & messaging) so EEA/UK/Swiss visitors can change or withdraw consent.
// Goes through googlefc's callback queue because the CMP script may not have loaded yet when the button is clicked.

type Googlefc = { callbackQueue?: unknown[]; showRevocationMessage?: () => void };

export function ConsentSettingsButton({ className }: { className?: string }) {
    const open = () => {
        const w = window as Window & { googlefc?: Googlefc };
        w.googlefc ??= {};
        (w.googlefc.callbackQueue ??= []).push(() => w.googlefc?.showRevocationMessage?.());
    };

    return (
        <button type="button" onClick={open} className={className}>
            Privacy and cookie settings
        </button>
    );
}
