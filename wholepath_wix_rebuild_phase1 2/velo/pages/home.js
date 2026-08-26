// Page: Home
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members-frontend';

$w.onReady(async function () {
  const member = await currentMember.getMember();
  updateHomeUI(Boolean(member));

  $w('#createFreeProfileButton').onClick(() => startMemberFlow());
  $w('#loginButton').onClick(() => startMemberFlow());

  if ($w('#memberDashboardButton')) {
    $w('#memberDashboardButton').onClick(() => routeAuthenticatedMember());
  }
});

function startMemberFlow() {
  const memberLogin = authentication.promptLogin();
  memberLogin
    .then(() => routeAuthenticatedMember())
    .catch(() => {
      $w('#homeStatusText').text = 'Sign in or create your free account whenever you are ready.';
      $w('#homeStatusText').show();
    });
}

async function routeAuthenticatedMember() {
  const member = await currentMember.getMember();
  if (!member) return;

  const profiles = await wixData.query('MemberProfiles').limit(1).find();
  if (profiles.items.length) {
    wixLocation.to('/member-dashboard');
  } else {
    wixLocation.to('/onboarding');
  }
}

function updateHomeUI(isLoggedIn) {
  if ($w('#memberDashboardButton')) {
    isLoggedIn ? $w('#memberDashboardButton').show() : $w('#memberDashboardButton').hide();
  }
}
