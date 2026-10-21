import {NextResponse} from 'next/server';
import {premiumAccess} from '@/lib/premium-access';
import {cancellationBannerEnd} from '@/lib/billing/cancellation-banner';
export const dynamic='force-dynamic';
export async function GET(){
 const access=await premiumAccess();
 const endsAt=access.user&&!access.unavailable?cancellationBannerEnd(access.subscriptions,access.manualAllowed):null;
 return NextResponse.json({endsAt},{headers:{'Cache-Control':'private, no-store'}});
}
