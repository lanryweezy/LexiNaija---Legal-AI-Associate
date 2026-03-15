/**
 * Case Milestone Service
 * Manages progress tracking for client portal
 */

import { CaseMilestone, MilestoneTemplate } from '../types';

/**
 * Milestone templates by case type
 */
export const MILESTONE_TEMPLATES: Record<string, MilestoneTemplate> = {
  'Tenancy Recovery': {
    caseType: 'Tenancy Recovery',
    milestones: [
      { title: 'Initial Consultation', description: 'Client briefing and case assessment', defaultOrder: 1 },
      { title: 'Statutory Notice Served', description: 'Notice to Quit served on tenant', defaultOrder: 2 },
      { title: 'Writ of Summons Filed', description: 'Originating process filed at court', defaultOrder: 3 },
      { title: 'Service of Process', description: 'Defendant served with court processes', defaultOrder: 4 },
      { title: 'Mention Date', description: 'First court appearance', defaultOrder: 5 },
      { title: 'Trial Commenced', description: 'Evidence and witnesses presented', defaultOrder: 6 },
      { title: 'Judgment Delivered', description: 'Court delivers final judgment', defaultOrder: 7 },
    ]
  },
  'Contract Dispute': {
    caseType: 'Contract Dispute',
    milestones: [
      { title: 'Case Review', description: 'Contract and evidence analysis', defaultOrder: 1 },
      { title: 'Demand Letter Sent', description: 'Pre-action notice to opposing party', defaultOrder: 2 },
      { title: 'Writ Filed', description: 'Originating process filed', defaultOrder: 3 },
      { title: 'Statement of Claim Filed', description: 'Detailed pleadings submitted', defaultOrder: 4 },
      { title: 'Defence Filed', description: 'Opposing party responds', defaultOrder: 5 },
      { title: 'Trial', description: 'Court proceedings', defaultOrder: 6 },
      { title: 'Judgment', description: 'Final court decision', defaultOrder: 7 },
    ]
  },
  'Corporate Registration': {
    caseType: 'Corporate Registration',
    milestones: [
      { title: 'Name Reservation', description: 'Company name reserved at CAC', defaultOrder: 1 },
      { title: 'Documents Prepared', description: 'Incorporation documents drafted', defaultOrder: 2 },
      { title: 'CAC Filing Submitted', description: 'Application submitted to CAC', defaultOrder: 3 },
      { title: 'Payment Confirmed', description: 'Filing fees paid', defaultOrder: 4 },
      { title: 'Certificate Issued', description: 'Certificate of Incorporation received', defaultOrder: 5 },
    ]
  },
  'Fundamental Rights': {
    caseType: 'Fundamental Rights',
    milestones: [
      { title: 'Case Assessment', description: 'Rights violation analysis', defaultOrder: 1 },
      { title: 'Pre-Action Notice', description: 'Notice served on respondent', defaultOrder: 2 },
      { title: 'Originating Motion Filed', description: 'Fundamental rights application filed', defaultOrder: 3 },
      { title: 'Hearing Date Set', description: 'Court fixes hearing date', defaultOrder: 4 },
      { title: 'Trial', description: 'Evidence and addresses', defaultOrder: 5 },
      { title: 'Judgment', description: 'Court delivers judgment', defaultOrder: 6 },
    ]
  },
  'Default': {
    caseType: 'General',
    milestones: [
      { title: 'Case Opened', description: 'Matter file created', defaultOrder: 1 },
      { title: 'Initial Research', description: 'Legal research completed', defaultOrder: 2 },
      { title: 'Strategy Meeting', description: 'Case strategy finalized', defaultOrder: 3 },
      { title: 'Pre-Action Steps', description: 'Pre-action requirements completed', defaultOrder: 4 },
      { title: 'Court Process Filed', description: 'Originating process filed', defaultOrder: 5 },
      { title: 'Trial Pending', description: 'Awaiting trial date', defaultOrder: 6 },
      { title: 'Conclusion', description: 'Matter concluded', defaultOrder: 7 },
    ]
  }
};

/**
 * Get milestone template for case type
 */
export const getMilestoneTemplate = (caseTitle: string): MilestoneTemplate => {
  const title = caseTitle.toLowerCase();
  
  if (title.includes('tenancy') || title.includes('possession')) {
    return MILESTONE_TEMPLATES['Tenancy Recovery'];
  }
  if (title.includes('contract') || title.includes('dispute')) {
    return MILESTONE_TEMPLATES['Contract Dispute'];
  }
  if (title.includes('registration') || title.includes('incorporation')) {
    return MILESTONE_TEMPLATES['Corporate Registration'];
  }
  if (title.includes('fundamental') || title.includes('rights')) {
    return MILESTONE_TEMPLATES['Fundamental Rights'];
  }
  
  return MILESTONE_TEMPLATES['Default'];
};

/**
 * Generate milestones for a new case
 */
export const generateMilestones = (caseId: string, caseTitle: string): CaseMilestone[] => {
  const template = getMilestoneTemplate(caseTitle);
  
  return template.milestones.map((m, index) => ({
    id: `milestone-${caseId}-${index}`,
    caseId,
    title: m.title,
    description: m.description,
    status: 'pending' as const,
    visibleToClient: true,
    order: m.defaultOrder,
  }));
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (milestones: CaseMilestone[]): number => {
  if (milestones.length === 0) return 0;
  
  const completed = milestones.filter(m => m.status === 'completed').length;
  return Math.round((completed / milestones.length) * 100);
};

/**
 * Get current milestone (first pending or last completed)
 */
export const getCurrentMilestone = (milestones: CaseMilestone[]): CaseMilestone | null => {
  const pending = milestones.filter(m => m.status === 'pending');
  if (pending.length > 0) {
    return pending.sort((a, b) => a.order - b.order)[0];
  }
  
  const completed = milestones.filter(m => m.status === 'completed');
  if (completed.length > 0) {
    return completed.sort((a, b) => b.order - a.order)[0];
  }
  
  return null;
};

/**
 * Get next milestone
 */
export const getNextMilestone = (milestones: CaseMilestone[]): CaseMilestone | null => {
  const pending = milestones.filter(m => m.status === 'pending');
  if (pending.length > 0) {
    return pending.sort((a, b) => a.order - b.order)[0];
  }
  return null;
};

/**
 * Format milestone date for display
 */
export const formatMilestoneDate = (date?: Date): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get milestone status color
 */
export const getMilestoneStatusColor = (status: CaseMilestone['status']): string => {
  switch (status) {
    case 'completed': return 'emerald';
    case 'overdue': return 'rose';
    case 'pending': return 'slate';
    default: return 'slate';
  }
};
