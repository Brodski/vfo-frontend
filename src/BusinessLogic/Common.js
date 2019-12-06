

import { SECRET_KEYS } from '../api-key';
import axios from 'axios';

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
