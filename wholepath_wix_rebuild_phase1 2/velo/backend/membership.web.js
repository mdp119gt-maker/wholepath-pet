// backend/membership.web.js
import { webMethod, Permissions } from 'wix-web-module';
import { currentMember } from 'wix-members-backend';
import { orders } from 'wix-pricing-plans-backend';

export const getMembershipState = webMethod(Permissions.SiteMember, async () => {
  const member = await currentMember.getMember();
  const memberOrders = await orders.listCurrentMemberOrders();
  const paid = (memberOrders || []).some((order) => {
    const name = order.planName || order.plan?.name || '';
    const status = String(order.status || '').toUpperCase();
    const inactive = ['CANCELED', 'CANCELLED', 'EXPIRED', 'PAUSED'].includes(status);
    return name.includes('WholePath Membership') && !inactive;
  });

  return { memberId: member?._id, paid };
});
