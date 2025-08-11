import { expect, test } from 'vitest'
import { getConfigPath, readConfig } from '../utils/config'

test('Read valid config', () => {
	expect(() => readConfig(getConfigPath("tests/data/valid.yaml"))).toBeDefined();
})

test('Read invalid YAML', () => {
	expect(() => readConfig(getConfigPath("tests/data/error.yaml"))).toThrowError();
})

test('Read invalid config', () => {
	expect(() => readConfig(getConfigPath("tests/data/invalid_schema.yaml"))).toThrowError();
})
