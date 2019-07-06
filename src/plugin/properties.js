import config from '@/config';
import db from '@/libs/db';
import * as util from '@/libs/util';

export default {
    $app: config,
    $db: db,
    $util: util,
};
