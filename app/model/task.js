'use strict';

module.exports = app => {
    /**
     * 任务
     */
    const mongoose = app.mongoose;
    const task = new mongoose.Schema({
        // 用户编号
        userid: String,
        // 标题
        title: String,
        // 目标
        target: String,
        // 描述
        description: { type: String, default: '' },
        // 番茄个数
        num: { type: Number, default: 0 },
        // 是否激活
        isActive: { type: Boolean, default: false },
        // 是否已完成
        finished: { type: Boolean, default: false },
        // 是否已删除
        deleted: { type: Boolean, default: false },
        // 创建时间
        create_at: { type: Date, default: Date.now },
        // 更新时间
        update_at: { type: Date, default: Date.now },
    });

    task.index({ create_at: -1 });
    task.index({ userid: 1, create_at: -1 });

    return mongoose.model('task', task);
};
