// Legal page content (English + Bulgarian).
//
// FILL IN `OPERATOR` before publishing: GDPR and the App Store require the
// operator's identity and a contact address. Empty fields are simply hidden.
// Have a lawyer review these texts - they describe how the app really works
// (see the app's data flows), but they are not legal advice.

export const OPERATOR = {
  name: '',      // legal name of the person / company running SideQuest
  address: '',   // registered address
  email: '',     // contact e-mail for privacy requests and moderation
};

export const LAST_UPDATED = '2026-10-14';

export const LEGAL = {
  en: {
    updatedLabel: 'Last updated',
    contactTitle: 'Contact',
    contactLead: 'Operator of SideQuest and controller of your personal data:',
    inApp: 'You can also reach us from the app: Profile → Contact support.',
    privacy: {
      title: 'Privacy Policy',
      intro:
        'SideQuest is a location-based app where you complete real-world missions, earn rewards and share your progress. This policy explains what data we collect, why, who processes it and what control you have.',
      sections: [
        {
          h: '1. Data we collect',
          ul: [
            'Account data: e-mail address, password (stored only as a secure hash by our authentication provider), or the identifier returned by Google / Apple sign-in; username, display name, age, city, bio, avatar and profile theme.',
            'Location: your precise GPS position while the app is open, used to show missions near you and to verify that a proof was submitted at the mission location. If you turn on "Show on map", your last position is visible to other players. We do not track your location in the background.',
            'Content you create: posts, comments, likes, follows, mission photos and videos (proofs), and mission media you upload.',
            'Gameplay data: XP, coins, streaks, rewards and redemption history, trust score and anti-fraud signals (file hash, GPS at submission, submission times).',
            'Purchases: whether you have Premium or Early Supporter. Payments are handled by Apple, Google and RevenueCat; we never see your card number. Business partners pay through Stripe.',
            'Device data: a push-notification token if you allow notifications, and basic technical logs.',
          ],
        },
        {
          h: '2. Why we use it',
          ul: [
            'To provide the app: sign-in, missions, proofs, leaderboards, rewards, the social feed and the map.',
            'To keep the community safe: verifying proofs, preventing cheating, moderating content and handling reports.',
            'To send notifications you asked for (likes, follows, new missions, rewards).',
            'To process purchases and unlock Premium features.',
            'To meet legal obligations and defend against claims.',
          ],
        },
        {
          h: '3. Who processes your data',
          p: [
            'We use the following processors, only as far as needed to run the service:',
          ],
          ul: [
            'Supabase - database, authentication and file storage.',
            'Expo - push notifications.',
            'RevenueCat, Apple and Google - subscriptions and in-app purchases. Stripe - payments by business partners.',
            'OpenAI - automated checks: proof photos / video frames are sent to verify that they match the mission, and text you post can be screened for abusive content.',
            'Mapbox - map display; map requests include the area you are looking at.',
            'Vercel - hosting of our website.',
          ],
          after:
            'Some of these providers are located outside the European Economic Area. Where that happens, transfers rely on safeguards such as the EU Standard Contractual Clauses. We do not sell your data and we do not use it for third-party advertising or cross-app tracking.',
        },
        {
          h: '4. What other people can see',
          p: [
            'Your username, display name, avatar, bio, city, XP / rank, posts and comments are public inside the app. Your location is visible only if "Show on map" is on. Mission proofs are visible to our moderators and, if you post them to the feed, to other players. When you submit a proof for an event run by a business partner, that business can see your username, the proof and the GPS position at which it was submitted, only for its own events. You can block any user at any time; blocked users cannot see your posts, comments or location.',
          ],
        },
        {
          h: '5. How long we keep it',
          p: [
            'We keep your data while your account is active. When you delete your account in the app (Profile → Delete account), you are signed out immediately, your profile is anonymised and your posts, comments and follows are removed. Everything else is permanently erased after 30 days. We may keep limited records longer where the law requires it (for example payment records) and reports needed to protect other users.',
          ],
        },
        {
          h: '6. Your rights',
          p: [
            'Under the GDPR you can ask to access, correct, export or erase your data, to restrict or object to its processing, and to withdraw consent at any time. Account deletion is available in the app; for anything else contact us using the details below. You can complain to the Bulgarian Commission for Personal Data Protection (cpdp.bg) or to the authority in your country.',
          ],
        },
        {
          h: '7. Children',
          p: [
            'SideQuest is not intended for children under 14. If you believe a child has created an account, contact us and we will delete it.',
          ],
        },
        {
          h: '8. Security',
          p: [
            'Data is encrypted in transit, access is limited by role-based rules in the database, and sensitive actions run on the server. No system is perfectly secure; please use a strong, unique password.',
          ],
        },
        {
          h: '9. Changes',
          p: [
            'If we change this policy in a material way we will tell you in the app or by e-mail. The date at the top shows the latest version.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Use',
      intro:
        'These terms govern your use of SideQuest. By creating an account or using the app you agree to them. If you do not agree, please do not use SideQuest.',
      sections: [
        {
          h: '1. Who can use SideQuest',
          p: [
            'You must be at least 14 years old (or older if the law in your country requires) and able to enter a binding agreement. Keep your login details secret; you are responsible for activity on your account.',
          ],
        },
        {
          h: '2. Play safely and legally',
          ul: [
            'Missions happen in the real world. Never trespass, break the law, endanger yourself or others, or enter restricted or dangerous places to complete a mission.',
            'Respect people and property. Do not photograph or film people without their consent.',
            'You are responsible for your own safety and for following local rules.',
          ],
        },
        {
          h: '3. Honest play',
          p: [
            'Proofs must be genuine and taken by you at the mission location. Fake or reused photos, GPS spoofing, multiple accounts, automation or any other manipulation of missions, rewards or leaderboards is forbidden. We may remove rewards, reset progress, suspend or ban accounts that cheat.',
          ],
        },
        {
          h: '4. Community rules and zero tolerance',
          p: [
            'There is no place on SideQuest for objectionable content or abusive behaviour. This includes hate speech, harassment or bullying, threats, sexual or violent content, content involving minors in an unsafe way, spam, scams, illegal content and impersonation.',
          ],
          ul: [
            'You can report any post, comment or user from the "..." menu and block any user from their profile.',
            'We review reports and remove content or ban users who break these rules, without warning where necessary.',
            'Content is also screened automatically; this is not perfect, so reports matter.',
          ],
        },
        {
          h: '5. Your content',
          p: [
            'You own what you post. You give SideQuest a worldwide, non-exclusive, royalty-free licence to host, display and distribute it inside the service so that it can operate (for example showing your post to other players). You confirm you have the right to post it. You can delete your content, or your whole account, at any time.',
          ],
        },
        {
          h: '6. Rewards and coins',
          p: [
            'XP and coins are in-game points with no cash value and cannot be sold or transferred. Partner rewards (vouchers, codes) are provided by independent businesses, are subject to their own conditions, stock and expiry dates, and are not sold by SideQuest. We may change, limit or end rewards and the way points are earned.',
          ],
        },
        {
          h: '7. Premium and purchases',
          ul: [
            'Premium is an auto-renewing monthly subscription; Early Supporter is a one-time purchase. Prices and benefits are shown in the app before you buy.',
            'Payment is charged to your Apple ID or Google Play account at confirmation of purchase. The subscription renews automatically unless you cancel at least 24 hours before the end of the current period. Manage or cancel it in your Apple ID / Google Play subscription settings. Deleting your SideQuest account does not cancel the subscription.',
            'Use "Restore purchases" in the Premium screen to recover an existing purchase on a new device or account.',
            'Refunds are handled by Apple or Google under their policies. Premium benefits (such as unlimited missions and boosted rewards) may change over time.',
          ],
        },
        {
          h: '8. Business partners',
          p: [
            'Businesses that publish events or rewards on SideQuest also accept our partner terms presented during business onboarding. Partners are responsible for the accuracy of their offers and for honouring redeemed rewards.',
          ],
        },
        {
          h: '9. Suspension and termination',
          p: [
            'You can stop using SideQuest and delete your account at any time. We may suspend or terminate accounts that break these terms or the law, or that put others at risk.',
          ],
        },
        {
          h: '10. Disclaimers and liability',
          p: [
            'SideQuest is provided "as is". We do not guarantee uninterrupted service or that every mission, location or reward is accurate or available. To the maximum extent permitted by law, SideQuest is not liable for indirect or consequential loss, or for injuries or losses that result from how you choose to complete missions. Nothing in these terms limits liability that cannot be limited by law, including your statutory consumer rights.',
          ],
        },
        {
          h: '11. Apple and Google',
          p: [
            'These terms are between you and SideQuest, not Apple or Google. Apple and Google have no obligation to provide support or maintenance for the app and are not responsible for claims relating to it. Apple and its subsidiaries are third-party beneficiaries of these terms for iOS users.',
          ],
        },
        {
          h: '12. Changes and governing law',
          p: [
            'We may update these terms; continued use after a change means you accept it, and we will notify you of material changes. These terms are governed by the laws of the Republic of Bulgaria, without affecting the mandatory consumer protection rules of your country of residence.',
          ],
        },
      ],
    },
  },

  bg: {
    updatedLabel: 'Последна промяна',
    contactTitle: 'Контакт',
    contactLead: 'Оператор на SideQuest и администратор на личните ти данни:',
    inApp: 'Можеш да се свържеш с нас и от приложението: Профил → Свържи се с поддръжката.',
    privacy: {
      title: 'Политика за поверителност',
      intro:
        'SideQuest е приложение, базирано на локация, в което изпълняваш мисии в реалния свят, печелиш награди и споделяш напредъка си. Тази политика обяснява какви данни събираме, защо, кой ги обработва и какъв контрол имаш.',
      sections: [
        {
          h: '1. Какви данни събираме',
          ul: [
            'Данни за акаунта: имейл адрес, парола (съхранява се само като защитен хеш от доставчика ни за автентикация) или идентификаторът от вход с Google / Apple; потребителско име, показвано име, възраст, град, био, аватар и тема на профила.',
            'Локация: точната ти GPS позиция, докато приложението е отворено. Използва се за показване на мисии около теб и за проверка, че доказателството е подадено на мястото на мисията. Ако включиш „Покажи на картата“, последната ти позиция се вижда от други играчи. Не следим локацията ти във фонов режим.',
            'Съдържание, което създаваш: публикации, коментари, харесвания, последвания, снимки и видеа от мисии (доказателства) и медия, която качваш към мисии.',
            'Данни от играта: XP, койни, стрийкове, награди и история на осребряванията, trust score и сигнали срещу измами (хеш на файла, GPS при подаване, часове на подаване).',
            'Покупки: дали имаш Premium или Early Supporter. Плащанията се обработват от Apple, Google и RevenueCat; никога не виждаме номера на картата ти. Бизнес партньорите плащат през Stripe.',
            'Данни за устройството: токен за push известия, ако разрешиш известия, и основни технически логове.',
          ],
        },
        {
          h: '2. Защо ги използваме',
          ul: [
            'За да предоставяме приложението: вход, мисии, доказателства, класации, награди, социален фийд и карта.',
            'За безопасност на общността: проверка на доказателства, предотвратяване на измами, модериране на съдържание и обработка на доклади.',
            'За известия, които си поискал (харесвания, последователи, нови мисии, награди).',
            'За обработка на покупки и отключване на Premium функции.',
            'За спазване на законови задължения и защита срещу претенции.',
          ],
        },
        {
          h: '3. Кой обработва данните ти',
          p: ['Ползваме следните обработващи данни, само доколкото е нужно за работата на услугата:'],
          ul: [
            'Supabase - база данни, автентикация и съхранение на файлове.',
            'Expo - push известия.',
            'RevenueCat, Apple и Google - абонаменти и покупки в приложението. Stripe - плащания от бизнес партньори.',
            'OpenAI - автоматични проверки: снимки / кадри от видео на доказателствата се изпращат, за да се провери дали съответстват на мисията, а текст, който публикуваш, може да се проверява за обидно съдържание.',
            'Mapbox - показване на картата; заявките включват района, който разглеждаш.',
            'Vercel - хостинг на уебсайта ни.',
          ],
          after:
            'Някои от тези доставчици са извън Европейското икономическо пространство. В такива случаи прехвърлянето се основава на гаранции като Стандартните договорни клаузи на ЕС. Не продаваме данните ти и не ги използваме за реклама от трети страни или проследяване между приложения.',
        },
        {
          h: '4. Какво виждат другите',
          p: [
            'Потребителското ти име, показваното име, аватарът, биото, градът, XP / ранг, публикациите и коментарите са публични в приложението. Локацията ти се вижда само ако „Покажи на картата“ е включено. Доказателствата са видими за нашите модератори и, ако ги публикуваш във фийда, за другите играчи. Когато подадеш доказателство за събитие на бизнес партньор, този бизнес вижда потребителското ти име, доказателството и GPS позицията, от която е подадено, само за собствените си събития. Можеш да блокираш всеки потребител по всяко време; блокираните не виждат публикациите, коментарите и локацията ти.',
          ],
        },
        {
          h: '5. Колко дълго ги пазим',
          p: [
            'Пазим данните ти, докато акаунтът ти е активен. Когато изтриеш акаунта си от приложението (Профил → Изтрий акаунта), излизаш веднага, профилът ти се анонимизира, а публикациите, коментарите и последванията ти се премахват. Всичко останало се изтрива окончателно след 30 дни. Може да пазим ограничени записи по-дълго, когато законът го изисква (например платежни документи), както и доклади, нужни за защита на други потребители.',
          ],
        },
        {
          h: '6. Твоите права',
          p: [
            'Според GDPR можеш да поискаш достъп, корекция, пренос или изтриване на данните си, ограничаване или възражение срещу обработването им и да оттеглиш съгласието си по всяко време. Изтриването на акаунт е достъпно в приложението; за всичко останало се свържи с нас чрез данните по-долу. Можеш да подадеш жалба до Комисията за защита на личните данни (cpdp.bg) или до органа в твоята държава.',
          ],
        },
        {
          h: '7. Деца',
          p: [
            'SideQuest не е предназначено за деца под 14 години. Ако смяташ, че дете е създало акаунт, свържи се с нас и ще го изтрием.',
          ],
        },
        {
          h: '8. Сигурност',
          p: [
            'Данните са криптирани при пренос, достъпът е ограничен с правила по роли в базата, а чувствителните действия се изпълняват на сървъра. Няма напълно сигурна система; използвай силна и уникална парола.',
          ],
        },
        {
          h: '9. Промени',
          p: [
            'Ако променим политиката съществено, ще те уведомим в приложението или по имейл. Датата най-горе показва последната версия.',
          ],
        },
      ],
    },
    terms: {
      title: 'Условия за ползване',
      intro:
        'Тези условия уреждат ползването на SideQuest. Със създаването на акаунт или ползването на приложението ги приемаш. Ако не си съгласен, моля, не използвай SideQuest.',
      sections: [
        {
          h: '1. Кой може да ползва SideQuest',
          p: [
            'Трябва да си поне на 14 години (или по-възрастен, ако законът в твоята държава го изисква) и да можеш да сключваш обвързващ договор. Пази данните си за вход; ти отговаряш за активността в акаунта си.',
          ],
        },
        {
          h: '2. Играй безопасно и законно',
          ul: [
            'Мисиите се случват в реалния свят. Никога не навлизай в чужд имот, не нарушавай закона, не излагай на опасност себе си или другите и не влизай в забранени или опасни места, за да изпълниш мисия.',
            'Уважавай хората и имуществото. Не снимай и не записвай хора без тяхно съгласие.',
            'Ти отговаряш за собствената си безопасност и за спазването на местните правила.',
          ],
        },
        {
          h: '3. Честна игра',
          p: [
            'Доказателствата трябва да са истински и направени от теб на мястото на мисията. Фалшиви или повторно използвани снимки, подправяне на GPS, множество акаунти, автоматизация или друго манипулиране на мисии, награди или класации е забранено. Можем да премахнем награди, да нулираме напредъка, да спрем или блокираме акаунти, които мамят.',
          ],
        },
        {
          h: '4. Правила на общността и нулева толерантност',
          p: [
            'В SideQuest няма място за обидно съдържание или злоупотреба. Това включва реч на омразата, тормоз, заплахи, сексуално или насилствено съдържание, съдържание с непълнолетни по опасен начин, спам, измами, незаконно съдържание и представяне за друг.',
          ],
          ul: [
            'Можеш да докладваш всяка публикация, коментар или потребител от менюто „...“ и да блокираш всеки потребител от профила му.',
            'Преглеждаме докладите и премахваме съдържание или блокираме потребители, които нарушават правилата, при нужда и без предупреждение.',
            'Съдържанието се проверява и автоматично; това не е съвършено, затова докладите са важни.',
          ],
        },
        {
          h: '5. Твоето съдържание',
          p: [
            'Ти притежаваш това, което публикуваш. Даваш на SideQuest световен, неизключителен, безвъзмезден лиценз да го съхранява, показва и разпространява в услугата, за да може тя да работи (например да показва публикацията ти на други играчи). Потвърждаваш, че имаш право да го публикуваш. Можеш да изтриеш съдържанието си или целия си акаунт по всяко време.',
          ],
        },
        {
          h: '6. Награди и койни',
          p: [
            'XP и койните са точки в играта без парична стойност и не могат да се продават или прехвърлят. Партньорските награди (ваучери, кодове) се предоставят от независими бизнеси, подлежат на техни условия, наличности и срокове и не се продават от SideQuest. Можем да променяме, ограничаваме или прекратяваме наградите и начина на печелене на точки.',
          ],
        },
        {
          h: '7. Premium и покупки',
          ul: [
            'Premium е месечен абонамент с автоматично подновяване; Early Supporter е еднократна покупка. Цените и ползите се показват в приложението преди покупка.',
            'Плащането се начислява на твоя Apple ID или Google Play акаунт при потвърждаване на покупката. Абонаментът се подновява автоматично, освен ако не го откажеш поне 24 часа преди края на текущия период. Управлявай или откажи го в настройките на абонаментите на Apple ID / Google Play. Изтриването на акаунта в SideQuest не отказва абонамента.',
            'Използвай „Възстанови покупките“ в екрана за Premium, за да върнеш съществуваща покупка на ново устройство или акаунт.',
            'Възстановяванията на суми се обработват от Apple или Google според техните политики. Ползите от Premium (като неограничени мисии и увеличени награди) могат да се променят с времето.',
          ],
        },
        {
          h: '8. Бизнес партньори',
          p: [
            'Бизнесите, които публикуват събития или награди в SideQuest, приемат и партньорските ни условия, показани при регистрацията на бизнеса. Партньорите отговарят за точността на офертите си и за изпълнението на осребрените награди.',
          ],
        },
        {
          h: '9. Спиране и прекратяване',
          p: [
            'Можеш да спреш да ползваш SideQuest и да изтриеш акаунта си по всяко време. Можем да спрем или прекратим акаунти, които нарушават тези условия или закона или излагат другите на риск.',
          ],
        },
        {
          h: '10. Отказ от гаранции и отговорност',
          p: [
            'SideQuest се предоставя „както е“. Не гарантираме непрекъсната работа или че всяка мисия, локация или награда е точна или налична. Доколкото законът позволява, SideQuest не отговаря за непреки или последващи вреди, нито за наранявания или загуби, произтичащи от начина, по който избираш да изпълняваш мисиите. Нищо в тези условия не ограничава отговорност, която не може да бъде ограничена по закон, включително законовите ти права като потребител.',
          ],
        },
        {
          h: '11. Apple и Google',
          p: [
            'Тези условия са между теб и SideQuest, а не с Apple или Google. Apple и Google нямат задължение да осигуряват поддръжка за приложението и не отговарят за претенции във връзка с него. Apple и дъщерните ѝ дружества са трети лица-бенефициенти на тези условия за потребителите на iOS.',
          ],
        },
        {
          h: '12. Промени и приложимо право',
          p: [
            'Можем да обновяваме тези условия; продължаването на ползването след промяна означава, че я приемаш, а за съществени промени ще те уведомим. Тези условия се уреждат от законите на Република България, без да се засягат задължителните правила за защита на потребителите в държавата ти на пребиваване.',
          ],
        },
      ],
    },
  },
};
