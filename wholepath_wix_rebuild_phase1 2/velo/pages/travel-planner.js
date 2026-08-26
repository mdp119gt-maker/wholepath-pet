// Page: Free Travel Planner
// Free users receive useful requirement guidance, but not a generated checklist/timeline.
import wixLocation from 'wix-location';

const DESTINATIONS = {
  Japan: {
    dog: 'Microchip: Japan generally requires an ISO-compatible microchip placed before the rabies vaccinations used for entry. Vaccines: the standard pathway generally requires two qualifying rabies vaccinations after microchipping. Testing: a qualifying rabies antibody titer of at least 0.5 IU/mL is required, followed by the required waiting period. Documents: advance notification and official health/export documentation are part of the process. Start early because timing can determine eligibility.',
    cat: 'Microchip: Japan generally requires an ISO-compatible microchip placed before the rabies vaccinations used for entry. Vaccines: the standard pathway generally requires two qualifying rabies vaccinations after microchipping. Testing: a qualifying rabies antibody titer of at least 0.5 IU/mL is required, followed by the required waiting period. Documents: advance notification and official health/export documentation are part of the process. Start early because timing can determine eligibility.',
  },
  'European Union': {
    dog: 'Microchip: an ISO-compatible microchip generally must be in place before the rabies vaccination used for travel. Vaccines: a valid rabies vaccination is generally required. Documents: travelers from the U.S. commonly need the applicable health certificate and USDA endorsement. Some EU destinations add parasite-treatment requirements for dogs.',
    cat: 'Microchip: an ISO-compatible microchip generally must be in place before the rabies vaccination used for travel. Vaccines: a valid rabies vaccination is generally required. Documents: travelers from the U.S. commonly need the applicable health certificate and USDA endorsement.',
  },
  Canada: {
    dog: 'Vaccines: valid rabies documentation is commonly the key federal requirement for adult dogs entering from the United States, with age and trip circumstances affecting the rule. Microchip: not a universal federal requirement for every pet entry, though carriers and other programs may have their own requirements. Documents: bring the original vaccination documentation and verify the current CFIA requirements before departure.',
    cat: 'Vaccines: adult cats commonly need valid rabies vaccination documentation. Microchip: not a universal federal requirement for every pet entry. Documents: verify the current CFIA requirements for the pet\'s age and circumstances before departure.',
  },
  Mexico: {
    dog: 'Vaccines and health documents: rules depend on current U.S.-Mexico animal-health requirements and can change quickly. Dogs may require specific veterinary inspection documentation in addition to arrival inspection. Microchip requirements may depend on the trip and carrier. Confirm the current USDA APHIS and Mexican SENASICA instructions shortly before travel.',
    cat: 'Cats entering Mexico from the U.S. are generally subject to arrival inspection, and current document requirements can differ from dogs. Carry vaccination and health information and verify current SENASICA guidance before travel.',
  },
  'South Africa': {
    dog: 'Documents: an import permit and official veterinary health documentation are generally required. Vaccines/testing: requirements vary by species and origin and may include rabies vaccination and disease testing. Microchip: identification requirements should be confirmed for the specific permit and route. Start the permit process well before travel.',
    cat: 'Documents: an import permit and official veterinary health documentation are generally required. Vaccines/testing: requirements vary by species and origin and may include rabies vaccination and disease testing. Confirm identification and permit requirements before travel.',
  },
};

$w.onReady(function () {
  $w('#planButton').onClick(buildFreeResult);
  $w('#upgradeTravelButton').onClick(() => wixLocation.to('/membership'));
});

function buildFreeResult() {
  const type = $w('#travelType').value;
  const destination = $w('#destination').value;
  const species = String($w('#petSpecies').value || 'dog').toLowerCase();

  if (!destination) {
    $w('#travelStatus').text = 'Choose a destination to see travel guidance.';
    $w('#travelStatus').show();
    return;
  }

  const text = type === 'Domestic U.S.'
    ? domesticGuidance(destination, species)
    : DESTINATIONS[destination]?.[species] || internationalFallback(destination, species);

  $w('#resultTitle').text = `${destination} travel guidance`;
  $w('#resultText').text = text;
  $w('#travelStatus').text = 'WholePath can keep this trip organized with a personalized checklist and timeline when you upgrade to Membership.';
  $w('#travelStatus').show();
}

function domesticGuidance(destination, species) {
  if (destination === 'Hawaii') {
    return 'Hawaii has a dedicated animal import process. Microchip: dogs and cats generally need qualifying identification. Vaccines: Hawaii requires qualifying rabies vaccination history. Testing: a FAVN rabies antibody test is part of common direct-release pathways. Documents/timing: required forms, fees, and veterinary documentation must be submitted on Hawaii\'s schedule. Start early and verify the current Hawaii Department of Agriculture checklist before booking.';
  }
  return `${destination} sets its own pet-entry requirements. Vaccines: rabies vaccination is commonly required or strongly recommended, but age and state rules vary. Health certificate: some destinations or circumstances require a certificate of veterinary inspection. Microchip: requirements vary by state, territory, airline, and accommodation. Check the receiving state or territory's current animal-entry rules before departure for your ${species}.`;
}

function internationalFallback(destination, species) {
  return `${destination} may regulate microchip identification, rabies vaccination, health certificates, laboratory testing, import permits, parasite treatments, or advance notification. Requirements vary by origin, species, age, vaccination history, and timing. Verify the receiving government's current rules before travel for your ${species}.`;
}
