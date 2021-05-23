import { IconParams } from '@fortawesome/fontawesome-svg-core';

export type UnfontFaParams = Omit<IconParams, 'classes'> & { inlineCss?: boolean };
export function fa(className: string, options?: UnfontFaParams): string;
export const faSpinCss: string;
