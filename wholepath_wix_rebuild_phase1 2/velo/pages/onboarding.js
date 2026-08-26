// Page: Onboarding
// Captures WholePath member profile AFTER Wix signup/login.
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members-frontend';

let member;
let profileId;

$w.onReady(async function () {
  member = await currentMember.getMember();
  if (!member) {
    authentication.promptLogin()
      .then(() => wixLocation.to('/onboarding'))
      .catch(() => wixLocation.to('/'));
    return;
  }

  $w('#emailDisplay').text = member.loginEmail || member.contactDetails?.emails?.[0] || '';
  const existing = await wixData.query('MemberProfiles').limit(1).find();
  if (existing.items.length) {
    const profile = existing.items[0];
    profileId = profile._id;
    $w('#firstName').value = profile.firstName || '';
    $w('#lastName').value = profile.lastName || '';
    $w('#zip').value = profile.zip || '';
    $w('#state').value = profile.state || '';
    $w('#phone').value = profile.phone || '';
  }

  $w('#saveMemberButton').onClick(saveMemberProfile);
});

async function saveMemberProfile() {
  const firstName = String($w('#firstName').value || '').trim();
  const lastName = String($w('#lastName').value || '').trim();
  const zip = String($w('#zip').value || '').trim();

  if (!firstName || !zip) {
    showStatus('Please enter your first name and ZIP code.');
    return;
  }

  $w('#saveMemberButton').disable();
  showStatus('Saving your free WholePath profile...');

  try {
    const data = {
      title: [firstName, lastName].filter(Boolean).join(' '),
      firstName,
      lastName,
      email: member.loginEmail || '',
      zip,
      state: String($w('#state').value || '').trim(),
      phone: String($w('#phone').value || '').trim(),
      onboardingComplete: true,
    };

    const saved = profileId
      ? await wixData.update('MemberProfiles', { ...data, _id: profileId })
      : await wixData.insert('MemberProfiles', data);

    profileId = saved._id;
    showStatus('Your WholePath Free account is ready. Now add your first pet.');
    setTimeout(() => wixLocation.to('/pet-profile?new=1'), 650);
  } catch (error) {
    console.error('Member profile save failed', error);
    showStatus('We could not save your profile. Please try again.');
    $w('#saveMemberButton').enable();
  }
}

function showStatus(message) {
  $w('#onboardingStatus').text = message;
  $w('#onboardingStatus').show();
}
