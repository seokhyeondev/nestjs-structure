type QueryOperaion = 'contains' | 'startsWith' | 'endsWith' | 'equals' | 'not' | 'in' | 'notIn' | 'lt' | 'lte' | 'gt' | 'gte' | 'search';
const PAGINATION_FIELD = ['take', 'skip', 'orderByField', 'orderBySort'];
export default class QueryBuilderService {
  public static enumsField = ['gender', 'accepted', 'state', 'category'];
  public static dateField = [
    'createAt',
    'updateAt',
    'deleteAt',
    'birth',
    'usedAt',
    'acceptAt',
    'startDate',
    'endAt',
    'recent',
    'reservateDate',
    'outDate',
    'startTime',
    'endTime',
    'checkAt',
  ];
  public static numberField = [];
  public static jsonField = ['data'];

  public static buildFindUnique(idKey: string, id: string, include?: any) {
    const includes = include || {};
    Object.entries(includes).forEach(([key, take]) => {
      if (typeof take === 'boolean') {
        return take;
      } else if (typeof take === 'number') {
        includes[key] = {
          take,
        };
      } else {
        includes[key] = take;
      }
    });
    return {
      where: {
        [idKey]: id,
      },
      ...(include && {
        include: {
          ...includes,
        },
      }),
    };
  }

  public static buildQueryWhere(arg: any, containDeleted = true) {
    const { orderByField, orderBySort, take, skip } = arg;
    //query Object 재구성하는 거 임시 구현
    //나중에 쿼리빌더 수정할 때 다시 로직 짜기
    PAGINATION_FIELD.forEach((field: string) => {
      delete arg[field];
    });
    const query = { ...arg };
    let where: any = {};
    const orderBy: any = {};
    //   Object.keys(query).forEach(e => (where[e] = this.buildWhere2({ key: e, value: query[e], operation: query[`${e}_operation`] ?? undefined })));
    //TODO 날짜 다시 생각해보기
    where = this.buildDate(where, query);
    Object.keys(query).forEach(e => {
      where = { ...where, ...this.buildWhere({ key: e, value: query[e], operation: query[`${e}_operation`] ?? undefined }) };
    });

    if (!where['deleteAt'] && containDeleted) {
      where['deleteAt'] = null;
    }
    if (orderByField) {
      orderBy[orderByField] = orderBySort || 'desc';
    } else {
      orderBy.createAt = 'desc';
    }
    return {
      where,
      take,
      skip,
      orderBy,
    };
  }
  public static buildCount(arg: any, containDeleted = true) {
    //query Object 재구성하는 거 임시 구현
    //나중에 쿼리빌더 수정할 때 다시 로직 짜기
    PAGINATION_FIELD.forEach((field: string) => {
      delete arg[field];
    });
    const query = { ...arg };
    let where: any = {};
    /*Object.keys(query)
      .filter(key => !key.endsWith('_operation'))
      .forEach(e => {
        where[e] = this.buildWhere2({ key: e, value: query[e], operation: query[`${e}_operation`] ?? undefined });
      });*/
    where = this.buildDate(where, query);
    Object.keys(query).forEach(e => {
      where = { ...where, ...this.buildWhere({ key: e, value: query[e], operation: query[`${e}_operation`] ?? undefined }) };
    });
    if (!where['deleteAt'] && containDeleted) {
      where['deleteAt'] = null;
    }
    return {
      where,
    };
  }

  private static buildDate(where: any, query: any) {
    Object.keys(query).forEach(key => {
      if (query[key]) {
        const dateField = this.dateField.find(field => key.includes(field));
        if (dateField) {
          const result = {
            [dateField]: {
              gte: query[`start_${dateField}`] || new Date(1995, 5, 15),
              lte: query[`end_${dateField}`] || new Date(2999, 12, 31),
            },
          };
          delete query[`start_${dateField}`];
          delete query[`end_${dateField}`];
          where = { ...where, ...result };
        }
      }
    });
    return where;
  }

  public static buildWhere(arg: { key: string; value: any; operation?: QueryOperaion }) {
    const { key, value, operation } = arg;
    if (!value) {
      if (this.dateField.includes(key) || this.enumsField.includes(key)) return undefined;
    }

    //임시
    if (value === 'all') {
      return {
        NOT: [
          {
            [key]: undefined,
          },
        ],
      };
    } else if (!this.enumsField.includes(key) && typeof value === 'string') {
      return {
        [key]: {
          contains: value,
        },
      };
    } else {
      return {
        [key]: value,
      };
    }
  }

  public static buildWhere2(arg: { key: string; value: any; operation?: QueryOperaion }) {
    const { key, value, operation } = arg;

    if (!value) {
      return undefined;
    }
    if (this.dateField.includes(key)) {
      if (!operation) {
        return {
          gte: value[0],
          lte: value[1],
        };
      } else {
      }
    } else if (this.enumsField.includes(key)) {
      if (!operation) {
        return value;
      } else {
      }
    } else {
      if (!operation) {
        if (typeof value === 'string') {
          if (value === 'all') {
            return {
              NOT: [
                {
                  [key]: null,
                },
              ],
            };
          }
          return {
            contains: value,
          };
        } else {
          return value;
        }
      } else {
        return {
          [operation]: value,
        };
      }
    }
  }

  public static cast(key, value) {
    if (this.dateField.includes(key)) {
      //  return dayjs(value);
    }

    if (this.numberField.includes(key)) {
      return (value *= 1);
    }
  }
}
