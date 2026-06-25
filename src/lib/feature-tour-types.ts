export interface FeatureTourStep {
  id: string;
  targetId?: string;
  title: string;
  description: string;
  placement?: 'bottom' | 'top';
}
