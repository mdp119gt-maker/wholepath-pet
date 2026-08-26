// Page: Member Dashboard
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members-frontend';
import { getMembershipState } from 'backend/membership.web';

let memberProfile;

$w.onReady(async function () {
  const member = await currentMember.getMember();
  if (!member) {
    authentication.promptLogin()
      .then(() => wixLocation.to('/member-dashboard'))
      .catch(() => wixLocation.to('/'));
    return;
  }

  const profileResult = await wixData.query('MemberProfiles').limit(1).find();
  if (!profileResult.items.length) {
    wixLocation.to('/onboarding');
    return;
  }

  memberProfile = profileResult.items[0];
  $w('#welcomeText').text = `Welcome, ${memberProfile.firstName || 'there'}`;

  let paid = false;
  try {
    const membership = await getMembershipState();
    paid = Boolean(membership.paid);
  } catch (error) {
    console.warn('Membership state unavailable in preview or current session', error);
  }

  setTierUI(paid);
  await loadPets();

  $w('#addPetButton').onClick(() => wixLocation.to('/pet-profile?new=1'));
  $w('#findCareButton').onClick(() => wixLocation.to('/find-care'));
  $w('#travelButton').onClick(() => wixLocation.to('/travel-planner'));
  $w('#upgradeButton').onClick(() => wixLocation.to('/membership'));

  $w('#recordsButton').onClick(() => paid ? wixLocation.to('/records') : wixLocation.to('/membership'));
  $w('#remindersButton').onClick(() => paid ? wixLocation.to('/reminders') : wixLocation.to('/membership'));
  $w('#careTeamButton').onClick(() => paid ? wixLocation.to('/care-team') : wixLocation.to('/membership'));
});

async function loadPets() {
  const result = await wixData.query('Pets')
    .eq('memberProfile', memberProfile._id)
    .descending('_createdDate')
    .find();

  if (!result.items.length) {
    $w('#emptyPetsBox').show();
  } else {
    $w('#emptyPetsBox').hide();
  }

  $w('#petsRepeater').data = result.items;
  $w('#petsRepeater').onItemReady(($item, itemData) => {
    $item('#petName').text = itemData.title || 'Pet';
    $item('#petDetails').text = [itemData.species, itemData.breed].filter(Boolean).join(' • ');
    if (itemData.photo) $item('#petPhoto').src = itemData.photo;
    $item('#openPetButton').onClick(() => wixLocation.to(`/pet-profile?pet=${itemData._id}`));
  });
}

function setTierUI(isPaid) {
  if (isPaid) {
    $w('#paidBadge').show();
    $w('#freeBadge').hide();
    $w('#upgradeButton').hide();
  } else {
    $w('#paidBadge').hide();
    $w('#freeBadge').show();
    $w('#upgradeButton').show();
  }
}
