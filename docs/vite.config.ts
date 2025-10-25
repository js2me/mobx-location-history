import { defineDocsBuildConfig } from 'sborshik/vitepress';
import { ConfigsManager } from 'sborshik/utils';

export default defineDocsBuildConfig(ConfigsManager.create('../'));
