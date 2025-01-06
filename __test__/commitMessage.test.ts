import {parseMessage, CommitMessage} from '../src/commitMessage';

describe('parseMessage', () => {
  test('single line message parse', () => {
    const message = 'feat: add new feature';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toStrictEqual([]);
    expect(result.hasBody).toBe(false);
    expect(result.footer).toBe(null);
    expect(result.hasFooter).toBe(false);
  });

  test('single line message parse with fix type', () => {
    const message = 'fix: bug fix';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('fix:   bug fix');
    expect(result.body).toStrictEqual([]);
    expect(result.hasBody).toBe(false);
    expect(result.footer).toBe(null);
    expect(result.hasFooter).toBe(false);
  });

  test('multi line message parse without footer', () => {
    const message = 'feat: add new feature\n\nthis is a new feature';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toEqual(['this is a new feature']);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe(null);
    expect(result.hasFooter).toBe(false);
  });

  test('multi line message parse with footer', () => {
    const message =
      'feat: add new feature\n\nthis is a new feature\n\nclose #123';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toEqual(['this is a new feature']);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe('close #123');
    expect(result.hasFooter).toBe(true);
  });

  test('multi line message parse with fix footer', () => {
    const message =
      'feat: add new feature\n\nthis is a new feature\n\nfix #123';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toEqual(['this is a new feature']);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe('fix #123');
    expect(result.hasFooter).toBe(true);
  });

  test('multi line message parse with multiple paragraphs', () => {
    const message =
      'feat: add new feature\n\nparagraph one\n\nparagraph two\n\nclose #123';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toEqual(['paragraph one', 'paragraph two']);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe('close #123');
    expect(result.hasFooter).toBe(true);
  });

  test('multi line message parse with footer without body', () => {
    const message = 'feat: add new feature\n\nclose #123';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('feat: add new feature');
    expect(result.body).toStrictEqual([]);
    expect(result.hasBody).toBe(false);
    expect(result.footer).toBe('close #123');
    expect(result.hasFooter).toBe(true);
  });

  test('multi line message parse with merge commit', () => {
    const message =
      'Merge pull request #123 from user/branch\n\nfeat: add new feature\n\nclose #123';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('Merge pull request #123 from user/branch');
    expect(result.body).toStrictEqual(['feat: add new feature']);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe('close #123');
    expect(result.hasFooter).toBe(true);
  });

  test('multi line message parse with revert commit', () => {
    const message =
      'Revert "chore: build latest release file"\n\nThis reverts commit b6b3880547a06c6c575dade895c2b6dbe157f114.';
    const result: CommitMessage = parseMessage(message);
    expect(result.header).toBe('Revert "chore: build latest release file"');
    expect(result.body).toEqual([
      'This reverts commit b6b3880547a06c6c575dade895c2b6dbe157f114.',
    ]);
    expect(result.hasBody).toBe(true);
    expect(result.footer).toBe(null);
    expect(result.hasFooter).toBe(false);
  });
});
