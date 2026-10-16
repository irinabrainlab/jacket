export const SALON = {
  label: 'JACKET, Kičevska 8, Vračar',
  lat: 44.8039838,
  lon: 20.4737943,
}

const PARKING = {
  sr: 'Oko salona je žuta zona parkiranja (Kičevska 1–15 i parna strana do 30), a kraj ulice prema broju 21 je zelena. Ako u ulici nema mesta, najbliže garaže su Baba Višnjina i Vukov spomenik.',
  en: 'Around the shop the parking zone is yellow (Kičevska 1–15 and the even side up to 30), and the end of the street toward number 21 is green. If the street is full, the nearest garages are Baba Višnjina and Vukov spomenik.',
}

function haversine(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLon = (lon2 - lon1) * rad
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function inferSide(lat, lon) {
  const km = haversine(lat, lon, SALON.lat, SALON.lon)
  if (km < 2.2) return 'local'
  if (lon < 20.4 && lat > 44.83) return 'zemun'
  if (lon < 20.44 && lat >= 44.785) return 'newbelgrade'
  if (lon < 20.45 && lat < 44.785) return 'cukarica'
  if (lat > 44.835) return 'danube-north'
  if (lon > 20.5) return 'east'
  if (lat < 44.78) return 'south'
  return 'center'
}

function traffic(now) {
  const day = now.getDay()
  const mins = now.getHours() * 60 + now.getMinutes()
  if (day === 0) return 'quiet'
  if (day === 6) return mins >= 11 * 60 && mins <= 14 * 60 ? 'moderate' : 'quiet'
  const morning = mins >= 7 * 60 + 30 && mins <= 9 * 60 + 30
  const evening = mins >= 15 * 60 + 30 && mins <= 18 * 60 + 30
  if (morning || evening) return 'peak'
  if (mins >= 14 * 60 && mins < 15 * 60 + 30) return 'moderate'
  return 'quiet'
}

function routeCopy(side, level) {
  const peak = level === 'peak'
  if (side === 'newbelgrade' || side === 'newbelgrade-south') {
    return peak
      ? {
          title: 'Most na Adi, ne Gazela',
          body: 'U špicu Gazela prema Autokomandi obično stoji. Sa Novog Beograda ka Vračaru je mirnije preko Mosta na Adi, pa Radničkom do Autokomande. Brankov most ima smisla samo ako ste na severu Novog Beograda i već idete ka centru.',
        }
      : {
          title: 'Gazela je sada kraća',
          body: 'Van špica je Gazela najkraći put do Vračara: preko mosta, pa Autokomanda. Ako krenete posle 15:30, pređite na Most na Adi.',
        }
  }
  if (side === 'zemun') {
    return peak
      ? {
          title: 'Brankov most, pa kroz grad',
          body: 'Iz Zemuna u špicu Gazela zna da bude sporija od Brankovog. Pređite Brankov i držite se ka Slaviji, umesto da se vraćate na Gazelu.',
        }
      : {
          title: 'Brankov most',
          body: 'Iz Zemuna je prirodan Brankov most, pa kroz Savski venac ka Vračaru. Van špica može i Gazela ako ste već na autoputu.',
        }
  }
  if (side === 'danube-north') {
    return peak
      ? {
          title: 'Pančevački most traži vreme',
          body: 'Sa Borče i Krnjače se u grad ulazi preko Pančevačkog mosta, a u špicu se tu čeka. Krenite ranije. Posle mosta idite ka Vukovom spomeniku, ne kroz centar.',
        }
      : {
          title: 'Pančevački most, pa Vukov spomenik',
          body: 'Preko Pančevačkog mosta, pa dalje ka Vukovom spomeniku. Kičevska je odmah tu.',
        }
  }
  if (side === 'east') {
    return peak
      ? {
          title: 'Izbegnite Bulevar kralja Aleksandra',
          body: 'U špicu bulevar od Cvetkove ka centru stoji. Držite se Ustaničke i sporednih ulica ka Vračaru, umesto da silazite do Slavije.',
        }
      : {
          title: 'Kratko, bez mosta',
          body: 'Sa istoka Beograda nema mosta. Najmirnije je prema Vukovom spomeniku i odatle u Kičevsku.',
        }
  }
  if (side === 'cukarica') {
    return peak
      ? {
          title: 'Ada, pa Autokomanda',
          body: 'Sa Banovog brda i Čukarice u špicu ne ulazite na Gazelu ako možete na Adu. Ada vas izvede ka Radničkoj, a odatle su Autokomanda i Vračar.',
        }
      : {
          title: 'Preko Ade ili Gazele',
          body: 'Oba mosta vode ka Autokomandi. Van špica je Gazela direktnija ako ste već na Obrenovačkom putu.',
        }
  }
  if (side === 'south') {
    return {
      title: 'Južni bulevar',
      body: peak
        ? 'Sa juga je put kratak, ali Južni bulevar u špicu uspori pred Autokomandom. Ostavite desetak minuta više.'
        : 'Sa juga ste blizu. Južni bulevar vas dovede do Vračara bez mosta.',
    }
  }
  if (side === 'local') {
    return {
      title: 'Već ste blizu',
      body: 'Do Kičevske vam treba par minuta. Ako idete kolima, prvo nađite mesto za parkiranje.',
    }
  }
  return {
    title: 'Bez mosta, pazite na parking',
    body: 'Put je kratak. Više vremena ćete izgubiti na parkiranju nego u vožnji.',
  }
}

function closing(day) {
  if (day === 0) return null
  return { open: 8 * 60, close: day === 6 ? 15 * 60 : 20 * 60, label: day === 6 ? '15:00' : '20:00' }
}

function clock(date, lang) {
  return date.toLocaleTimeString(lang === 'en' ? 'en-GB' : 'sr-RS', { hour: '2-digit', minute: '2-digit' })
}

function hoursNote(arrival, now, lang) {
  const day = arrival.getDay()
  const mins = arrival.getHours() * 60 + arrival.getMinutes()
  const hours = closing(day)
  const nextDay = arrival.toDateString() !== now.toDateString()
  const time = clock(arrival, lang)
  const en = lang === 'en'
  if (!hours) {
    return {
      tone: 'bad',
      text: en
        ? 'We are closed on Sunday, so we cannot take clothes in today. Come on Monday from 8 to 20.'
        : 'Nedeljom ne radimo, pa stvari danas ne možemo da primimo. Dođite u ponedeljak od 8 do 20.',
    }
  }
  if (nextDay && mins < hours.open) {
    return {
      tone: 'bad',
      text: en
        ? `The shop is already closed. By this estimate you arrive around ${time}, and we open at 8:00. We cannot take clothes in tonight.`
        : `Salon je već zatvoren. Po ovoj proceni stižete oko ${time}, a otvaramo u 8:00. Večeras ne možemo da primimo stvari.`,
    }
  }
  if (mins < hours.open) {
    return {
      tone: 'wait',
      text: en
        ? 'You arrive before we open. The shop opens at 8:00, and we cannot take clothes in before that.'
        : 'Stižete pre otvaranja. Salon radi od 8:00, i pre toga ne možemo da primimo stvari.',
    }
  }
  if (mins >= hours.close) {
    return {
      tone: 'bad',
      text: en
        ? `By this estimate you arrive after ${hours.label}, when we close. We cannot take clothes in today, so we cannot start the cleaning either. Leave earlier or come on the next working day.`
        : `Po ovoj proceni stižete posle ${hours.label}, kad zatvaramo. Danas ne možemo da primimo stvari, pa ni da krenemo sa čišćenjem. Krenite ranije ili dođite sledećeg radnog dana.`,
    }
  }
  if (hours.close - mins <= 25) {
    return {
      tone: 'tight',
      text: en
        ? `You arrive around ${time}, and we close at ${hours.label}. It is tight: if traffic or parking holds you up, you may not hand the clothes in today.`
        : `Stižete oko ${time}, a zatvaramo u ${hours.label}. Tesno je: ako vas zadrže gužva ili parking, možda ne stignete da predate stvari danas.`,
    }
  }
  return {
    tone: 'ok',
    text: en
      ? `You arrive around ${time}, and we are open until ${hours.label}. There is time to hand the clothes in at the shop.`
      : `Stižete oko ${time}, a radimo do ${hours.label}. Imate vremena da predate stvari na licu mesta.`,
  }
}

function minutesFor(origin, level) {
  const km = haversine(origin.lat, origin.lon, SALON.lat, SALON.lon)
  const base = origin.baseMin ?? Math.max(6, Math.round(km * 2.4))
  const crosses =
    origin.side === 'newbelgrade' ||
    origin.side === 'newbelgrade-south' ||
    origin.side === 'zemun' ||
    origin.side === 'danube-north' ||
    origin.side === 'cukarica'
  const factor = level === 'peak' ? (crosses ? 1.75 : 1.4) : level === 'moderate' ? 1.25 : 1.05
  return Math.max(5, Math.round(base * factor))
}

export function buildAdvice(origin, now = new Date(), drivenMinutes, lang = 'sr') {
  const level = traffic(now)
  const side = origin.side ?? inferSide(origin.lat, origin.lon)
  const minutes = drivenMinutes ?? minutesFor({ ...origin, side }, level)
  const arrival = new Date(now.getTime() + minutes * 60 * 1000)
  const route = routeCopy(side, level)
  return {
    from: origin.label,
    minutes,
    arrivalLabel: clock(arrival, lang),
    level,
    route,
    hours: hoursNote(arrival, now, lang),
    parking: PARKING[lang] ?? PARKING.sr,
    measured: drivenMinutes != null,
  }
}

export function yandexUrl(from, lang = 'sr') {
  const params = new URLSearchParams({
    'start-lat': String(from.lat),
    'start-lon': String(from.lon),
    'end-lat': String(SALON.lat),
    'end-lon': String(SALON.lon),
    tariffClass: 'econom',
    ref: 'jacket',
    appmetrica_tracking_id: '1178268795219780156',
    lang: lang === 'en' ? 'en' : 'sr',
  })
  return `https://3.redirect.appmetrica.yandex.com/route?${params}`
}

export function googleUrl(from) {
  const params = new URLSearchParams({
    api: '1',
    origin: `${from.lat},${from.lon}`,
    destination: `${SALON.lat},${SALON.lon}`,
    travelmode: 'driving',
  })
  return `https://www.google.com/maps/dir/?${params}`
}

export function inBelgrade(lat, lon) {
  return lat > 44.6 && lat < 45.05 && lon > 20.2 && lon < 20.7
}

const cyrillic = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ђ: 'đ', е: 'e', ж: 'ž', з: 'z', и: 'i', ј: 'j',
  к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  ћ: 'ć', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'č', џ: 'dž', ш: 'š',
}

export function toLatin(text) {
  return [...text]
    .map((char) => {
      const mapped = cyrillic[char.toLowerCase()]
      if (!mapped) return char
      if (char === char.toLowerCase()) return mapped
      return mapped.charAt(0).toUpperCase() + mapped.slice(1)
    })
    .join('')
}

export async function shortestRoute(from) {
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${SALON.lon},${SALON.lat}?alternatives=true&steps=true&overview=false`,
  )
  if (!response.ok) return null
  const data = await response.json()
  if (data.code !== 'Ok' || !data.routes?.length) return null
  const route = data.routes.reduce((best, item) => (item.distance < best.distance ? item : best))
  const roads = []
  for (const step of route.legs?.[0]?.steps ?? []) {
    if (step.distance < 200) continue
    const name = toLatin(step.name?.trim() ?? '')
    if (!name || roads.at(-1) === name) continue
    roads.push(name)
  }
  return {
    km: Math.round(route.distance / 100) / 10,
    minutes: Math.max(1, Math.round(route.duration / 60)),
    roads,
  }
}
