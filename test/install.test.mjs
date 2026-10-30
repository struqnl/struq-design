// why: `npx struq` writes into people's home folders; these pin that it writes only the struq
// folder, only for tools that are present (or named), and that remove leaves other skills alone.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../bin/struq.mjs', import.meta.url));

function home(...tools) {
  const dir = mkdtempSync(join(tmpdir(), 'struq-home-'));
  for (const tool of tools) mkdirSync(join(dir, tool), { recursive: true });
  return dir;
}

function struq(dir, args = [], cwd = dir) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, HOME: dir, USERPROFILE: dir },
  });
}

const skill = (...parts) => join(...parts, 'struq', 'SKILL.md');

test('installs for every tool it finds, and only those', () => {
  const dir = home('.claude', '.cursor');
  const result = struq(dir);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(skill(dir, '.claude', 'skills')));
  assert.ok(existsSync(skill(dir, '.cursor', 'skills')));
  assert.ok(!existsSync(skill(dir, '.agents', 'skills')), 'Codex was not installed, so nothing goes to its folder');
  assert.match(result.stdout, /Claude Code/);
  assert.match(result.stdout, /Cursor/);
});

test('falls back to Claude Code and says so when no tool is found', () => {
  const dir = home();
  const result = struq(dir);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(skill(dir, '.claude', 'skills')));
  assert.match(result.stdout, /No AI tool found/);
});

test('a tool flag installs for that tool only', () => {
  const dir = home('.claude', '.cursor');
  const result = struq(dir, ['--codex']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(skill(dir, '.agents', 'skills')));
  assert.ok(!existsSync(skill(dir, '.claude', 'skills')));
  assert.ok(!existsSync(skill(dir, '.cursor', 'skills')));
});

test('--project installs into the current folder', () => {
  const dir = home();
  const project = join(dir, 'site');
  mkdirSync(project);
  const result = struq(dir, ['--project', '--claude', '--cursor'], project);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(skill(project, '.claude', 'skills')));
  assert.ok(existsSync(skill(project, '.agents', 'skills')));
  assert.ok(!existsSync(skill(dir, '.claude', 'skills')), 'the home folder is left alone');
});

test('running it again replaces the old copy instead of mixing files', () => {
  const dir = home('.claude');
  struq(dir);
  const stale = join(dir, '.claude', 'skills', 'struq', 'removed-in-a-later-version.md');
  writeFileSync(stale, 'old');
  struq(dir);
  assert.ok(!existsSync(stale));
  assert.ok(existsSync(skill(dir, '.claude', 'skills')));
});

test('remove deletes the struq folder and leaves other skills alone', () => {
  const dir = home('.claude');
  const other = join(dir, '.claude', 'skills', 'other', 'SKILL.md');
  mkdirSync(join(dir, '.claude', 'skills', 'other'), { recursive: true });
  writeFileSync(other, 'someone else');
  struq(dir);
  const result = struq(dir, ['remove']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(!existsSync(join(dir, '.claude', 'skills', 'struq')));
  assert.ok(existsSync(other));
});

test('an unknown option stops with a pointer to --help', () => {
  const result = struq(home(), ['--claud']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--help/);
});
