'use strict';
/**
 * 服务基类
 */
import { Service } from 'egg';

export default class BaseService extends Service {
  model;
  /**
   * 创建
   * @param { Object } body 实体对象
   * @return { Object } 查询结果
   */
  async create(body) {
    const model = this.model;
    const result = await model.create(body);
    return result;
  }

  /**
   * 根据 ID 进行查找
   * @param { Object } query 查询关键字
   * @param { Object } conditions 查询条件
   * @return { Object } 查询结果
   */
  async findAll(query, conditions) {
    const model = this.model;
    if (conditions) {
      if (!conditions.deleted) {
        conditions.deleted = false;
      }
    }
    let builder = model.find(conditions);
    if (query.select) {
      const select = JSON.parse(query.select);
      builder = builder.select(select);
    }

    ['limit', 'skip', 'sort', 'count'].forEach(key => {
      if (query[key]) {
        let arg = query[key];
        if (key === 'limit' || key === 'skip') {
          arg = parseInt(arg);
        }
        if (key === 'sort' && typeof arg === 'string') {
          arg = JSON.parse(arg);
        }
        if (key !== 'count') builder[key](arg);
        else builder[key]();
      }
    });
    const result = await builder.exec();
    return result;
  }

  /**
   * 根据 ID 进行查找
   * @param { Object } query 查询关键字
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async findById(query, id) {
    const model = this.model;
    let select = {};
    let builder = model.findById(id);
    if (query.select) {
      select = JSON.parse(query.select);
      builder = builder.select(select);
    }
    const result = await builder.exec();
    return result;
  }

  /**
   * 根据 id 进行更新
   * @param { Number } id 编号
   * @param { Object } body 实体对象
   * @return { Object } 查询结果
   */
  async updateById(id, body) {
    const model = this.model;
    const result = await model
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .exec();
    return result;
  }

  /**
   * 根据 ID 替换
   * @param { Number } id 编号
   * @param { Object } newDocument 新记录
   * @return { Object } 查询结果
   */
  async replaceById(id, newDocument) {
    const model = this.model;
    await model.findByIdAndRemove(id).exec();
    const result = await model.create(newDocument);
    return result;
  }

  /**
   * 删除记录
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async delete(id) {
    const model = this.model;
    await model.updateOne({ _id: id }, { deleted: true }, {});
    return true;
  }

  /**
   * 物理级别抹除
   * @param { Number } id 编号
   * @return { Object } 查询结果
   */
  async erase(id) {
    const model = this.model;
    await model.findByIdAndRemove(id).exec();
    return true;
  }

  /**
   * 分页
   * @param { Object } query 查询条件
   * @param { String } selectField 需要选出的字段
   * @param { String } populate 关联表
   * @return { Object } 返回查询结果
   */
  async loadByPagination(query, selectField, populate = '') {
    const model = this.model;
    const getCount = queryParams => model.count(queryParams);
    const getSelect = ({ queryParams, sorter, pageSize, start, selectField }) =>
      model
        .find(queryParams)
        .skip(start)
        .limit(pageSize)
        .populate(populate)
        .sort(sorter)
        .select(selectField);

    return await this._pagination(query, getCount, getSelect, selectField);
  }

  /**
   * 构建返回结果
   * @param { Object } query 条件
   * @param { Promise } getCount 数量
   * @param { Promise } getSelect 查询语句
   * @param { Promise } selectField 需要选出的字段
   * @return { Object } 返回查询结果
   */
  async _pagination(query, getCount, getSelect, selectField) {
    const pagination = { current: 1, pageSize: 10, total: 0 };
    const queryParams = {};
    let sorter = [];
    let sorterField;
    for (const key in query) {
      if (key === 'current' || key === 'pageSize') {
        pagination[key] = +query[key];
      } else if (key === 'sorter') {
        if (key === 'sorter') sorterField = query[key];
      } else {
        if (!query[key]) {
          continue;
        }
        queryParams[key] = query[key];
      }
    }
    if (sorterField) {
      sorter = sorterField;
    }
    const current = pagination.current;
    const pageSize = pagination.pageSize;
    const start = (current - 1) * pageSize;
    const result = {
      pagination,
      records: [],
    };
    const [count, records] = await Promise.all([
      getCount(queryParams),
      getSelect({
        queryParams,
        sorter,
        pageSize,
        start,
        selectField,
      }),
    ]);
    result.pagination.total = Array.isArray(count)
      ? count.reduce((pre, cur) => ({ count: pre.count + cur.count }), {
          count: 0,
        }).count
      : count;
    result.records = records;
    return result;
  }
}
