import { ExperienceConfig } from '../types';
import customConfig from './config.json';

// This is the final deployed configuration for the anniversary experience.
// The editor may still save browser-local changes, but every fresh browser/device
// starts from this same shared default configuration.
export const experienceConfig: ExperienceConfig = customConfig as ExperienceConfig;
