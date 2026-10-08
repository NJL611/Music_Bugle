'use client';

// EEA/UK/Swiss consent controls: rendered only once Google's CMP reports that GDPR applies to this visitor, nothing anywhere else.
// Polls for __tcfapi because adsbygoogle.js injects the CMP late, and never at all outside its regions or off the registered domain.

import { useEffect, useState } from 'react';

type TcfCallback = (data: { gdprApplies?: boolean; listenerId?: number }, success: boolean) => void;
type TcfApi = (command: string, version: number, callback: TcfCallback, parameter?: unknown) => void;
type Googlefc = { callbackQueue?: unknown[]; showRevocationMessage?: () => void };
type ConsentWindow = Window & { googlefc?: Googlefc; __tcfapi?: TcfApi };

const POLL_MS = 250;
const GIVE_UP_MS = 10_000;

export function ConsentSettings({ buttonClassName }: { buttonClassName?: string }) {
    const [applies, setApplies] = useState(false);

    useEffect(() => {
        const w = window as ConsentWindow;
        const started = Date.now();
        let listenerId: number | undefined;
        const timer = setInterval(() => {
            if (!w.__tcfapi) {
                if (Date.now() - started > GIVE_UP_MS) clearInterval(timer);
                return;
            }
            clearInterval(timer);
            w.__tcfapi('addEventListener', 2, (data, success) => {
                listenerId = data.listenerId;
                if (success) setApplies(data.gdprApplies === true);
            });
        }, POLL_MS);

        return () => {
            clearInterval(timer);
            if (listenerId !== undefined) w.__tcfapi?.('removeEventListener', 2, () => {}, listenerId);
        };
    }, []);

    if (!applies) return null;

    const open = () => {
        const w = window as ConsentWindow;
        // Queued because __tcfapi can exist before googlefc itself has finished loading.
        w.googlefc ??= {};
        (w.googlefc.callbackQueue ??= []).push(() => w.googlefc?.showRevocationMessage?.());
    };

    return (
        <>
            <p className="mb-4">
                Because you are in the European Economic Area, the United Kingdom or Switzerland, we ask for your consent before we or our partners use cookies for analytics and advertising. You can review or change your choice at any time.
            </p>
            <p className="mb-8">
                <button type="button" onClick={open} className={buttonClassName}>
                    Privacy and cookie settings
                </button>
            </p>
        </>
    );
}
