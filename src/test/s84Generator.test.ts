import { describe, it, expect, vi } from 'vitest';
import {
  getDeviceFingerprint,
  generateIntegrityHash,
  generateS84Certificate,
  requiresS84Certificate
} from '../services/s84Generator';
import { EvidenceItem, Case, FirmProfile, Client } from '../types';

describe('s84Generator', () => {
  it('identifies electronic evidence correctly', () => {
    expect(requiresS84Certificate('Document')).toBe(true);
    expect(requiresS84Certificate('Image')).toBe(true);
    expect(requiresS84Certificate('Physical')).toBe(false);
  });

  it('generates device fingerprint', () => {
    // Mock navigator and screen if needed, but in JSDOM they should exist
    const fingerprint = getDeviceFingerprint();
    expect(fingerprint).toHaveProperty('userAgent');
    expect(fingerprint).toHaveProperty('os');
    expect(fingerprint).toHaveProperty('browser');
  });

  it('generates integrity hash', async () => {
    const data = {
      description: 'Test Evidence',
      dateObtained: new Date(),
      type: 'Image',
      custodyLocation: 'Cloud'
    };
    const hash = await generateIntegrityHash(data);
    expect(hash).toMatch(/^[0-9A-F]{64}$/);
  });

  it('generates certificate content', () => {
    const evidenceItem: EvidenceItem = {
      id: '1',
      description: 'CCTV Footage',
      type: 'Image',
      dateObtained: new Date(),
      isReliedUpon: true
    };
    const selectedCase: Case = {
      id: 'case1',
      clientId: 'client1',
      title: 'Ade v. Bola',
      suitNumber: 'LD/123/2024',
      court: 'High Court, Lagos',
      status: 'Open',
      notes: '',
      documents: [],
      billableItems: [],
      evidence: []
    };
    const client: Client = {
      id: 'client1',
      name: 'Adedeji Ade',
      type: 'Individual',
      email: 'ade@example.com',
      phone: '0800',
      address: 'Lagos',
      dateAdded: new Date()
    };
    const firmProfile: FirmProfile = {
      name: 'LexiNaija Partners',
      solicitorName: 'Samsudeen Esq.',
      address: 'Lagos, Nigeria',
      email: 'partners@lexinaija.com',
      phone: '0800'
    };
    const deviceDetails = getDeviceFingerprint();
    const hash = 'HASH123456';

    const cert = generateS84Certificate(
      evidenceItem,
      selectedCase,
      client,
      firmProfile,
      deviceDetails,
      hash
    );

    expect(cert).toContain('Section 84 of the Evidence Act, 2011');
    expect(cert).toContain('LD/123/2024');
    expect(cert).toContain('Samsudeen Esq.');
    expect(cert).toContain(hash);
  });
});
