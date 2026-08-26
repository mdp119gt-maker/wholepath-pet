(function(){
  let rules=null;
  async function loadRules(){
    if(rules)return rules;
    try{
      const r=await fetch('/data/travel-requirements.json',{cache:'no-store'});
      if(!r.ok)throw new Error('requirements '+r.status);
      rules=await r.json();
      return rules;
    }catch(e){console.warn('WholePath requirements library unavailable; using embedded fallback rules.',e);return null;}
  }
  function setFor(dest){
    if(!rules)return null;
    return (rules.destinations&&rules.destinations[dest])||(rules.domestic&&rules.domestic.states&&rules.domestic.states[dest])||null;
  }
  function verifiedLabel(){
    const v=rules&&rules.verifiedAt;
    if(!v)return 'the current built-in rule set';
    const d=new Date(v+'T12:00:00');
    return isNaN(d)?v:d.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  }
  function minusDays(date,days){if(!date)return '';const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-days);return d.toISOString().slice(0,10)}
  function titleFor(k){return({microchip:'Microchip',rabies:'Rabies vaccination',titer:'Rabies antibody test',favn:'FAVN rabies antibody test',wait:'Waiting period',notice:'Advance notification',certificate:'Health certificate / export documents',echinococcus:'Echinococcus treatment','nws-dog':'New World Screwworm inspection certificate','cat-certificate':'Health certificate',inspection:'Arrival inspection',permit:'Import permit',surra:'Surra (Trypanosoma evansi) testing','microchip-labs':'Microchip on laboratory reports'}[k]||String(k).replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()))}
  function card(req,dest,species){
    const key=req.key,title=titleFor(key),text=esc(req.summary),rc=rabiesCurrent(),rr=rabiesRecords(),chip=chipStatus();
    if(req.type==='required-dog'&&species!=='Dog')return null;
    if(req.type==='not-required-cat'&&species!=='Cat')return null;
    if(key==='microchip')return requirement(title,text,chip,false);
    if(key==='rabies'){
      if(dest==='Japan'){
        const st={ok:rr.length>=2&&rc.ok,reason:rr.length>=2?(rc.ok?'At least two rabies records are saved and the latest remains current through travel. Microchip/vaccine sequence still needs document review.':rc.reason):'Only '+rr.length+' rabies record'+(rr.length===1?' is':'s are')+' saved; this rule requires two qualifying vaccinations.'};
        return requirement(title,text,st);
      }
      if(dest==='European Union')return requirement(title,text,rabies21());
      return requirement(title,text,rc,false);
    }
    if(key==='titer'||key==='favn'){
      const f=namedRecord(['favn','titer','titre','rabies antibody']);
      return requirement(title,text,{ok:false,reason:f?'A titer/FAVN record is saved, but the free profile does not capture the numeric result and accepted-laboratory details needed to verify this requirement.':'No rabies titer/FAVN record is saved.'});
    }
    if(key==='wait'&&dest==='Japan'){
      const f=namedRecord(['favn','titer','titre','rabies antibody']),n=f&&f.date?daysBetween(f.date,tpa.travelDate):null;
      return requirement(title,text,{ok:n!==null&&n>=180,reason:n===null?'A usable titer blood-draw date is not saved, so WholePath cannot calculate this wait.':'The saved titer date is '+n+' days before planned arrival.'});
    }
    if(key==='notice'&&dest==='Japan'){
      const dl=minusDays(tpa.travelDate,40);
      return tpItem(title,text+(dl?' <br><strong>Your 40-day deadline:</strong> '+esc(dl):''),'info','Time-sensitive requirement');
    }
    if(key==='echinococcus')return tpItem(title,text,'info','Conditional destination requirement');
    if(key==='nws-dog'){
      const opens=minusDays(tpa.travelDate,5);
      const window=opens&&tpa.travelDate?' For this trip, the certificate must be issued from <strong>'+esc(opens)+'</strong> through <strong>'+esc(tpa.travelDate)+'</strong>.':'';
      return tpItem(title,text+window+' The inspection and certificate must be completed by a USDA-accredited veterinarian.','warn','Book the veterinarian inside this window');
    }
    if(key==='cat-certificate')return tpItem(title,text,'pass','No Mexico health certificate required');
    if(key==='inspection')return tpItem(title,text,'info','Arrival requirement');
    if(key==='permit')return tpItem(title,text,'warn','Permit required before travel');
    if(key==='surra'){
      const f=namedRecord(['surra','trypanosoma','catt','giemsa']);
      return requirement(title,text,{ok:false,reason:f?'A surra-related record is saved, but the free profile cannot verify both required negative tests and accepted laboratories.':'No surra testing record is saved.'});
    }
    if(key==='microchip-labs')return requirement(title,text,chip,false);
    if(key==='certificate')return tpItem(title,text,'info','Professional / time-sensitive document');
    return tpItem(title,text,'info',req.type==='conditional'?'Conditional requirement':req.type==='not-general'?'Not generally required':'Destination requirement');
  }
  const fallbackIntl=tpIntl;
  tpIntl=function(dest,species){
    const rs=setFor(dest);
    if(!rs||!Array.isArray(rs.requirements))return fallbackIntl(dest,species);
    const out=rs.requirements.map(r=>card(r,dest,species)).filter(Boolean);
    if(dest==='Japan')out.push(tpItem('Other vaccines','Japan’s border-entry pathway centers on rabies and required health certification. Routine vaccines should still be kept current for the pet’s health, and the final clinical examination must satisfy the destination certificate.','info','Required vs. recommended'));
    if(dest==='European Union')out.push(tpItem('Other routine vaccines','Other routine vaccines are not a general EU border-entry requirement for privately owned dogs and cats, although carriers, boarding facilities, and local rules can add requirements.','info','Required vs. recommended'));
    if(dest==='Mexico'){
      const rc=rabiesCurrent();
      out.push(requirement('Rabies vaccination guidance','Mexico’s current federal entry instructions for ordinary U.S.-origin pet dogs and cats do not generally list a rabies vaccination certificate as an entry requirement. However, CDC strongly recommends that dogs returning to the United States remain vaccinated, and airlines, lodging, boarding facilities, or local authorities may require proof. This card reviews the rabies record saved in the pet profile.',rc,false));
      out.push(tpItem('Other routine vaccinations','Mexico’s federal border instructions do not generally list DHPP, Bordetella, leptospirosis, or other routine vaccines as entry requirements for an ordinary accompanied U.S.-origin dog or cat. Keep age-appropriate vaccines current for health protection and confirm any carrier or lodging requirements.','info','Recommended / carrier rules'));
      out.push(tpItem('Arrival inspection and carrier preparation','On arrival, take the pet in a clean carrier to the SENASICA/OISA inspection point. Officials check for signs of infectious or contagious disease, ectoparasites such as ticks or fleas, and fresh or healing wounds. Do not arrive with a dirty carrier, disposable bedding, toys, or more than the pet’s food portion for the day; prohibited carrier contents may be removed and destroyed.','info','What to expect at the border'));
      if(species==='Dog'){
        out.push(tpItem('Returning to the United States','Mexico is not currently on CDC’s high-risk dog-rabies list. Before returning, complete the free CDC Dog Import Form for the dog and keep the receipt available. The dog must appear healthy, be at least 6 months old, and have a detectable microchip. Because Mexico is affected by New World screwworm, also arrange the required screwworm-freedom veterinary inspection and documentation within the applicable return-entry window. CDC strongly recommends keeping rabies vaccination current.','warn','Required before the return trip'));
        out.push(tpItem('Your Mexico action checklist','<ol style="margin:8px 0 0;padding-left:20px"><li>Confirm the microchip can be scanned and the number is recorded.</li><li>Keep rabies and routine vaccines current and carry copies, even though Mexico does not generally require them for ordinary U.S.-origin pet entry.</li><li>Book a USDA-accredited veterinarian during the five-day window shown above for the Mexico NWS certificate.</li><li>Check the airline’s crate, temperature, breed, and document rules.</li><li>Present the dog and clean carrier for SENASICA/OISA inspection on arrival.</li><li>Before coming home, complete the CDC Dog Import Form and the required U.S. screwworm-return documentation.</li></ol>','info','Trip-ready checklist'));
      }else{
        out.push(tpItem('Your Mexico action checklist','<ol style="margin:8px 0 0;padding-left:20px"><li>Keep rabies and routine vaccines current and carry copies.</li><li>Check the airline’s carrier and document rules.</li><li>Bring the cat in a clean carrier with no prohibited bedding, toys, or excess food.</li><li>Present the cat for SENASICA/OISA inspection on arrival.</li></ol>','info','Trip-ready checklist'));
      }
    }
    return out;
  };
  const domesticStates=tpStates.filter(s=>!['Puerto Rico','Guam','U.S. Virgin Islands','Other U.S. territory'].includes(s));
  const destinationQuestion=tpQuestions.findIndex(q=>q.k==='destinationState');
  if(destinationQuestion>=0&&!tpQuestions.some(q=>q.k==='originState')){
    tpQuestions.splice(destinationQuestion,0,
      {k:'originState',q:'Which state are you traveling from?',type:'state',show:()=>tpa.tripType==='Domestic U.S. travel'},
      {k:'transport',q:'How will your pet travel?',o:['Driving','Flying'],show:()=>tpa.tripType==='Domestic U.S. travel'}
    );
  }
  function domesticRuleText(rule,key,species){
    const value=rule[key];
    if(value&&typeof value==='object')return value[species.toLowerCase()]||value.all||'';
    return value||'';
  }
  function travelWindow(days){
    const start=minusDays(tpa.travelDate,days);
    return start&&tpa.travelDate?' For this trip, obtain it from <strong>'+esc(start)+'</strong> through <strong>'+esc(tpa.travelDate)+'</strong>.':'';
  }
  const fallbackDomestic=tpDomestic;
  tpDomestic=function(dest){
    const rule=setFor(dest),origin=setFor(tpa.originState),species=tpa.species||'Dog';
    if(!rule||!rule.domestic)return fallbackDomestic(dest);
    const d=Object.assign({},rules.domestic.defaults||{},rule.domestic),items=[];
    const scope='This answer covers a privately owned '+species.toLowerCase()+' traveling with its owner, with no sale, adoption, rescue transfer, or change of ownership.';
    items.push(tpItem('Who this answer covers',scope,'pass','Trip type confirmed'));
    const cvi=domesticRuleText(d,'cvi',species);
    if(d.cviRequired===false)items.push(tpItem('Veterinary health certificate (CVI)',cvi,'pass','Not required for this owner-accompanied trip'));
    else if(d.cviRequired===true)items.push(tpItem('Veterinary health certificate (CVI)',cvi+travelWindow(d.cviDays||30),'warn','Required before entry'));
    else items.push(tpItem('Veterinary health certificate (CVI)',cvi+travelWindow(d.cviDays||30),'warn','Use this conservative document plan'));
    const rabies=domesticRuleText(d,'rabies',species),rc=rabiesCurrent();
    if(d.rabiesRequired===false)items.push(tpItem('Rabies documentation',rabies,'info','Not a state entry document for this trip'));
    else items.push(requirement('Rabies vaccination and proof',rabies,rc,false));
    if(d.special)items.push(tpItem(d.specialTitle||'Additional destination rule',domesticRuleText(d,'special',species),'warn',d.specialLabel||'Complete before travel'));
    else items.push(tpItem('Permit, testing, and quarantine','No general destination import permit, laboratory test, or quarantine is listed for an ordinary healthy owner-accompanied dog or cat under this rule set. Different rules can apply to animals for sale, adoption, rescue, breeding, exhibition, or commercial transfer.','pass','No additional general entry step'));
    if(origin&&origin.domestic&&tpa.originState!==dest){
      const back=Object.assign({},rules.domestic.defaults||{},origin.domestic),backCvi=domesticRuleText(back,'cvi',species),backRabies=domesticRuleText(back,'rabies',species);
      items.push(tpItem('Returning to '+esc(tpa.originState),(back.cviRequired===false?'A CVI is not generally required for the covered owner-accompanied return trip. ':backCvi+travelWindow(back.cviDays||30)+' ')+backRabies,'info','Plan the return entry too'));
    }
    if(tpa.transport==='Flying')items.push(tpItem('Airline requirements are additional','The state-entry answer above does not replace airline rules. Confirm the carrier’s reservation, carrier dimensions, temperature embargoes, breed restrictions, check-in timing, and its own health-certificate window. If the airline requires a CVI even when the state does not, follow the airline’s shorter deadline.','warn','Confirm directly with the airline'));
    else items.push(tpItem('Driving preparation','Carry the rabies certificate and any required CVI in the vehicle. Lodging, campgrounds, tribal lands, parks, municipalities, and border-inspection stations can impose separate rules even when the destination state grants an owner exemption.','info','Keep documents accessible'));
    const tasks=[];
    if(d.cviRequired!==false)tasks.push('Schedule a veterinary exam inside the '+(d.cviDays||30)+'-day CVI window shown above.');
    if(d.rabiesRequired!==false)tasks.push('Confirm the rabies certificate stays valid through '+esc(tpa.travelDate)+'.');
    if(d.special)tasks.push('Complete the destination-specific item described above.');
    tasks.push(tpa.transport==='Flying'?'Confirm the airline’s separate document and carrier rules.':'Put paper and digital copies of the travel records in the vehicle.');
    tasks.push('Recheck this plan if the pet, route, ownership, or travel date changes.');
    items.push(tpItem('Your action checklist','<ol style="margin:8px 0 0;padding-left:20px"><li>'+tasks.join('</li><li>')+'</li></ol>','info','Trip-ready checklist'));
    return items;
  };
  const fallbackStart=tpStart;
  tpStart=async function(){await loadRules();return fallbackStart();};
  if($('tpStartBtn'))$('tpStartBtn').onclick=tpStart;
  const fallbackFinish=tpFinish;
  tpFinish=function(){
    fallbackFinish();
    const dest=tpa.tripType==='Domestic U.S. travel'?tpa.destinationState:tpa.destination,rs=setFor(dest);
    if(!rs)return;
    const boxes=[...document.querySelectorAll('#tpOutput .planner-source')];
    const sourceBox=boxes.find(b=>b.querySelector('strong')&&b.querySelector('strong').textContent.trim()==='Official source');
    if(sourceBox)sourceBox.innerHTML='<strong>Source used for this result</strong><div class="muted" style="margin:4px 0 8px">WholePath built the guidance above from '+esc(rs.authority||'the destination authority')+' information verified on '+verifiedLabel()+'. The link is provided as supporting documentation; the key requirements and actions are summarized above.</div><a target="_blank" rel="noopener" href="'+esc(rs.source)+'">View the supporting government source ↗</a>';
  };
  loadRules();
})();
