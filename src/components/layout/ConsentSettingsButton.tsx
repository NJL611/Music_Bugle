'use client';

// Reopens Google's consent message (AdSense Privacy & messaging) for EEA/UK/Swiss visitors, or says why there is nothing to open.
// Google's CMP only loads on the registered domain once a European regulations message is published, and only asks those regions.

import { useState } from 'react';

type TcfCallback = (data: { gdprApplies?: boolean; listenerId?: number }, success: boolean) => void;
type TcfApi = (command: string, version: number, callback: TcfCallback, parameter?: unknown) => void;
type Googlefc = { callbackQueue?: unknown[]; showRevocationMessage?: () => void };

export function ConsentSettingsButton({ className }: { className?: string }) {
    const [unavailable, setUnavailable] = useState(false);

    const open = () => {
        const w = window as Window & { googlefc?: Googlefc; __tcfapi?: TcfApi };
        if (!w.__tcfapi) {
            setUnavailable(true);
            return;
        }
        w.__tcfapi('addEventListener', 2, (data, success) => {
            if (data.listenerId !== undefined) w.__tcfapi?.('removeEventListener', 2, () => {}, data.listenerId);
            if (!success || !data.gdprApplies) {
                setUnavailable(true);
                return;
            }
            // Queued because __tcfapi's stub can exist before googlefc itself has finished loading.
            w.googlefc ??= {};
            (w.googlefc.callbackQueue ??= []).push(() => w.googlefc?.showRevocationMessage?.());
        });
    };

    return (
        <>
            <button type="button" onClick={open} className={className}>
                Privacy and cookie settings
            </button>
            {unavailable && (
                <span role="status" className="block mt-3 text-sm text-gray-500">
                    There is nothing to change here. Google&apos;s consent tool only asks visitors in the EEA, the UK and Switzerland. If you are in one of those places, an ad or script blocker may be stopping it from loading.
                </span>
            )}
        </>
    );
}
