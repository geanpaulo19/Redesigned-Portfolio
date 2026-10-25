export const navLinks = [
  { label: 'Home', href: '#home', active: true },
  { label: 'Studio', href: '#studio', active: false },
  { label: 'About', href: '#about', active: false },
  { label: 'Journal', href: '#journal', active: false },
  { label: 'Reach Us', href: '#reach', active: false },
]

/** Flip `open` when your calendar fills up: both status lines update. */
export const availability = {
  open: true,
  available: 'Available for projects',
  booked: 'Currently booked',
}

export const skills = [
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'UI/UX', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'WordPress', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-original.svg' },
  { name: 'cPanel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cpanel/cpanel-original.svg' },
  { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/f2f1ec' },
]

export const contact = {
  email: 'geanpaulo@mail.com',
  whatsapp: 'https://wa.me/639202652736',
}

export const socials = [
  { label: 'Links', href: 'https://links.geanpaulo.com' },
  { label: 'GitHub', href: 'https://github.com/geanpaulo19' },
  { label: 'Facebook', href: 'https://www.facebook.com/geanpaulofrancois/' },
  { label: 'X', href: 'https://x.com/geanpaulo_' },
  { label: 'Instagram', href: 'https://www.instagram.com/geanpau.lo/' },
]

export const footnotes = [
  'From Manila, with ❤️… and a bit of chaos 💻',
  'Powered by coffee ☕ and occasional panic!',
  'Debugging is my cardio 🏃‍♂️',
  '100% chaos, 0% boredom 🎉',
  'Made with love and mild insomnia 🌙',
  'Turning bugs into features… sometimes 🐛➡️✨',
  'Will code for tacos 🌮',
  'Ctrl + S is my life mantra 💾',
  'Procrastination level: expert 🕰️',
  'Powered by caffeine, curiosity, and chaos ⚡',
  'Pixel perfectionist with slight OCD 🎨',
  'Coffee in one hand, code in the other ☕💻',
  'If it works, it works… if not, debug harder 🔧',
]

export const services = [
  {
    icon: 'browser',
    title: 'Websites',
    description:
      'Complete sites designed and built from scratch: fast, responsive, and easy to update.',
  },
  {
    icon: 'cursor-click',
    title: 'Landing pages',
    description:
      'High-converting pages for campaigns, products, and launches, built to turn visitors into inquiries.',
  },
  {
    icon: 'robot',
    title: 'GHL automations',
    description:
      'GoHighLevel setups that handle follow-ups, pipelines, and reminders, so no lead slips through.',
  },
  {
    icon: 'shapes',
    title: 'Logo and branding',
    description:
      'Logos, marks, and visual identities that look sharp everywhere, from favicon to billboard.',
  },
  {
    icon: 'paint-brush',
    title: 'Graphic design',
    description:
      'Social media creatives, marketing materials, and layout work that stays on-brand on every platform.',
  },
  {
    icon: 'magnifying-glass',
    title: 'SEO',
    description:
      'On-page SEO, technical cleanups, and content structure that help the right people find you on Google.',
  },
]

export const about = {
  bioLead: 'I am Gean Paulo, most people call me Gean.',
  bioBody: [
    'Born and raised in the Philippines ',
    { icon: 'map-pin' },
    ', I have been passionate about building digital experiences for over 10 years. I started creating websites in 2014, helping small to medium businesses establish their online presence. Since then, I\u2019ve collaborated with international clients ',
    { icon: 'globe-hemisphere-west' },
    ' from the United States, Australia, United Arab Emirates, and the Philippines, crafting interactive, user-friendly ',
    { icon: 'smiley' },
    ' and visually appealing websites that blend creativity with clean, maintainable code.',
  ] as (string | { icon: string })[],
  education: 'Bachelor of Science in Information Technology, Major in Programming',
  experience: [
    { role: 'Freelance Web Designer / Developer', period: 'since 2014' },
    { role: 'Currently at Uber', period: '2021 - Present' },
  ],
  journey: [
    { year: '2014', event: 'Started freelance web development' },
    { year: '2016', event: 'Expanded client base internationally' },
    { year: '2021', event: 'Joined Uber, working full-time' },
    { year: '2026', event: 'Still shipping', current: true },
  ] as { year: string; event: string; current?: boolean }[],
  hobbies: [
    {
      text: 'UI design',
      icon: 'palette',
      description: 'Side quests in Figma, redesigning things nobody asked me to fix.',
    },
    {
      text: 'Creative coding',
      icon: 'code',
      description: 'Weekend experiments that occasionally turn into real products.',
    },
    {
      text: 'Learning new tools',
      icon: 'wrench',
      description: 'New apps and frameworks, one rabbit hole at a time.',
    },
    {
      text: 'Documentaries & YouTube',
      icon: 'film-slate',
      description: 'True crime, space, and design channels on heavy rotation.',
    },
    {
      text: 'Music',
      icon: 'music-notes',
      description: 'Lo-fi and OPM playlists keeping the builds flowing.',
    },
    {
      text: 'Coffee',
      icon: 'coffee',
      description: 'Iced lattes, any time of day.',
    },
  ],
}
