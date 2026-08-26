// Page: Find Care - Free feature
import wixData from 'wix-data';

$w.onReady(function () {
  $w('#searchButton').onClick(searchProviders);
});

async function searchProviders() {
  let query = wixData.query('Providers');
  const state = String($w('#stateFilter').value || '').trim();
  const zip = String($w('#zipFilter').value || '').trim();

  if (state) query = query.eq('state', state);
  if (zip) query = query.eq('zip', zip);
  if ($w('#usdaOnly').checked) query = query.eq('usdaAccredited', true);

  $w('#providerStatus').text = 'Searching...';
  $w('#providerStatus').show();

  const result = await query.limit(50).find();
  $w('#providerStatus').text = result.items.length
    ? `${result.items.length} provider${result.items.length === 1 ? '' : 's'} found.`
    : 'No matching providers were found in the current directory.';

  $w('#providersRepeater').data = result.items;
  $w('#providersRepeater').onItemReady(($item, itemData) => {
    $item('#providerName').text = itemData.title || 'Provider';
    $item('#providerMeta').text = [
      itemData.city,
      itemData.state,
      itemData.usdaAccredited ? 'USDA-accredited' : '',
    ].filter(Boolean).join(' • ');
    $item('#providerPhone').text = itemData.phone || '';
    $item('#providerPriceNotes').text = itemData.priceNotes || '';
    if (itemData.website) $item('#providerWebsite').link = itemData.website;
  });
}
