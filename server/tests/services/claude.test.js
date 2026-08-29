import { jest } from '@jest/globals';

// claude.js imports the real Anthropic SDK and instantiates a client at
// module load time, so we have to mock the module itself BEFORE importing
// claude.js — jest.mock() alone doesn't work for this under ESM, hence
// jest.unstable_mockModule + a dynamic import() below instead of a normal
// top-level import.
const mockCreate = jest.fn();

jest.unstable_mockModule('@anthropic-ai/sdk', () => ({
    default: jest.fn().mockImplementation(() => ({
        messages: { create: mockCreate },
    })),
}));

const { moodToSearchParams } = await import('../../services/claude.js');

beforeEach(() => {
    mockCreate.mockReset();
});

test('parses a clean JSON response from claude into search params', async () => {
    mockCreate.mockResolvedValueOnce({
        content: [{ text: JSON.stringify({ genres: ['Comedy'], keywords: ['fun'], blurb: 'A fun watch.' }) }],
    });

    const result = await moodToSearchParams(['funny']);

    expect(result).toEqual({ genres: ['Comedy'], keywords: ['fun'], blurb: 'A fun watch.' });
});

test('strips markdown code fences before parsing', async () => {
    const fenced = '```json\n' + JSON.stringify({ genres: ['Drama'], keywords: [], blurb: 'A drama.' }) + '\n```';
    mockCreate.mockResolvedValueOnce({
        content: [{ text: fenced }],
    });

    const result = await moodToSearchParams(['sad']);

    expect(result).toEqual({ genres: ['Drama'], keywords: [], blurb: 'A drama.' });
});

test('includes watched titles in the prompt sent to claude when provided', async () => {
    mockCreate.mockResolvedValueOnce({
        content: [{ text: JSON.stringify({ genres: ['Comedy'], keywords: [], blurb: 'x' }) }],
    });

    await moodToSearchParams(['funny'], ['The Bear']);

    const requestArgs = mockCreate.mock.calls[0][0];
    expect(requestArgs.messages[0].content).toContain('The Bear');
});

test('does not mention watched titles in the prompt when none are given', async () => {
    mockCreate.mockResolvedValueOnce({
        content: [{ text: JSON.stringify({ genres: ['Comedy'], keywords: [], blurb: 'x' }) }],
    });

    await moodToSearchParams(['funny']);

    const requestArgs = mockCreate.mock.calls[0][0];
    expect(requestArgs.messages[0].content).not.toContain('watched');
});
