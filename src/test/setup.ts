import '@testing-library/jest-dom';

// Mock Supabase
vi.mock('../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: {} }, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
}));

// Mock AI services
vi.mock('../services/geminiService', () => ({
  generateLegalResearch: vi.fn().mockResolvedValue('Mock research result'),
  draftContract: vi.fn().mockResolvedValue('Mock contract draft'),
  getClauseSuggestions: vi.fn().mockResolvedValue('clause1, clause2, clause3'),
  summarizeCaseText: vi.fn().mockResolvedValue({ title: 'Mock Case', summary: 'Mock summary' }),
  generateFeeNoteDescription: vi.fn().mockResolvedValue('Mock fee description'),
  refineLegalText: vi.fn().mockResolvedValue('Mock refined text'),
  generateDailyBrief: vi.fn().mockResolvedValue('Mock daily brief'),
  generateCaseStrategy: vi.fn().mockResolvedValue('Mock strategy'),
  generateLegalArgument: vi.fn().mockResolvedValue('Mock argument'),
  analyzeWitnessStatement: vi.fn().mockResolvedValue('Mock analysis'),
  generateCorporateObjects: vi.fn().mockResolvedValue('Mock objects'),
  generateCorporateResolution: vi.fn().mockResolvedValue('Mock resolution'),
  generateComplianceAdvice: vi.fn().mockResolvedValue('Mock compliance advice'),
  generateEntertainmentAdvice: vi.fn().mockResolvedValue('Mock entertainment advice'),
  draftEntertainmentContract: vi.fn().mockResolvedValue('Mock entertainment contract'),
}));

vi.mock('../services/aiOrchestrator', () => ({
  runAI: vi.fn().mockResolvedValue('Mock AI response'),
}));

// Mock Paystack
vi.mock('../services/paystackService', () => ({
  usePaystackPayment: vi.fn().mockReturnValue({
    initializePayment: vi.fn(),
  }),
}));

// Mock window.PaystackPop
Object.defineProperty(window, 'PaystackPop', {
  value: {
    setup: vi.fn().mockReturnValue({
      openIframe: vi.fn(),
    }),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
