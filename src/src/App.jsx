import { useState, useEffect, useCallback } from "react";

// ─── COLOUR TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#071510", surface:"#0c1e14", card:"#101f17", cardHover:"#162b1e",
  border:"#1c3824", green1:"#174d28", green2:"#1f6435", accent:"#2dbd6e",
  mint:"#8ee8b4", mintSoft:"#c4f2dc", text:"#e4f2eb", textMuted:"#6aaa87",
  textDim:"#3d6b50", red:"#e05252", yellow:"#f0c040", orange:"#f07840",
  blue:"#4aabdf", white:"#ffffff", gold:"#f5c842",
};

// ─── LEAGUES – 20 worldwide ───────────────────────────────────────────────────
const LEAGUES = [
  { id:"wsl",   name:"FA Women's Super League",          country:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", short:"WSL",   conf:"Europe" },
  { id:"uwcl",  name:"UEFA Women's Champions League",    country:"🇪🇺", short:"UWCL",  conf:"Europe" },
  { id:"d1f",   name:"Division 1 Féminine",              country:"🇫🇷", short:"D1F",   conf:"Europe" },
  { id:"bnl",   name:"Frauen-Bundesliga",                country:"🇩🇪", short:"FBL",   conf:"Europe" },
  { id:"primera",name:"Liga F",                          country:"🇪🇸", short:"LIGAF", conf:"Europe" },
  { id:"seriea", name:"Serie A Femminile",               country:"🇮🇹", short:"SAF",   conf:"Europe" },
  { id:"damall", name:"Damallsvenskan",                  country:"🇸🇪", short:"DAM",   conf:"Europe" },
  { id:"toppser",name:"Toppserien",                      country:"🇳🇴", short:"TOPP",  conf:"Europe" },
  { id:"nwsl",  name:"National Women's Soccer League",   country:"🇺🇸", short:"NWSL",  conf:"CONCACAF" },
  { id:"cpwl",  name:"Canadian Premier Women's League",  country:"🇨🇦", short:"CPWL",  conf:"CONCACAF" },
  { id:"lmxf",  name:"Liga MX Femenil",                  country:"🇲🇽", short:"LMXF",  conf:"CONCACAF" },
  { id:"brf",   name:"Brasileirão Feminino",             country:"🇧🇷", short:"BRF",   conf:"CONMEBOL" },
  { id:"arf",   name:"Argentine Primera Fem.",           country:"🇦🇷", short:"ARF",   conf:"CONMEBOL" },
  { id:"cwc",   name:"Copa Libertadores Femenina",       country:"🌎", short:"CLF",   conf:"CONMEBOL" },
  { id:"wleague",name:"A-League Women",                  country:"🇦🇺", short:"ALW",   conf:"AFC" },
  { id:"ifl",   name:"Indian Women's League",            country:"🇮🇳", short:"IWL",   conf:"AFC" },
  { id:"kcwk",  name:"WK-League",                        country:"🇰🇷", short:"WKL",   conf:"AFC" },
  { id:"nafl",  name:"WAFCON Club Championship",         country:"🌍", short:"WAF",   conf:"CAF" },
  { id:"jl",    name:"Nadeshiko League",                 country:"🇯🇵", short:"NAD",   conf:"AFC" },
  { id:"wwc",   name:"FIFA Women's World Cup 2027",      country:"🌍", short:"WWC",   conf:"Global" },
];

// ─── TEAMS per league ─────────────────────────────────────────────────────────
const TEAMS = {
  wsl:    ["Arsenal WFC","Chelsea FCW","Manchester City W","Aston Villa W","Liverpool W","Brighton W","Manchester Utd W","Tottenham W"],
  uwcl:   ["Barcelona Femení","Lyon Féminin","Chelsea FCW","Wolfsburg W","Arsenal WFC","PSG Féminines","Bayern München W","Roma W"],
  d1f:    ["Lyon Féminin","PSG Féminines","Montpellier HSC W","Bordeaux W","Lille OSC W","Dijon FCO W","Toulouse FC W","Reims W"],
  bnl:    ["Wolfsburg W","Bayern München W","Eintracht Frankfurt W","Bayer Leverkusen W","RB Leipzig W","SC Freiburg W","Turbine Potsdam","SGS Essen"],
  primera:["Barcelona Femení","Atlético Madrid W","Real Madrid CFF","Levante UD W","Villarreal W","Athletic Club W","Deportivo Alavés W","Granada CF W"],
  seriea: ["Roma W","Juventus W","Fiorentina W","Inter Milan W","AC Milan W","Sampdoria W","Napoli W","Lazio W"],
  damall: ["Rosengård","Häcken","Djurgårdens IF","Hammarby","AIK W","Piteå IF W","Linköpings FC W","GAIS W"],
  toppser:["LSK Kvinner","Vålerenga W","Stabæk W","Avaldsnes IL","Kolbotn","Klepp IL","Arna-Bjørnar","Sandviken"],
  nwsl:   ["Gotham FC","Portland Thorns","Orlando Pride","Kansas City Current","Chicago Red Stars","Angel City FC","San Diego Wave","Washington Spirit"],
  cpwl:   ["Forge FC W","Pacific FC W","Cavalry FC W","York United W","HFX Wanderers W","Valour FC W"],
  lmxf:   ["Tigres UANL Fem","Club América Fem","Chivas Fem","Cruz Azul Fem","Monterrey Fem","Pumas UNAM Fem","Atlas Fem","Santos Laguna Fem"],
  brf:    ["Corinthians Fem","São Paulo Fem","Palmeiras Fem","Flamengo Fem","Santos Fem","Internacional Fem","Athletico PR Fem","Cruzeiro Fem"],
  arf:    ["River Plate Fem","Boca Juniors Fem","Vélez Sársfield Fem","San Lorenzo Fem","Racing Club Fem","Independiente Fem"],
  cwc:    ["Corinthians Fem","Boca Juniors Fem","Tigres UANL Fem","Club América Fem","Rosengård","Santos Fem"],
  wleague:["Melbourne City W","Sydney FC W","Adelaide United W","Western Sydney W","Perth Glory W","Brisbane Roar W","Western United W","Newcastle Jets W"],
  ifl:    ["Gokulam Kerala","Sethu FC","Bengaluru FC W","KRYPHSA FC","Kickstart FC","SSB W"],
  kcwk:   ["Incheon Red Angels","Gyeongju KHNP","Seoul WFC","Ulsan Hyundai W","Suwon Bluewings W","Gwangju W"],
  nafl:   ["Mamelodi Sundowns W","TP Mazembe W","Simba Queens","Al Ahly W","Hasaacas Ladies","Rivers Angels"],
  jl:     ["Nippon TV Beleza","INAC Kobe","Urawa Reds Ladies","Nagoya Grampus W","NTV Menina","Albirex Niigata W","Cerezo Osaka W","Mynavi Sendai"],
  wwc:    ["USWNT","England W","Spain W","Germany W","France W","Brazil W","Japan W","Australia W","Netherlands W","Canada W","Sweden W","Norway W"],
};

const rand = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick = arr=>arr[Math.floor(Math.random()*arr.length)];
const positions = ["GK","CB","LB","RB","CDM","CM","CAM","LW","RW","CF","ST"];

const NATIONS = [
  {flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",name:"England",caps:rand(20,120)},
  {flag:"🇺🇸",name:"USA",caps:rand(15,130)},
  {flag:"🇩🇪",name:"Germany",caps:rand(10,110)},
  {flag:"🇫🇷",name:"France",caps:rand(10,90)},
  {flag:"🇪🇸",name:"Spain",caps:rand(10,80)},
  {flag:"🇧🇷",name:"Brazil",caps:rand(15,120)},
  {flag:"🇯🇵",name:"Japan",caps:rand(10,100)},
  {flag:"🇳🇱",name:"Netherlands",caps:rand(10,85)},
  {flag:"🇸🇪",name:"Sweden",caps:rand(12,95)},
  {flag:"🇦🇺",name:"Australia",caps:rand(10,80)},
  {flag:"🇳🇬",name:"Nigeria",caps:rand(8,70)},
  {flag:"🇨🇦",name:"Canada",caps:rand(10,90)},
  {flag:"🇦🇷",name:"Argentina",caps:rand(5,60)},
  {flag:"🇰🇷",name:"South Korea",caps:rand(10,75)},
  {flag:"🇳🇴",name:"Norway",caps:rand(10,85)},
  {flag:"🇨🇳",name:"China",caps:rand(8,70)},
];

const CLUB_HISTORY_POOL = [
  "Youth Academy","Local FC","Academy Utd","City Girls FC","Regional Select",
  "FC Europa W","Athletic Girls","Premier Academy","Stars FC","United W",
];

const makePlayer = (name, club, pos, num) => {
  const nat = pick(NATIONS);
  const intlGoals = pos==="GK"?0:rand(0,nat.caps*0.4|0);
  const prevClubs = Array.from({length:rand(2,4)},(_,i)=>({
    club: i===0?pick(CLUB_HISTORY_POOL):pick(Object.values(TEAMS).flat().filter(t=>t!==club)),
    from: 2014+i*2, to: 2016+i*2, apps:rand(10,80), goals:pos==="GK"?0:rand(0,20),
  }));
  return {
    id:name.replace(/\s/g,"_").toLowerCase(),
    name, club, pos, num,
    nationality:`${nat.flag} ${nat.name}`,
    natFlag: nat.flag,
    age:rand(19,34), height:`${rand(160,182)}cm`, foot:pick(["Right","Left","Both"]),
    apps:rand(8,30), goals:pos==="GK"?0:rand(0,18), assists:pos==="GK"?0:rand(0,12),
    cleanSheets:pos==="GK"?rand(3,18):undefined,
    yellowCards:rand(0,6), redCards:rand(0,2),
    passAcc:rand(72,94), shotAcc:pos==="GK"?0:rand(35,75),
    rating:(rand(62,92)/10).toFixed(1),
    intlCaps:nat.caps, intlGoals,
    intlTeam: nat.name,
    intlFlag: nat.flag,
    bio:`A highly-rated ${pos} known for her technical quality, work rate and leadership. Has been a standout figure in women's football across multiple seasons and competitions.`,
    prevClubs,
    currentClubSince: 2020+rand(0,4),
    contractUntil: 2025+rand(0,3),
    marketValue:`€${rand(1,15)}m`,
    trophies: [
      rand(0,1)?`${rand(1,3)}x League Title`:"",
      rand(0,1)?`${rand(1,2)}x UWCL`:"",
      rand(0,1)?`World Cup Winner`:"",
      rand(0,1)?`${rand(1,2)}x Domestic Cup`:"",
    ].filter(Boolean),
  };
};

// Pre-build named players for star clubs
const NAMED_PLAYERS = {
  "Arsenal WFC":[
    makePlayer("Leah Williamson","Arsenal WFC","CB",6),
    makePlayer("Beth Mead","Arsenal WFC","RW",9),
    makePlayer("Vivianne Miedema","Arsenal WFC","CF",11),
    makePlayer("Kim Little","Arsenal WFC","CM",8),
    makePlayer("Manuela Zinsberger","Arsenal WFC","GK",1),
    makePlayer("Caitlin Foord","Arsenal WFC","LW",7),
  ],
  "Chelsea FCW":[
    makePlayer("Sam Kerr","Chelsea FCW","ST",20),
    makePlayer("Fran Kirby","Chelsea FCW","CAM",14),
    makePlayer("Millie Bright","Chelsea FCW","CB",5),
    makePlayer("Ann-Katrin Berger","Chelsea FCW","GK",1),
    makePlayer("Lauren James","Chelsea FCW","RW",7),
    makePlayer("Guro Reiten","Chelsea FCW","LW",11),
  ],
  "Barcelona Femení":[
    makePlayer("Alexia Putellas","Barcelona Femení","CAM",11),
    makePlayer("Aitana Bonmatí","Barcelona Femení","CM",8),
    makePlayer("Caroline Graham Hansen","Barcelona Femení","RW",9),
    makePlayer("Salma Paralluelo","Barcelona Femení","CF",17),
    makePlayer("Cata Coll","Barcelona Femení","GK",1),
    makePlayer("Patri Guijarro","Barcelona Femení","CDM",6),
  ],
  "Lyon Féminin":[
    makePlayer("Ada Hegerberg","Lyon Féminin","ST",14),
    makePlayer("Amandine Henry","Lyon Féminin","CM",8),
    makePlayer("Wendie Renard","Lyon Féminin","CB",3),
    makePlayer("Selma Bacha","Lyon Féminin","LB",15),
    makePlayer("Sarah Bouhaddi","Lyon Féminin","GK",1),
    makePlayer("Eugénie Le Sommer","Lyon Féminin","CF",9),
  ],
  "Gotham FC":[
    makePlayer("Marta","Gotham FC","CF",10),
    makePlayer("Kristie Mewis","Gotham FC","CM",8),
    makePlayer("Abby Dahlkemper","Gotham FC","CB",7),
    makePlayer("Kailen Sheridan","Gotham FC","GK",1),
    makePlayer("Lynn Williams","Gotham FC","RW",11),
  ],
  "Wolfsburg W":[
    makePlayer("Alexandra Popp","Wolfsburg W","ST",11),
    makePlayer("Svenja Huth","Wolfsburg W","RW",7),
    makePlayer("Merle Frohms","Wolfsburg W","GK",1),
    makePlayer("Lena Oberdorf","Wolfsburg W","CDM",6),
    makePlayer("Ewa Pajor","Wolfsburg W","CF",9),
  ],
  "Portland Thorns":[
    makePlayer("Sophia Smith","Portland Thorns","RW",9),
    makePlayer("Crystal Dunn","Portland Thorns","LB",19),
    makePlayer("Becky Sauerbrunn","Portland Thorns","CB",4),
    makePlayer("Adrianna Franch","Portland Thorns","GK",1),
    makePlayer("Lindsey Horan","Portland Thorns","CM",10),
  ],
};

// Build all remaining teams
Object.values(TEAMS).flat().forEach(club=>{
  if(!NAMED_PLAYERS[club]){
    NAMED_PLAYERS[club]=Array.from({length:rand(5,7)},(_,i)=>
      makePlayer(`Player ${String.fromCharCode(65+i)} ${club.split(" ")[0]}`,club,pick(positions),i+1)
    );
  }
});

// ─── MATCH GENERATION ─────────────────────────────────────────────────────────
const pastDate=()=>{const d=new Date();d.setDate(d.getDate()-rand(1,14));return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});};
const upcomingDate=()=>{const d=new Date();d.setDate(d.getDate()+rand(1,12));return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});};

const generateMatch=(home,away,status="FT")=>{
  const hg=status==="LIVE"?rand(0,3):status==="FT"?rand(0,5):0;
  const ag=status==="LIVE"?rand(0,2):status==="FT"?rand(0,4):0;
  const events=[];
  const homePlayers=NAMED_PLAYERS[home]||[];
  const awayPlayers=NAMED_PLAYERS[away]||[];
  let min=5;
  for(let i=0;i<hg;i++){min+=rand(5,20);if(min>93)min=rand(88,94);events.push({type:"goal",team:"home",min,player:(pick(homePlayers)||{name:home}).name});}
  for(let i=0;i<ag;i++){events.push({type:"goal",team:"away",min:rand(5,90),player:(pick(awayPlayers)||{name:away}).name});}
  if(rand(0,2)>0)events.push({type:"yellow",team:pick(["home","away"]),min:rand(15,85),player:(pick([...homePlayers,...awayPlayers])||{name:"Player"}).name});
  if(rand(0,5)===0)events.push({type:"red",team:pick(["home","away"]),min:rand(50,90),player:(pick([...homePlayers,...awayPlayers])||{name:"Player"}).name});
  events.sort((a,b)=>a.min-b.min);
  return{home,away,hg,ag,status,minute:status==="LIVE"?rand(28,87):null,events,date:status==="upcoming"?upcomingDate():pastDate()};
};

const buildFixtures=lid=>{
  const teams=(TEAMS[lid]||TEAMS.wsl).slice();
  const f=[];
  for(let i=0;i<teams.length;i+=2){
    const a=teams[i],b=teams[i+1]||teams[0];
    f.push(generateMatch(a,b,"FT"));
    if(i===0)f.push(generateMatch(b,a,"LIVE"));
    else f.push(generateMatch(b,a,"FT"));
  }
  for(let i=0;i<3;i++){const a=pick(teams),b=pick(teams.filter(t=>t!==a));f.push(generateMatch(a,b,"upcoming"));}
  return f;
};

const buildStandings=lid=>{
  const teams=TEAMS[lid]||TEAMS.wsl;
  return teams.map((t,i)=>({pos:i+1,team:t,p:rand(18,28),w:rand(8,22),d:rand(2,7),l:rand(1,9),gf:rand(20,70),ga:rand(8,45),pts:rand(18,66)}))
    .sort((a,b)=>b.pts-a.pts).map((r,i)=>({...r,pos:i+1}));
};

// ─── NEWS / TRANSFERS DATA ────────────────────────────────────────────────────
const NEWS_TEMPLATES = [
  { type:"transfer", tag:"🔄 TRANSFER", tagColor:C.blue },
  { type:"exclusive", tag:"⭐ EXCLUSIVE", tagColor:C.gold },
  { type:"interview", tag:"🎙️ INTERVIEW", tagColor:C.mint },
  { type:"manager", tag:"👔 MANAGER", tagColor:C.orange },
  { type:"injury", tag:"🚑 INJURY", tagColor:C.red },
  { type:"result", tag:"📊 ANALYSIS", tagColor:C.accent },
];

const generateNews=(league)=>{
  const teams=TEAMS[league.id]||TEAMS.wsl;
  const allPlayers=teams.flatMap(t=>NAMED_PLAYERS[t]||[]);
  const articles=[];

  // Transfer stories
  const p1=pick(allPlayers)||{name:"Star Player",club:pick(teams),pos:"CM"};
  const destClub=pick(teams.filter(t=>t!==p1.club));
  articles.push({
    id:`tr1_${league.id}`,
    type:"transfer",
    tag:"🔄 TRANSFER",tagColor:C.blue,
    headline:`${p1.name} Set for Sensational Move to ${destClub}`,
    summary:`${p1.name} is reportedly close to completing a groundbreaking transfer to ${destClub} in what would be one of the biggest moves in ${league.short} history this season. Personal terms have been agreed and medicals are scheduled for this week.`,
    body:`Sources close to the negotiation confirm that ${p1.club} have accepted a club-record offer of €${rand(2,12)}m for the ${p1.pos}. The 26-year-old has been outstanding this season with ${rand(5,15)} goals and ${rand(3,10)} assists across all competitions.\n\n"I'm excited about this new chapter," ${p1.name.split(" ")[0]} is understood to have told friends. The move is expected to be announced within 48 hours pending final documentation.\n\n${destClub} had been tracking the player since last summer and beat several rival clubs including top sides from France and Germany to secure the signing.`,
    author:"Sarah Mitchell", time:`${rand(1,11)}h ago`, readTime:"3 min read",
    club: p1.club,
  });

  // Exclusive player interview
  const p2=pick(allPlayers)||{name:"Key Player",club:pick(teams),pos:"ST",nationality:"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England"};
  articles.push({
    id:`ex1_${league.id}`,
    type:"exclusive",
    tag:"⭐ EXCLUSIVE",tagColor:C.gold,
    headline:`${p2.name}: "We Want to Win Everything This Season"`,
    summary:`In an exclusive FemmeFootⷭ interview, ${p2.name} opens up about her ambitions, the growth of women's football, and what drives her to be the best in the world.`,
    body:`Sitting in the sun outside the training ground, ${p2.name} radiates quiet confidence. The ${p2.nationality?.slice(2)||"international"} international has had a transformative season and shows no sign of slowing down.\n\n"Every morning I wake up and I want to be better than yesterday," she tells us. "That's not a cliché — it's genuinely how I think about my career."\n\nOn the league title race: "We have the squad depth to go all the way. The coaching staff have built something special and the spirit in the dressing room is unreal."\n\nWhen asked about the growing global profile of women's football: "The stadiums are packed, the TV deals are bigger, the investment is finally here. For the next generation of girls watching — this is just the beginning."\n\nShe finishes with a laugh: "And yes, we're going for the treble. Why not?"`,
    author:"Emma Clarke", time:`${rand(2,24)}h ago`, readTime:"5 min read",
    exclusive:true,
    club: p2.club,
  });

  // Manager interview
  const mgr=["Emma Hayes","Sonia Bompastor","Jonatan Giráldez","Tommy Stroot","Mark Parsons","Vlatko Andonovski","Tony Gustavsson","Beverly Priestman"];
  const mgrName=pick(mgr);
  const mgrClub=pick(teams);
  articles.push({
    id:`mgr1_${league.id}`,
    type:"manager",
    tag:"👔 MANAGER",tagColor:C.orange,
    headline:`${mgrName}: "This Group Has the Mentality of Champions"`,
    summary:`${mgrClub} head coach ${mgrName} speaks exclusively to FemmeFootⷭ about the title run-in, her tactical evolution and building a dynasty.`,
    body:`After training, ${mgrName} takes time to sit with FemmeFootⷭ. The ${mgrClub} head coach has transformed the side into genuine contenders and speaks with the clarity of someone who knows exactly what she's building.\n\n"The players trust the system and they trust each other — that's when you become hard to beat," she explains, gesturing across the empty pitch.\n\nOn pressing play: "We've spent months perfecting our shape out of possession. The data shows we're winning the ball back faster than any team in the ${league.short}. That's intentional."\n\nHer transfer philosophy: "I want leaders and learners. Someone who walks in on day one thinking they know everything — that's not the culture we're building."\n\nWith the title within reach: "One game at a time. But privately? I believe in this group completely."`,
    author:"Rachel Dawson", time:`${rand(3,36)}h ago`, readTime:"4 min read",
    club: mgrClub,
  });

  // Injury update
  const p3=pick(allPlayers)||{name:"Midfielder",club:pick(teams)};
  articles.push({
    id:`inj1_${league.id}`,
    type:"injury",
    tag:"🚑 INJURY UPDATE",tagColor:C.red,
    headline:`${p3.name} Faces ${rand(4,10)}-Week Spell on Sidelines`,
    summary:`${p3.club} have confirmed that ${p3.name} sustained a hamstring strain in training and will miss the next ${rand(4,8)} weeks of action in a major blow to their season.`,
    body:`The club's medical team confirmed the diagnosis after scans on Wednesday. ${p3.name} had been in excellent form recently, contributing ${rand(2,8)} goals and ${rand(1,5)} assists before the setback.\n\n"It's devastating news for her and for us," a club spokesperson said. "But she's mentally strong and we'll support her through the rehabilitation process fully."\n\nThe setback opens the door for younger squad members to stake their claims, with several academy prospects expected to feature in upcoming fixtures.`,
    author:"James Thornton", time:`${rand(1,12)}h ago`, readTime:"2 min read",
    club: p3.club,
  });

  // Transfer confirmed
  const p4=pick(allPlayers)||{name:"Another Star",club:pick(teams)};
  const src=pick(teams.filter(t=>t!==p4.club));
  articles.push({
    id:`tr2_${league.id}`,
    type:"transfer",
    tag:"✅ DONE DEAL",tagColor:C.accent,
    headline:`OFFICIAL: ${p4.name} Signs New Long-Term Deal at ${p4.club}`,
    summary:`${p4.club} have announced that ${p4.name} has committed her future to the club by signing a new ${rand(2,4)}-year contract, ending speculation about a possible departure.`,
    body:`The club confirmed the news via their official channels on Thursday morning, with the player expressing her delight at staying.\n\n"This club means everything to me," ${p4.name.split(" ")[0]} said in an official club statement. "We have unfinished business and I want to be part of writing the next chapter."\n\nSeveral top clubs had reportedly shown interest, including sides from Spain and Germany, but the player chose loyalty over a potentially lucrative move abroad.\n\nThe new deal includes a significant salary uplift, reflecting her status as one of the most important players in the ${league.short}. The club's sporting director confirmed the contract was the highest ever handed to a player in the club's women's team history.`,
    author:"FemmeFootⷭ Staff", time:`${rand(2,18)}h ago`, readTime:"3 min read",
    club: p4.club,
  });

  // Tactical analysis
  articles.push({
    id:`ana1_${league.id}`,
    type:"result",
    tag:"📊 TACTICS",tagColor:C.accent,
    headline:`How the ${league.short} Is Changing Women's Football Forever`,
    summary:`A deep dive into the tactical and financial evolution reshaping the league, from gegenpressing to record sponsorship deals.`,
    body:`The ${league.name} is undergoing a transformation that would have been unimaginable a decade ago. Transfer fees, wages, tactical sophistication and global viewership are all at record highs.\n\nThe shift to high-pressing, possession-based football has been dramatic. Over ${rand(60,80)}% of teams now operate some variation of a 4-3-3 or 4-2-3-1 in their base shape, compared to just ${rand(20,40)}% five seasons ago.\n\nData analytics has exploded: every top club now employs dedicated performance analysts tracking over 1,200 data points per player per game. Sprint speeds, pressing triggers, expected goals — nothing is left to chance.\n\nThe financial picture is equally transformative. Average club budgets have grown by ${rand(120,300)}% in five years. The top clubs now spend more on their women's squads than many men's clubs in lower professional leagues globally.\n\n"We're in a golden era," says one analyst who works with a top-six club. "The product on the pitch is world-class. It's only going to get bigger."`,
    author:"Dr. Lucy Fernandez", time:`${rand(6,48)}h ago`, readTime:"6 min read",
    featured:true,
  });

  return articles;
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge=({name,size=36})=>{
  const MAP={
    "Arsenal WFC":{bg:"#EF0107",t:"ARS",fg:"#fff"},
    "Chelsea FCW":{bg:"#034694",t:"CHE",fg:"#fff"},
    "Manchester City W":{bg:"#6CABDD",t:"MCW",fg:"#fff"},
    "Barcelona Femení":{bg:"#A50044",t:"FCB",fg:"#EDBB00"},
    "Lyon Féminin":{bg:"#C8102E",t:"OLF",fg:"#fff"},
    "PSG Féminines":{bg:"#004170",t:"PSG",fg:"#E30614"},
    "Wolfsburg W":{bg:"#65B32E",t:"WOB",fg:"#fff"},
    "Bayern München W":{bg:"#DC052D",t:"BAY",fg:"#fff"},
    "Gotham FC":{bg:"#23004C",t:"GOT",fg:"#fff"},
    "Portland Thorns":{bg:"#004812",t:"POR",fg:"#fff"},
    "Atlético Madrid W":{bg:"#CE3524",t:"ATM",fg:"#fff"},
    "Real Madrid CFF":{bg:"#FEBE10",t:"RMA",fg:"#001F5B"},
    "Juventus W":{bg:"#000",t:"JUV",fg:"#fff"},
    "Roma W":{bg:"#8E1F2F",t:"ROM",fg:"#DFA700"},
    "Rosengård":{bg:"#00529B",t:"ROS",fg:"#fff"},
    "Corinthians Fem":{bg:"#000",t:"COR",fg:"#fff"},
    "São Paulo Fem":{bg:"#C0392B",t:"SPF",fg:"#fff"},
    "Melbourne City W":{bg:"#6CADDF",t:"MCW",fg:"#fff"},
    "Tigres UANL Fem":{bg:"#F6A800",t:"TIG",fg:"#fff"},
    "Nippon TV Beleza":{bg:"#003087",t:"NTV",fg:"#fff"},
    "default":{bg:C.green1,t:"FC",fg:"#fff"},
  };
  const d=MAP[name]||MAP.default;
  const r=size/2;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:"50%",flexShrink:0}}>
      <circle cx={r} cy={r} r={r} fill={d.bg}/>
      <text x={r} y={r+size*.13} textAnchor="middle" fill={d.fg}
        fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize={size*.26}>{d.t.slice(0,3)}</text>
    </svg>
  );
};

const PlayerAvatar=({name,size=52})=>{
  const GRAD=[["#2dbd6e","#0f6e3a"],["#22b8cf","#0077a8"],["#f06595","#a01040"],
    ["#fcc419","#b8860b"],["#a9e34b","#5a8a00"],["#cc5de8","#7b00b4"],["#f56342","#a02010"]];
  const idx=(name?.charCodeAt(0)||0)%GRAD.length;
  const [c1,c2]=GRAD[idx];
  const initials=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const uid=`pg${idx}s${size}`;
  return(
    <svg width={size} height={size} viewBox="0 0 52 52" style={{borderRadius:"50%",flexShrink:0}}>
      <defs><linearGradient id={uid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/>
      </linearGradient></defs>
      <circle cx="26" cy="26" r="26" fill={`url(#${uid})`}/>
      <text x="26" y="32" textAnchor="middle" fill="#fff"
        fontFamily="'Oswald',sans-serif" fontWeight="700" fontSize="17">{initials}</text>
    </svg>
  );
};

const StatBar=({label,value,max,color=C.accent,unit=""})=>(
  <div style={{marginBottom:8}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{fontSize:11,color:C.textMuted}}>{label}</span>
      <span style={{fontSize:11,color:C.mint,fontWeight:700}}>{value}{unit}</span>
    </div>
    <div style={{height:4,background:C.border,borderRadius:2}}>
      <div style={{height:"100%",borderRadius:2,background:color,
        width:`${Math.min(100,(value/max)*100)}%`,transition:"width .7s ease"}}/>
    </div>
  </div>
);

const Chip=({label,color})=>(
  <span style={{fontSize:10,background:`${color||C.accent}22`,color:color||C.mint,
    borderRadius:20,padding:"2px 8px",fontWeight:700}}>{label}</span>
);

const BackBtn=({onClick})=>(
  <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:6,background:"none",
    border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontWeight:700,
    marginBottom:16,padding:0,fontFamily:"'Nunito',sans-serif"}}>
    ‹ Back
  </button>
);

const Stat=({v,l})=>(
  <div style={{textAlign:"center"}}>
    <div style={{fontSize:16,fontWeight:900,color:C.accent,fontFamily:"'Oswald',sans-serif"}}>{v}</div>
    <div style={{fontSize:9,color:C.textDim,marginTop:1}}>{l}</div>
  </div>
);

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// SCORES
const ScoresScreen=({league})=>{
  const [fixtures]=useState(()=>buildFixtures(league.id));
  const [sel,setSel]=useState(null);
  if(sel)return<MatchDetail match={sel} onBack={()=>setSel(null)}/>;
  const live=fixtures.filter(f=>f.status==="LIVE");
  const results=fixtures.filter(f=>f.status==="FT");
  const upcoming=fixtures.filter(f=>f.status==="upcoming");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {live.length>0&&<Section title="🔴 LIVE NOW">{live.map((m,i)=><MatchCard key={i} match={m} onClick={()=>setSel(m)}/>)}</Section>}
      <Section title="📅 Upcoming">{upcoming.map((m,i)=><MatchCard key={i} match={m} onClick={()=>setSel(m)}/>)}</Section>
      <Section title="✅ Results">{results.map((m,i)=><MatchCard key={i} match={m} onClick={()=>setSel(m)}/>)}</Section>
    </div>
  );
};

const MatchCard=({match,onClick})=>{
  const isLive=match.status==="LIVE";
  const isUpcoming=match.status==="upcoming";
  return(
    <div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
      padding:"14px 16px",cursor:"pointer",transition:"all .2s",
      borderLeft:isLive?`3px solid ${C.accent}`:isUpcoming?`3px solid ${C.mint}`:`3px solid ${C.border}`}}
      onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background=C.card;e.currentTarget.style.transform="";}}
    >
      {isLive&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:"pulse 1.2s infinite"}}/>
        <span style={{fontSize:10,fontWeight:800,color:C.accent,letterSpacing:1}}>LIVE {match.minute}'</span>
      </div>}
      {isUpcoming&&<div style={{fontSize:10,color:C.mint,marginBottom:6,letterSpacing:.5}}>📅 {match.date}</div>}
      {!isLive&&!isUpcoming&&<div style={{fontSize:10,color:C.textDim,marginBottom:6}}>{match.date}</div>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
          <Badge name={match.home} size={26}/>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>{match.home.split(" ").slice(0,2).join(" ")}</span>
        </div>
        <div style={{textAlign:"center",minWidth:52}}>
          {isUpcoming?<span style={{fontSize:11,color:C.textMuted}}>vs</span>
            :<span style={{fontSize:19,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif",letterSpacing:2}}>{match.hg} – {match.ag}</span>}
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end"}}>
          <span style={{fontSize:13,fontWeight:600,color:C.text,textAlign:"right"}}>{match.away.split(" ").slice(0,2).join(" ")}</span>
          <Badge name={match.away} size={26}/>
        </div>
      </div>
      {match.events?.filter(e=>e.type==="goal").length>0&&(
        <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
          {match.events.filter(e=>e.type==="goal").map((e,i)=>(
            <span key={i} style={{fontSize:10,color:C.textMuted,background:C.surface,borderRadius:4,padding:"2px 6px"}}>
              ⚽ {e.player.split(" ").pop()} {e.min}'
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const MatchDetail=({match,onBack})=>(
  <div>
    <BackBtn onClick={onBack}/>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:16}}>
      <div style={{background:`linear-gradient(135deg,${C.green1},${C.surface})`,padding:"28px 20px",textAlign:"center"}}>
        {match.status==="LIVE"&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.accent,animation:"pulse 1.2s infinite"}}/>
            <span style={{fontSize:11,fontWeight:800,color:C.accent,letterSpacing:2}}>LIVE · {match.minute}'</span>
          </div>
        )}
        <div style={{display:"flex",justifyContent:"space-around",alignItems:"center"}}>
          <div style={{textAlign:"center"}}><Badge name={match.home} size={54}/><div style={{fontSize:12,fontWeight:700,color:C.text,marginTop:6}}>{match.home}</div></div>
          <div style={{textAlign:"center"}}>
            {match.status==="upcoming"
              ?<div style={{fontSize:16,color:C.mint,fontWeight:800}}>vs</div>
              :<div style={{fontSize:46,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif",lineHeight:1}}>{match.hg} – {match.ag}</div>}
            <div style={{fontSize:10,color:C.textDim,marginTop:4}}>{match.status==="upcoming"?"Upcoming":match.status}</div>
          </div>
          <div style={{textAlign:"center"}}><Badge name={match.away} size={54}/><div style={{fontSize:12,fontWeight:700,color:C.text,marginTop:6}}>{match.away}</div></div>
        </div>
      </div>
      <div style={{padding:"16px 20px"}}>
        <h3 style={{color:C.mint,fontSize:11,letterSpacing:2,marginBottom:12}}>MATCH TIMELINE</h3>
        {match.events?.length===0&&<div style={{color:C.textDim,fontSize:13}}>No events recorded</div>}
        {match.events?.map((ev,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,
            flexDirection:ev.team==="away"?"row-reverse":"row"}}>
            <span style={{fontSize:10,fontWeight:700,color:C.accent,minWidth:28,textAlign:ev.team==="away"?"right":"left"}}>{ev.min}'</span>
            <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
              background:ev.type==="goal"?C.green1:ev.type==="yellow"?"rgba(240,192,64,.2)":"rgba(224,82,82,.2)"}}>
              <span style={{fontSize:14}}>{ev.type==="goal"?"⚽":ev.type==="yellow"?"🟨":"🟥"}</span>
            </div>
            <span style={{fontSize:12,color:C.text}}>{ev.player}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// TABLE
const StandingsScreen=({league})=>{
  const [rows]=useState(()=>buildStandings(league.id));
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
      <div style={{display:"grid",gridTemplateColumns:"26px 1fr 26px 22px 22px 22px 46px 32px",gap:2,
        padding:"10px 12px",borderBottom:`1px solid ${C.border}`,
        fontSize:10,color:C.textDim,fontWeight:800,letterSpacing:1}}>
        <span>#</span><span>Club</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span>
      </div>
      {rows.map((r,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"26px 1fr 26px 22px 22px 22px 46px 32px",gap:2,
          padding:"10px 12px",borderBottom:`1px solid ${C.border}22`,
          background:i===0?`${C.green1}44`:i<3?`${C.green1}18`:"transparent"}}>
          <span style={{fontSize:12,color:i<3?C.accent:C.textDim,fontWeight:800}}>{r.pos}</span>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <Badge name={r.team} size={16}/>
            <span style={{fontSize:11,color:C.text,fontWeight:i===0?800:400}}>{r.team.split(" ")[0]}</span>
          </div>
          {[r.p,r.w,r.d,r.l].map((v,j)=>(
            <span key={j} style={{fontSize:11,color:C.textMuted,textAlign:"center"}}>{v}</span>
          ))}
          <span style={{fontSize:11,color:r.gf-r.ga>=0?C.accent:C.red,textAlign:"center",fontWeight:700}}>
            {r.gf-r.ga>0?"+":""}{r.gf-r.ga}
          </span>
          <span style={{fontSize:14,fontWeight:900,color:C.white,textAlign:"center",fontFamily:"'Oswald',sans-serif"}}>{r.pts}</span>
        </div>
      ))}
      <div style={{padding:"10px 14px",display:"flex",gap:16,flexWrap:"wrap"}}>
        {[{c:C.accent,l:"Champions League"},{c:C.mint,l:"Title Zone"},{c:C.textDim,l:"Relegation"}].map((k,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:8,height:8,borderRadius:2,background:k.c}}/>
            <span style={{fontSize:10,color:C.textDim}}>{k.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PLAYERS
const PlayersScreen=({league})=>{
  const allPlayers=Object.entries(NAMED_PLAYERS)
    .filter(([club])=>TEAMS[league.id]?.includes(club))
    .flatMap(([,players])=>players);
  const [search,setSearch]=useState("");
  const [selPos,setSelPos]=useState("All");
  const [sel,setSel]=useState(null);
  const filtered=allPlayers.filter(p=>
    (!search||p.name.toLowerCase().includes(search.toLowerCase())||p.club.toLowerCase().includes(search.toLowerCase()))&&
    (selPos==="All"||p.pos===selPos)
  );
  if(sel)return<PlayerDetail player={sel} onBack={()=>setSel(null)}/>;
  return(
    <div>
      <input value={search} onChange={e=>setSearch(e.target.value)}
        placeholder="🔍  Search players or clubs…"
        style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${C.border}`,
          background:C.surface,color:C.text,fontSize:13,marginBottom:12,boxSizing:"border-box",outline:"none"}}/>
      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
        {["All","GK","CB","LB","RB","CDM","CM","CAM","LW","RW","CF","ST"].map(p=>(
          <button key={p} onClick={()=>setSelPos(p)}
            style={{padding:"4px 10px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,
              background:selPos===p?C.accent:C.surface,color:selPos===p?C.bg:C.textMuted,transition:"all .15s"}}>
            {p}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.length===0&&<div style={{color:C.textDim,textAlign:"center",padding:40}}>No players found</div>}
        {filtered.map((p,i)=>(
          <div key={i} onClick={()=>setSel(p)} style={{background:C.card,border:`1px solid ${C.border}`,
            borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,
            transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.card;}}>
            <PlayerAvatar name={p.name} size={44}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:13,fontWeight:700,color:C.text}}>{p.name}</span>
                <span style={{fontSize:9,background:C.green1,color:C.mintSoft,borderRadius:4,padding:"1px 5px"}}>{p.pos}</span>
              </div>
              <div style={{fontSize:11,color:C.textMuted}}>{p.club.split(" ").slice(0,2).join(" ")} · {p.nationality.slice(0,2)}</div>
              <div style={{display:"flex",gap:10,marginTop:5}}>
                {p.pos==="GK"
                  ?<><Stat v={p.cleanSheets} l="CS"/><Stat v={p.apps} l="Apps"/></>
                  :<><Stat v={p.goals} l="⚽"/><Stat v={p.assists} l="🎯"/></>}
                <Stat v={p.rating} l="★"/>
                <Stat v={`${p.intlFlag}${p.intlCaps}`} l="Caps"/>
              </div>
            </div>
            <span style={{color:C.textDim,fontSize:18}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlayerDetail=({player:p,onBack})=>{
  const [tab,setTab]=useState("overview");
  return(
    <div>
      <BackBtn onClick={onBack}/>
      {/* Hero */}
      <div style={{background:`linear-gradient(145deg,${C.green1}dd,${C.surface})`,
        borderRadius:16,padding:"24px 20px",marginBottom:12,
        border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
          <PlayerAvatar name={p.name} size={68}/>
          <div style={{flex:1}}>
            <div style={{fontSize:22,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif"}}>{p.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
              <Badge name={p.club} size={20}/>
              <span style={{fontSize:12,color:C.mintSoft}}>{p.club}</span>
            </div>
            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
              <Chip label={p.pos} color={C.accent}/>
              <Chip label={p.nationality}/>
              <Chip label={`Age ${p.age}`}/>
              <Chip label={p.marketValue} color={C.gold}/>
            </div>
          </div>
        </div>
        {/* Quick stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {(p.pos==="GK"
            ?[{l:"Clean Sheets",v:p.cleanSheets},{l:"Appearances",v:p.apps},{l:"Rating",v:`★ ${p.rating}`},{l:"Intl Caps",v:`${p.intlFlag} ${p.intlCaps}`}]
            :[{l:"Goals",v:p.goals},{l:"Assists",v:p.assists},{l:"Rating",v:`★ ${p.rating}`},{l:"Intl Caps",v:`${p.intlFlag} ${p.intlCaps}`}]
          ).map((s,i)=>(
            <div key={i} style={{background:`${C.bg}88`,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:17,fontWeight:900,color:C.accent,fontFamily:"'Oswald',sans-serif"}}>{s.v}</div>
              <div style={{fontSize:9,color:C.textDim,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[["overview","📋 Overview"],["stats","📊 Stats"],["career","🏆 Career"],["intl","🌍 International"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{flex:1,padding:"7px 4px",borderRadius:10,border:"none",cursor:"pointer",
              fontSize:10,fontWeight:800,transition:"all .15s",
              background:tab===k?C.accent:C.surface,color:tab===k?C.bg:C.textMuted}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="overview"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <p style={{color:C.textMuted,fontSize:13,lineHeight:1.7,marginBottom:18}}>{p.bio}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[{l:"Height",v:p.height},{l:"Preferred Foot",v:p.foot},{l:"Contract Until",v:p.contractUntil},{l:"At Club Since",v:p.currentClubSince}].map((s,i)=>(
              <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{s.l}</div>
                <div style={{fontSize:14,fontWeight:700,color:C.mint}}>{s.v}</div>
              </div>
            ))}
          </div>
          {p.trophies?.length>0&&(
            <>
              <h4 style={{color:C.mint,fontSize:11,letterSpacing:2,marginBottom:10}}>🏆 TROPHIES</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {p.trophies.map((t,i)=>(
                  <span key={i} style={{fontSize:11,background:`${C.gold}22`,color:C.gold,
                    borderRadius:20,padding:"4px 10px",fontWeight:700}}>🥇 {t}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab==="stats"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <h4 style={{color:C.mint,fontSize:11,letterSpacing:2,marginBottom:14}}>SEASON STATISTICS</h4>
          <StatBar label="Appearances" value={p.apps} max={30}/>
          {p.pos==="GK"
            ?<StatBar label="Clean Sheets" value={p.cleanSheets} max={20} color={C.mint}/>
            :<>
              <StatBar label="Goals" value={p.goals} max={25}/>
              <StatBar label="Assists" value={p.assists} max={18} color={C.mint}/>
              <StatBar label="Shot Accuracy" value={p.shotAcc} max={100} color={C.yellow} unit="%"/>
            </>}
          <StatBar label="Pass Accuracy" value={p.passAcc} max={100} color={C.blue} unit="%"/>
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <div style={{flex:1,background:`rgba(240,192,64,.12)`,borderRadius:10,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:C.yellow,fontFamily:"'Oswald',sans-serif"}}>{p.yellowCards}</div>
              <div style={{fontSize:10,color:C.textDim}}>🟨 Yellow</div>
            </div>
            <div style={{flex:1,background:`rgba(224,82,82,.12)`,borderRadius:10,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:C.red,fontFamily:"'Oswald',sans-serif"}}>{p.redCards}</div>
              <div style={{fontSize:10,color:C.textDim}}>🟥 Red</div>
            </div>
            <div style={{flex:1,background:`rgba(45,189,110,.12)`,borderRadius:10,padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:900,color:C.accent,fontFamily:"'Oswald',sans-serif"}}>{p.rating}</div>
              <div style={{fontSize:10,color:C.textDim}}>★ Rating</div>
            </div>
          </div>
        </div>
      )}

      {tab==="career"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <h4 style={{color:C.mint,fontSize:11,letterSpacing:2,marginBottom:14}}>CAREER HISTORY</h4>
          {/* Current club */}
          <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12,
            background:C.surface,borderRadius:12,padding:"12px 14px",
            border:`1px solid ${C.accent}44`}}>
            <div style={{width:38,alignItems:"center",display:"flex",flexDirection:"column",gap:4}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:C.accent}}/>
              <div style={{width:2,flex:1,background:`${C.border}`,borderRadius:1,minHeight:30}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:C.accent,fontWeight:800,marginBottom:2}}>{p.currentClubSince} – Present</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Badge name={p.club} size={22}/>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.white}}>{p.club}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{p.pos} · {p.apps} apps · {p.goals||p.cleanSheets} {p.pos==="GK"?"CS":"goals"}</div>
                </div>
              </div>
              <div style={{marginTop:6}}>
                <span style={{fontSize:10,background:`${C.accent}22`,color:C.mint,borderRadius:20,padding:"2px 8px"}}>CURRENT</span>
              </div>
            </div>
          </div>
          {/* Previous clubs */}
          {p.prevClubs.map((c,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10,
              background:C.surface,borderRadius:12,padding:"12px 14px",opacity:.85}}>
              <div style={{width:38,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:C.border}}/>
                {i<p.prevClubs.length-1&&<div style={{width:2,flex:1,background:`${C.border}88`,minHeight:20}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textDim,fontWeight:700,marginBottom:4}}>{c.from} – {c.to}</div>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{c.club}</div>
                <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>
                  {c.apps} apps{c.goals>0?` · ${c.goals} goals`:""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="intl"&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,
            background:`linear-gradient(135deg,${C.green1}88,${C.surface})`,
            borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:40}}>{p.intlFlag}</div>
            <div>
              <div style={{fontSize:18,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif"}}>{p.intlTeam}</div>
              <div style={{fontSize:12,color:C.textMuted}}>International Career</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
            <div style={{background:C.surface,borderRadius:10,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:900,color:C.accent,fontFamily:"'Oswald',sans-serif"}}>{p.intlCaps}</div>
              <div style={{fontSize:11,color:C.textDim}}>International Caps</div>
            </div>
            <div style={{background:C.surface,borderRadius:10,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:900,color:C.mint,fontFamily:"'Oswald',sans-serif"}}>{p.intlGoals}</div>
              <div style={{fontSize:11,color:C.textDim}}>International Goals</div>
            </div>
          </div>
          <StatBar label="Goals per Cap" value={p.intlGoals} max={Math.max(p.intlCaps,1)} color={C.mint}/>
          <div style={{background:C.surface,borderRadius:10,padding:"12px",marginTop:14}}>
            <div style={{fontSize:11,color:C.textMuted,lineHeight:1.6}}>
              {p.name.split(" ")[0]} made her international debut in {2014+rand(0,8)} and has been a consistent presence for {p.intlTeam}. 
              She has represented her country at {rand(1,3)} major tournaments and is considered one of the most important players in her nation's setup.
              {p.intlCaps>=50?" A true international stalwart, she recently surpassed the 50-cap milestone.":""}
            </div>
          </div>
          {/* Intl tournament record */}
          <h4 style={{color:C.mint,fontSize:11,letterSpacing:2,margin:"16px 0 10px"}}>TOURNAMENT RECORD</h4>
          {[
            {t:"FIFA Women's World Cup",years:`${2019+rand(0,4)}`,result:pick(["Group Stage","Round of 16","Quarter-Final","Semi-Final","Final","Winner"])},
            {t:"Continental Championship",years:`${2021+rand(0,2)}`,result:pick(["Group Stage","Semi-Final","Runner-Up","Winner"])},
            {t:"Olympic Games",years:`${2020+rand(0,4)}`,result:pick(["Group Stage","Quarter-Final","Semi-Final","Bronze","Silver","Gold"])},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"10px 0",borderBottom:`1px solid ${C.border}22`}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{r.t}</div>
                <div style={{fontSize:10,color:C.textDim}}>{r.years}</div>
              </div>
              <Chip label={r.result} color={r.result.includes("Winner")||r.result==="Gold"?C.gold:C.textMuted}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// STATS SCREEN
const StatsScreen=({league})=>{
  const allPlayers=Object.entries(NAMED_PLAYERS)
    .filter(([club])=>TEAMS[league.id]?.includes(club))
    .flatMap(([,players])=>players);
  const [tab,setTab]=useState("goals");
  const topScorers=[...allPlayers].filter(p=>p.pos!=="GK").sort((a,b)=>b.goals-a.goals).slice(0,10);
  const topAssists=[...allPlayers].filter(p=>p.pos!=="GK").sort((a,b)=>b.assists-a.assists).slice(0,10);
  const topCS=[...allPlayers].filter(p=>p.pos==="GK").sort((a,b)=>b.cleanSheets-a.cleanSheets).slice(0,8);
  const topRated=[...allPlayers].sort((a,b)=>b.rating-a.rating).slice(0,10);
  const data=tab==="goals"?topScorers:tab==="assists"?topAssists:tab==="cs"?topCS:topRated;
  const vKey=tab==="goals"?"goals":tab==="assists"?"assists":tab==="cs"?"cleanSheets":"rating";
  const vLabel=tab==="goals"?"⚽ Goals":tab==="assists"?"🎯 Ast":tab==="cs"?"🧤 CS":"★ Rtg";
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:16}}>
        {[["goals","⚽ Goals"],["assists","🎯 Assists"],["cs","🧤 CS"],["rated","★ Rating"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:"8px 4px",borderRadius:10,border:"none",cursor:"pointer",fontSize:10,fontWeight:800,
            background:tab===k?C.accent:C.surface,color:tab===k?C.bg:C.textMuted,transition:"all .15s"}}>
            {l}
          </button>
        ))}
      </div>
      {data.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,
          background:C.card,borderRadius:10,padding:"10px 14px",marginBottom:6,
          border:`1px solid ${i===0?C.accent:C.border}`,
          boxShadow:i===0?`0 0 12px ${C.accent}22`:"none"}}>
          <span style={{fontSize:14,fontWeight:900,color:i===0?C.gold:i<3?C.accent:C.textDim,
            minWidth:24,fontFamily:"'Oswald',sans-serif"}}>{i+1}</span>
          <PlayerAvatar name={p.name} size={36}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>{p.name}</div>
            <div style={{fontSize:10,color:C.textDim}}>{p.club.split(" ")[0]} · {p.pos} · {p.nationality.slice(0,2)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:i===0?C.gold:C.accent,fontFamily:"'Oswald',sans-serif"}}>{p[vKey]}</div>
            <div style={{fontSize:9,color:C.textDim}}>{vLabel}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// NEWS SCREEN
const NewsScreen=({league})=>{
  const [articles]=useState(()=>generateNews(league));
  const [sel,setSel]=useState(null);
  if(sel)return<ArticleDetail article={sel} onBack={()=>setSel(null)}/>;
  const featured=articles.find(a=>a.featured)||articles[0];
  const rest=articles.filter(a=>a!==featured);
  return(
    <div>
      {/* Featured */}
      <div onClick={()=>setSel(featured)} style={{
        background:`linear-gradient(145deg,${C.green1},${C.surface})`,
        border:`1px solid ${C.border}`,borderRadius:16,padding:"20px",
        marginBottom:14,cursor:"pointer",transition:"all .2s",
        boxShadow:`0 4px 24px ${C.bg}88`}}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="";}}
      >
        <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20,
            background:`${featured.tagColor}22`,color:featured.tagColor}}>{featured.tag}</span>
          <span style={{fontSize:10,color:C.textDim}}>⏱ {featured.time}</span>
          <span style={{fontSize:10,color:C.textDim}}>📖 {featured.readTime}</span>
        </div>
        <h2 style={{fontSize:17,fontWeight:900,color:C.white,lineHeight:1.3,margin:"0 0 10px",
          fontFamily:"'Oswald',sans-serif"}}>{featured.headline}</h2>
        <p style={{fontSize:12,color:C.textMuted,lineHeight:1.6,margin:"0 0 12px"}}>{featured.summary}</p>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:C.textDim}}>By {featured.author}</span>
          <span style={{fontSize:11,color:C.accent,fontWeight:700}}>Read full story →</span>
        </div>
      </div>

      {/* Transfer ticker */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
        padding:"10px 14px",marginBottom:14,overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:C.blue,animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:10,fontWeight:800,color:C.blue,letterSpacing:1}}>TRANSFER TICKER</span>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {articles.filter(a=>a.type==="transfer").concat(articles.filter(a=>a.type==="transfer")).map((a,i)=>(
            <div key={i} onClick={()=>setSel(a)} style={{flexShrink:0,background:C.surface,borderRadius:8,
              padding:"8px 12px",cursor:"pointer",minWidth:200}}>
              <div style={{fontSize:9,color:C.blue,fontWeight:800,marginBottom:3}}>{a.tag}</div>
              <div style={{fontSize:11,fontWeight:700,color:C.text,lineHeight:1.3}}>{a.headline.slice(0,60)}…</div>
            </div>
          ))}
        </div>
      </div>

      {/* Article list */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {rest.map((a,i)=>(
          <div key={i} onClick={()=>setSel(a)} style={{
            background:C.card,border:`1px solid ${C.border}`,borderRadius:12,
            padding:"14px 16px",cursor:"pointer",transition:"all .2s",
            display:"flex",gap:12,alignItems:"flex-start"}}
            onMouseEnter={e=>{e.currentTarget.style.background=C.cardHover;}}
            onMouseLeave={e=>{e.currentTarget.style.background=C.card;}}>
            <div style={{width:44,height:44,borderRadius:10,background:`${a.tagColor}22`,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>
              {a.tag.split(" ")[0]}
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                <span style={{fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:20,
                  background:`${a.tagColor}22`,color:a.tagColor}}>{a.tag}</span>
                <span style={{fontSize:9,color:C.textDim}}>⏱ {a.time}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:C.text,lineHeight:1.3,marginBottom:4}}>{a.headline}</div>
              <div style={{fontSize:11,color:C.textMuted,lineHeight:1.5}}>{a.summary.slice(0,90)}…</div>
              <div style={{fontSize:10,color:C.textDim,marginTop:6}}>By {a.author} · {a.readTime}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticleDetail=({article:a,onBack})=>(
  <div>
    <BackBtn onClick={onBack}/>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden"}}>
      <div style={{background:`linear-gradient(135deg,${a.tagColor}33,${C.surface})`,padding:"24px 20px",
        borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:20,
          background:`${a.tagColor}33`,color:a.tagColor,marginBottom:12,display:"inline-block"}}>{a.tag}</span>
        <h1 style={{fontSize:20,fontWeight:900,color:C.white,lineHeight:1.25,margin:"12px 0",
          fontFamily:"'Oswald',sans-serif"}}>{a.headline}</h1>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <span style={{fontSize:11,color:C.textMuted}}>✍️ {a.author}</span>
          <span style={{fontSize:11,color:C.textDim}}>⏱ {a.time}</span>
          <span style={{fontSize:11,color:C.textDim}}>📖 {a.readTime}</span>
        </div>
      </div>
      <div style={{padding:"20px"}}>
        <p style={{fontSize:14,fontWeight:700,color:C.mint,lineHeight:1.6,marginBottom:18,
          borderLeft:`3px solid ${C.accent}`,paddingLeft:14}}>{a.summary}</p>
        {a.body.split("\n\n").map((para,i)=>(
          <p key={i} style={{fontSize:13,color:C.text,lineHeight:1.75,marginBottom:14}}>{para}</p>
        ))}
        {a.exclusive&&(
          <div style={{background:`${C.gold}11`,border:`1px solid ${C.gold}44`,borderRadius:12,
            padding:"12px 16px",marginTop:20,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:20}}>⭐</span>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:C.gold}}>FEMMEFOOT EXCLUSIVE</div>
              <div style={{fontSize:11,color:C.textMuted}}>This interview was conducted exclusively for FemmeFootⷭ.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── SECTION + HELPERS ────────────────────────────────────────────────────────
const Section=({title,children})=>(
  <div>
    <h3 style={{color:C.mint,fontSize:11,fontWeight:800,letterSpacing:2,marginBottom:10}}>{title}</h3>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>{children}</div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [activeTab,setActiveTab]=useState("scores");
  const [selLeague,setSelLeague]=useState(LEAGUES[0]);
  const [selConf,setSelConf]=useState("Europe");
  const confs=["Europe","CONCACAF","CONMEBOL","AFC","CAF","Global"];
  const filteredLeagues=LEAGUES.filter(l=>l.conf===selConf);

  const tabs=[
    {id:"scores",icon:"⚽",label:"Scores"},
    {id:"table",icon:"📊",label:"Table"},
    {id:"players",icon:"👤",label:"Players"},
    {id:"stats",icon:"📈",label:"Stats"},
    {id:"news",icon:"📰",label:"News"},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Nunito','sans-serif'",
      color:C.text,maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700;900&family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.4)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:${C.surface}}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        input{font-family:'Nunito',sans-serif}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:`linear-gradient(180deg,${C.surface} 0%,${C.bg} 100%)`,
        borderBottom:`1px solid ${C.border}`,padding:"14px 16px 0",
        position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)"}}>
        {/* Logo row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,
              background:`linear-gradient(135deg,${C.accent},${C.green1})`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
              boxShadow:`0 0 14px ${C.accent}44`}}>⚽</div>
            <div>
              <div style={{fontSize:18,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif",
                letterSpacing:2,lineHeight:1}}>FEMMEFOOT</div>
              <div style={{fontSize:8,color:C.textDim,letterSpacing:3,fontWeight:700}}>WOMEN'S FOOTBALL WORLDWIDE</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,background:`${C.accent}18`,
            borderRadius:20,padding:"4px 10px"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:"pulse 2s infinite"}}/>
            <span style={{fontSize:10,color:C.accent,fontWeight:800}}>LIVE</span>
          </div>
        </div>
        {/* Confederation selector */}
        <div style={{display:"flex",gap:5,overflowX:"auto",marginBottom:8,paddingBottom:2}}>
          {confs.map(c=>(
            <button key={c} onClick={()=>{setSelConf(c);setSelLeague(LEAGUES.find(l=>l.conf===c)||LEAGUES[0]);}}
              style={{flexShrink:0,padding:"4px 10px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:10,fontWeight:800,transition:"all .15s",
                background:selConf===c?C.green2:C.surface,
                color:selConf===c?C.mintSoft:C.textDim}}>
              {c}
            </button>
          ))}
        </div>
        {/* League selector */}
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:10}}>
          {filteredLeagues.map(l=>(
            <button key={l.id} onClick={()=>setSelLeague(l)}
              style={{flexShrink:0,padding:"5px 12px",borderRadius:20,border:"none",cursor:"pointer",
                fontSize:11,fontWeight:700,transition:"all .15s",
                background:selLeague.id===l.id?C.accent:C.surface,
                color:selLeague.id===l.id?C.bg:C.textMuted,
                boxShadow:selLeague.id===l.id?`0 2px 10px ${C.accent}44`:"none"}}>
              {l.country} {l.short}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 90px",animation:"slideIn .3s ease"}}>
        <div style={{marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{fontSize:14,fontWeight:900,color:C.white,fontFamily:"'Oswald',sans-serif"}}>{selLeague.name}</h2>
            <div style={{fontSize:10,color:C.textDim}}>{selLeague.country} · {selLeague.conf}</div>
          </div>
          <div style={{fontSize:20}}>{selLeague.country}</div>
        </div>
        {activeTab==="scores"  &&<ScoresScreen   key={selLeague.id+"s"} league={selLeague}/>}
        {activeTab==="table"   &&<StandingsScreen key={selLeague.id+"t"} league={selLeague}/>}
        {activeTab==="players" &&<PlayersScreen   key={selLeague.id+"p"} league={selLeague}/>}
        {activeTab==="stats"   &&<StatsScreen     key={selLeague.id+"st"} league={selLeague}/>}
        {activeTab==="news"    &&<NewsScreen      key={selLeague.id+"n"} league={selLeague}/>}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:480,
        background:`${C.surface}f5`,backdropFilter:"blur(16px)",
        borderTop:`1px solid ${C.border}`,display:"flex",
        boxShadow:`0 -4px 20px ${C.bg}cc`}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{flex:1,padding:"11px 4px 13px",border:"none",background:"none",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all .15s",
              position:"relative"}}>
            <span style={{fontSize:19,filter:activeTab===t.id?"drop-shadow(0 0 6px "+C.accent+"bb)":"grayscale(.7) opacity(.6)",
              transition:"filter .2s"}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:800,letterSpacing:.5,
              color:activeTab===t.id?C.accent:C.textDim}}>{t.label}</span>
            {activeTab===t.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
              width:28,height:2,borderRadius:"0 0 2px 2px",background:C.accent,
              boxShadow:`0 0 8px ${C.accent}`}}/>}
          </button>
        ))}
      </div>
    </div>
  );
}
