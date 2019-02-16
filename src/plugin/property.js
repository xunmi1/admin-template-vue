import config from '@/config';
import db from '@/libs/db';
import * as util from '@/libs/common/util';

export default {
    $app: config,
    $db: db,
    $util: util,
};
