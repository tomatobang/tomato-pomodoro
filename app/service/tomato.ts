'use strict';

import BaseService from './base';
export default class TomatoService extends BaseService {
    constructor(ctx) {
        super(ctx);
        this.model = this.ctx.model.Tomato;
    }

    /**
     * daily statistics
     * @param { Number } userid 用户编号
     * @param { Date } startTime 开始时间
     * @param { Date } endTime 结束时间
     * @param { Boolean } succeed 番茄钟未中断
     * @return { Object } 查询结果
     */
    async statistics(userid, startTime, endTime, succeed) {
        const Tomato = this.ctx.model.Tomato;

        const res = await Tomato.aggregate([
            {
                $match: {
                    userid,
                    succeed: parseInt(succeed),
                    startTime: { $gte: new Date(startTime), $lte: new Date(endTime) },
                },
            },
            {
                $project: {
                    // 校准日期并格式化
                    startTime: { $substr: [{ $add: ['$startTime', 28800000] }, 0, 10] },
                    succeed: 1,
                },
            },
            {
                $group: {
                    _id: '$startTime',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        return res;
    }
}
