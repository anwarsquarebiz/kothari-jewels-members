export interface StoneDetail {
  name: string;
  bg: string;
  fg: string;
  panel: string;
  line: string;
  text: string;
  count: string;
  hero: [string, string];
  more: [string, string][];
}

export interface PieceItem {
  id: string;
  title: string;
  stones: string[];
  bg?: string;
}

export const STONES: Record<string, StoneDetail> = {
  emerald: {
    name: 'Emerald',
    bg: '#0F0E0E',
    fg: '#EDE7D6',
    panel: '#1B191A',
    line: 'rgba(237,231,214,.25)',
    text: 'Cabochons, drops and hearts, set with diamonds.',
    count: '7 pieces',
    hero: ['emerald-necklace', 'Emerald and diamond necklace'],
    more: [
      ['emerald-heart-earrings', 'Emerald heart earrings'],
      ['emerald-ring', 'Emerald and yellow diamond ring'],
      ['emerald-vine-earrings', 'Emerald vine earrings'],
    ],
  },
  ruby: {
    name: 'Ruby',
    bg: '#540C1F',
    fg: '#EDE7D6',
    panel: '#621628',
    line: 'rgba(237,231,214,.25)',
    text: 'Ovals, pears and clusters, framed in white.',
    count: '4 pieces',
    hero: ['ruby-collar', 'Ruby and diamond collar necklace'],
    more: [
      ['ruby-star-earrings', 'Ruby, pearl and diamond earrings'],
      ['ruby-drop-earrings', 'Ruby drop earrings'],
      ['ruby-flower-earrings', 'Ruby flower earrings'],
    ],
  },
  pearl: {
    name: 'Pearl',
    bg: '#EDE7D6',
    fg: '#1A1718',
    panel: '#F6F2E8',
    line: 'rgba(26,23,24,.2)',
    text: 'Pearls in drops and clusters, beside diamonds and onyx.',
    count: '4 pieces',
    hero: ['pearl-necklace', 'Pearl and diamond necklace'],
    more: [
      ['pearl-onyx-earrings', 'Pearl and onyx earrings'],
      ['pearl-earring', 'Pearl and diamond earring'],
      ['ruby-star-earrings', 'Ruby, pearl and diamond earrings'],
    ],
  },
  diamond: {
    name: 'Diamond',
    bg: '#F4F1EB',
    fg: '#1A1718',
    panel: '#FFFFFF',
    line: 'rgba(26,23,24,.18)',
    text: 'Baguettes, pears and brilliants, in clean white lines.',
    count: '6 pieces',
    hero: ['deco-earrings', 'Geometric diamond earrings'],
    more: [
      ['coil-earrings', 'Diamond coil earrings'],
      ['swirl-hoops', 'Diamond swirl earrings'],
      ['baguette-hoops', 'Baguette diamond hoops'],
    ],
  },
  onyx: {
    name: 'Onyx',
    bg: '#1A1718',
    fg: '#EDE7D6',
    panel: '#242021',
    line: 'rgba(237,231,214,.2)',
    text: 'Black onyx in clean geometry, edged with diamonds.',
    count: '2 pieces',
    hero: ['onyx-earrings', 'Onyx and diamond drop earrings'],
    more: [['pearl-onyx-earrings', 'Pearl and onyx earrings']],
  },
};

export const DOTS: Record<string, { name: string; color: string }> = {
  emerald: { name: 'Emerald', color: '#1F6B4F' },
  ruby: { name: 'Ruby', color: '#540C1F' },
  pearl: { name: 'Pearl', color: '#E4DCC8' },
  diamond: { name: 'Diamond', color: '#FFFFFF' },
  onyx: { name: 'Onyx', color: '#1A1718' },
};

export const PIECES: PieceItem[] = [
  { id: 'ruby-collar', title: 'Collar necklace', stones: ['ruby', 'diamond'], bg: '#540C1F' },
  { id: 'emerald-heart-earrings', title: 'Heart earrings', stones: ['emerald', 'diamond'] },
  { id: 'deco-earrings', title: 'Geometric earrings', stones: ['diamond'] },
  { id: 'emerald-ring', title: 'Cabochon ring', stones: ['emerald', 'diamond'] },
  { id: 'onyx-earrings', title: 'Drop earrings', stones: ['onyx', 'diamond'] },
  { id: 'emerald-necklace', title: 'Drop necklace', stones: ['emerald', 'diamond'], bg: '#0F0E0E' },
  { id: 'ruby-star-earrings', title: 'Cluster earrings', stones: ['ruby', 'pearl', 'diamond'] },
  { id: 'paisley-earrings', title: 'Paisley earrings', stones: ['diamond'] },
  { id: 'emerald-vine-earrings', title: 'Vine earrings', stones: ['emerald', 'diamond'] },
  { id: 'pearl-onyx-earrings', title: 'Pearl drop earrings', stones: ['pearl', 'onyx', 'diamond'] },
  { id: 'ruby-drop-earrings', title: 'Drop earrings', stones: ['ruby', 'diamond'] },
  { id: 'coil-earrings', title: 'Coil earrings', stones: ['diamond'] },
  { id: 'pearl-necklace', title: 'Lattice necklace', stones: ['pearl', 'diamond'], bg: '#E4DCC8' },
  { id: 'ruby-flower-earrings', title: 'Flower earrings', stones: ['ruby', 'diamond'] },
  { id: 'swirl-hoops', title: 'Swirl earrings', stones: ['diamond'] },
  { id: 'pearl-earring', title: 'Petal earring', stones: ['pearl', 'diamond'] },
  { id: 'baguette-hoops', title: 'Baguette hoops', stones: ['diamond'] },
  { id: 'emerald-pendant-necklace', title: 'Pendant necklace', stones: ['emerald', 'diamond'], bg: '#1A1718' },
  { id: 'emerald-bracelet', title: 'Bead bracelet', stones: ['emerald', 'diamond'] },
  { id: 'emerald-line-bracelet', title: 'Line bracelet', stones: ['emerald', 'diamond'] },
  { id: 'diamond-vine', title: 'Vine jewel', stones: ['diamond'] },
];

export const RAIL_ITEMS = [
  { id: 'deco-earrings', label: 'Diamond earrings', alt: 'Geometric diamond earrings' },
  { id: 'emerald-heart-earrings', label: 'Emerald heart earrings', alt: 'Emerald heart and diamond earrings' },
  { id: 'paisley-earrings', label: 'Paisley earrings', alt: 'Yellow diamond paisley earrings' },
  { id: 'onyx-earrings', label: 'Onyx drop earrings', alt: 'Onyx and diamond drop earrings' },
  { id: 'ruby-drop-earrings', label: 'Ruby drop earrings', alt: 'Ruby and diamond drop earrings' },
  { id: 'swirl-hoops', label: 'Swirl earrings', alt: 'Diamond swirl earrings' },
];

export function getStonesText(stones: string[]): string {
  const names = stones.map((s) => DOTS[s]?.name || s);
  if (names.length > 1) {
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }
  return names[0] || '';
}

