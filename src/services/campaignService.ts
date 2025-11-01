import { Campaign } from '@/types';

const STORAGE_KEY = 'campaigns';

export function getAllCampaigns(): Campaign[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCampaign(campaign: Campaign): void {
  const campaigns = getAllCampaigns();
  const index = campaigns.findIndex(c => c.id === campaign.id);

  if (index !== -1) {
    campaigns[index] = campaign;
  } else {
    campaigns.push(campaign);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function deleteCampaign(id: string): void {
  const campaigns = getAllCampaigns().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

export function getCampaignById(id: string): Campaign | undefined {
  return getAllCampaigns().find(c => c.id === id);
}

export function createCampaign(
  name: string,
  description?: string,
  startDate?: string,
  endDate?: string,
  goals?: string[]
): Campaign {
  const campaign: Campaign = {
    id: crypto.randomUUID(),
    name,
    description,
    color: getRandomCampaignColor(),
    startDate: startDate || new Date().toISOString(),
    endDate,
    goals,
    createdAt: new Date().toISOString(),
  };

  saveCampaign(campaign);
  return campaign;
}

function getRandomCampaignColor(): string {
  const colors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
