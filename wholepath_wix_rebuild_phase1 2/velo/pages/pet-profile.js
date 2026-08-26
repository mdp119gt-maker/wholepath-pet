// Page: Pet Profile
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { authentication, currentMember } from 'wix-members-frontend';

let petId;
let memberProfile;

$w.onReady(async function () {
  const member = await currentMember.getMember();
  if (!member) {
    authentication.promptLogin()
      .then(() => wixLocation.to('/pet-profile'))
      .catch(() => wixLocation.to('/'));
    return;
  }

  const profiles = await wixData.query('MemberProfiles').limit(1).find();
  if (!profiles.items.length) {
    wixLocation.to('/onboarding');
    return;
  }
  memberProfile = profiles.items[0];

  petId = wixLocation.query.pet;
  if (petId) await loadPet(petId);

  $w('#savePetButton').onClick(savePet);
  $w('#addVaccineButton').onClick(addVaccine);
});

async function loadPet(id) {
  const pet = await wixData.get('Pets', id);
  if (String(pet.memberProfile) !== String(memberProfile._id)) {
    wixLocation.to('/member-dashboard');
    return;
  }

  $w('#petName').value = pet.title || '';
  $w('#species').value = pet.species || '';
  $w('#breed').value = pet.breed || '';
  $w('#dateOfBirth').value = pet.dateOfBirth || null;
  $w('#sex').value = pet.sex || '';
  $w('#altered').checked = Boolean(pet.altered);
  $w('#weight').value = pet.weight ?? null;
  $w('#microchipNumber').value = pet.microchipNumber || '';
  $w('#microchipDate').value = pet.microchipDate || null;
  await loadVaccines();
}

async function savePet() {
  const name = String($w('#petName').value || '').trim();
  if (!name) {
    showStatus('Please enter your pet\'s name.');
    return;
  }

  $w('#savePetButton').disable();
  try {
    const data = {
      title: name,
      memberProfile: memberProfile._id,
      species: $w('#species').value,
      breed: $w('#breed').value,
      dateOfBirth: $w('#dateOfBirth').value,
      sex: $w('#sex').value,
      altered: $w('#altered').checked,
      weight: Number($w('#weight').value) || undefined,
      microchipNumber: $w('#microchipNumber').value,
      microchipDate: $w('#microchipDate').value,
    };

    const saved = petId
      ? await wixData.update('Pets', { ...data, _id: petId })
      : await wixData.insert('Pets', data);

    petId = saved._id;
    showStatus(`${name}'s profile is saved to your WholePath account.`);
    await loadVaccines();
  } catch (error) {
    console.error('Pet save failed', error);
    showStatus('We could not save this pet. Please try again.');
  } finally {
    $w('#savePetButton').enable();
  }
}

async function addVaccine() {
  if (!petId) await savePet();
  if (!petId) return;

  const vaccineName = String($w('#vaccineName').value || '').trim();
  if (!vaccineName) {
    showStatus('Enter the vaccine name first.');
    return;
  }

  try {
    await wixData.insert('Vaccines', {
      title: vaccineName,
      pet: petId,
      dateGiven: $w('#dateGiven').value,
      expirationDate: $w('#expirationDate').value,
      manufacturer: $w('#manufacturer').value,
      veterinarian: $w('#veterinarian').value,
    });

    $w('#vaccineName').value = '';
    $w('#dateGiven').value = null;
    $w('#expirationDate').value = null;
    $w('#manufacturer').value = '';
    $w('#veterinarian').value = '';
    showStatus('Vaccine saved. WholePath Free stores the date; Membership can add automatic reminders later.');
    await loadVaccines();
  } catch (error) {
    console.error('Vaccine save failed', error);
    showStatus('We could not save that vaccine. Please try again.');
  }
}

async function loadVaccines() {
  if (!petId) return;
  const result = await wixData.query('Vaccines').eq('pet', petId).ascending('expirationDate').find();
  $w('#vaccinesRepeater').data = result.items;
  $w('#vaccinesRepeater').onItemReady(($item, itemData) => {
    $item('#vaxName').text = itemData.title || 'Vaccine';
    $item('#vaxDates').text = formatDates(itemData.dateGiven, itemData.expirationDate);
  });
}

function formatDates(given, expires) {
  const pieces = [];
  if (given) pieces.push(`Given ${new Date(given).toLocaleDateString()}`);
  if (expires) pieces.push(`Expires ${new Date(expires).toLocaleDateString()}`);
  return pieces.join(' • ');
}

function showStatus(message) {
  $w('#statusText').text = message;
  $w('#statusText').show();
}
