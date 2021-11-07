import { bootstrap } from './bootstrap';
import tracker from './tracker';
import docker from './docker';

const scripts = [
  tracker,
  docker,
];

bootstrap(scripts);
